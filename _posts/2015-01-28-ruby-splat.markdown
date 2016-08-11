---
layout: post
title:  "Ruby Splat"
categories: programming
comments: true
description: Understanding the Ruby Splat
keywords: ruby, splat, rails, ruby on rails
tags: ["ruby", "design patterns", "decorator", "ruby on rails"]
author: Vinay
handle: vgvinay2
---

Ruby is more dynamic in nature.
{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]   #=> [:first, :second, :third, :fourth]
a1 = :first, :second, :third, :fourth  #=> [:first, :second, :third, :fourth]

{% endhighlight %}

                                                                       

{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]
a2 = [:before, a1, :after]
p a2   => [:before, [:first, :second, :third, :fourth], :after]
p a2.flatten   => [:before, :first, :second, :third, :fourth, :after]

{% endhighlight %}

                                                                       
                                                                       
{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]
a2 = [:before, *a1, :after]
p a2   => [:before, :first, :second, :third, :fourth, :after]

{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

x, y, z = 1, 2, 3
p x, y, z

{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]
x, y, z = *a1
p x, y, z

{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]
x, y, z = :before, *a1
p x, y, z

{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]
*x, y, z =  *a1
p *x, y, z

{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]
x, *y, z =  *a1
p x, *y, z

{% endhighlight %}
                                                                       
                                                                       
   This is the common practice that we used with methods parameter
{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]
x, y, *z =  *a1
p x, y, *z

{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

a1 = [:first, :second, :third, :fourth]
first, *rest = *a1
p first, *rest

{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

def sum3(x, y, z)
  x + y + z
end

triangle = [1,2,3]
p sum3(*triangle)


{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

def greet(greeting, *names)
  names.each do |name|
    p " {greeting}!! {name} "
  end
end
greet('Good Morning', 'Vinay', 'John', 'Shane')

{% endhighlight %}
                                                                       
                                                                       
{% highlight ruby %}

def randon_draw(num_times, num_draws)
  num_times.times do
    draws = num_draws.times.map{ rand(10)}
    yield(*draws)
  end
end

randon_draw(5, 3) do |first, *rest|
  p " {first}  {rest}  "
end

{% endhighlight %}