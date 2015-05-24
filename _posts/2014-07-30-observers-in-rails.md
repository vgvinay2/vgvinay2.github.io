---
layout: post
title:  "Observers in Rails"
categories: ruby
comments: true
description: ActiveRecord Observers
tags: 
  - ruby
  - rails
author: Nithin Krishna
handle: "nithinkrishh"
---

##Life without Observers

Let's say you need to listen to changes in a model's attributes and trigger some events based on those changes. If you look at the following example, I've done exaclty that. If the status of application is changed an email is sent.

{% highlight ruby %}
class Application < ActiveRecord::Base
	
  after_save :email_confirmation

  def open?
    status == 'Open'
  end

  def closed?
    status == 'Closed'
  end

  def pending?
    status == 'Pending'
  end

  def email_confirmation
    if status_changed?
      ApplicationMailer.closed_notification(self)  if closed?
      ApplicationMailer.open_notification(self)  if open?
      ApplicationMailer.pending_notification(self)  if pending?
    end
  end

end
{% endhighlight %}

The above piece of code _violates_ the __Single Responsibility Principle__, which states that each class should have "only one responsiblilty". The `Application` model should only deal with saving and manupluating the application object. Sending emails is not part of it's responsiblity.

---
<br />

##ActiveRecord::Observers

We can delegate the responsiblity of observing changes in model attibutes and responding to those changes, to a seperate Observer class. Model specific event handling is much cleaner this way. This way, we can refrain from polluting the model by adding not un-necessary methods.

{% highlight ruby %}
class ApplicationObserver < ActiveRecord::Observer

  def after_save(appl)
    if status_changed?
      ApplicationMailer.closed_notification(appl)  if appl.closed?
      ApplicationMailer.open_notification(appl)  if appl.open?
      ApplicationMailer.pending_notification(appl)  if appl.pending?
    end
  end

end
{% endhighlight %}

You can read more about the observer design pattern [here](http://sourcemaking.com/design_patterns/observer).

---
<br />

##Note

1. Observer names are infered form the model names. So if you name your observer as `ApplicationObserver`, rails knows that it's observing the `Application` model.
2. Your observers need not be model specific. SRP states that "Responsibility should be entirely encapsulated by the context". So by this definition you can have a single observer which listens to changes in multiple models and perfom a single function say, sending an email or publishing a notification. To acomplish this you can use the `ActiveRecord::Observer.observe` method.
3. Place your observers in `app/models` or `app/models/observers`.
4. Finally, Observers have been __removed__ form the rails core after `Rails 3.2`. You need to include the `rails-observers` gem to use observers in later rails versions.

---
