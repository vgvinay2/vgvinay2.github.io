---
layout: post
title:  "Javascript Promises"
categories: javascript
comments: true
description: Getting started with javascript promises
keywords: javascript, promises, javascript promises, callback hell, $q, Q
tags: ["javascript", "promises", "callbacks"]
author: Nithin Krishna
handle: nithinkrishh
---

## Callback Hell?

A **callback** is a block of code passed an an argument to a function, which can be executed by the function at a suitable time. There is nothing wrong with callbacks, but when you have conditions where you have multiple callbacks nested within each other, it becomes very messy. 

There is no way you can avoid such a condition, the asynchronous nature of javascript ensures that you often have multiple unknowns at some point in time.

Let's dig into the problem. Consider I am writing an application where I have to find out all the restaurants within a km radius of the user's location, I write something like this.

{% highlight javascript %}
function getRestaurants(){
    navigator.geolocation.getCurrentPosition(function(position){
		$.get("http://myurl.com/getrestaurants",{ 
                        coordinates: position 
                }, function(restaurants){
			console.log(restaurants)
		},function(){
			console.log("Unable to process request")
		})
	}, function(){
		console.log("Unable to process request")
	})
}
{% endhighlight %}

Fair enough? What if after I got the list of restaurants I needed to make another API call to order
them based on rating. I'd do something like

{% highlight javascript %}
function getRestaurants(){
	navigator.geolocation.getCurrentPosition(function(position){
		$.get("http://myurl.com/getrestaurants",{ 
	          coordinates: position 
	      }, function(restaurants){
			$.get("http://myurl.com/orderRestaurants",{ 
	              restaurants: restaurants
	          }, function(orderedRestaurants){
				console.log(orderedRestaurants)
			},function(){
				console.log("Unable to process request")
			})
		},function(){
			console.log("Unable to process request")
		})
	}, function(){
		console.log("Unable to process request")
	})
}
{% endhighlight %}

What if I'd have to make a 4rd API call. Pretty messy right?. Welcome to callback hell. Bwhahaha. You can name your callbacks and make your code more readable, But there is a better way of handling this situation.

## Promises

Before going into what they are all about, We'll see what will happen to our code when we use promises.

{% highlight javascript %}
function getRestaurants(){
	var getLocation = function(){
		var deferred = $q.defer();
		navigator
			.geolocation
			.getCurrentPosition(deferred.resolve, deferred.reject)
		retrun deferred.promise;
	}

	var getCollection = function(){
		var deferred = $q.defer();
		AJAX.get("http://myurl.com/getrestaurants",{ 
			coordinates: position.coords 
		}, deferred.resolve, deferred.reject)
		retrun deferred.promise;
	}

	var processRestaurants = function(restaurants){
		console.log("Restaurants in your location " + restaurants)
	}

	getLocation()
		.then(getCollection)
		.then(processRestaurants)
}
{% endhighlight %}

Cool Right? We are able to write asynchronous code in a synchronous manner. 
What if you had n nested callbacks, how would you handle that? Consider this example.

{% highlight javascript %}
function getData(){
	var api_call = function(url){
		var deferred = $q.defer()
		$http.get(url, deferred.resolve, deferred.reject)
		return deferred.promise
	}
	var aggregateData = function(results){
         var aggregatedData = []
         angular.forEach(results, function(result){
         aggregatedData.push(result.data)
        })
        return aggregatedData
    }
    var res = $q.all([ 
        api_call('organizations'),
        api_call('members'),
        api_call('projects'),
        api_call('collaborator')
    ]).then(aggregateData)

    return res;
}
{% endhighlight %}

Though the time taken for the completion of each API call might varie, the resultant data array will be in the order of, the results from the functions which you pass to $q.all. This in an asynchronous environment is very powerful.

Example [http://jsfiddle.net/U3pVM/4914/](http://jsfiddle.net/U3pVM/4914/)

## Getting Started with promises

* A promise represents some value that is not known yet (i.e) a placeholder for unknown data. 
* A defered represents function that computes the promise. 
* A promise can be resolved or rejected. 
* Angular Js and Node Js have their own implementation of Promises. I've used the angular js implementation in the above examples.
* There is no standard implementation for javascript promises you can build your own, if you like. 
* It's key to note that there might be subtle differences between implementations, they might differ by the number of state handlers per promise, or sometimes even performance but the basic idea is the same.


## Implementing you own promise object

This is a simple 10 minute implementation of a promise. The promise object maintains an array of pending callbacks. When ever the 'then' function is called, callbacks are pushed into this array. When the promise is resolved or rejected the corresponding set of callbacks are executed.

{% highlight javascript %}
var Promise = function(){
	this.pending = [];
}

Promise.prototype = {
	then: function(onResolve, onReject){

		this.pending.push({ 
			resolve: onResolve, 
			reject: onReject 
		})

		return this
	},

	resolve: function(data){
		this.then = function(reject, resolve){ 
			resolve && resolve(data) 
		}

		this.executePending('resolve', data)
	},

	reject: function(data){
		this.then = function(reject, resolve){ 
			reject && reject(data) 
		}

		this.executePending('reject', data)
	},

	executePending: function(type, data){
		var p, i = 0
		while (p = this.pending[i++]) { 
			p[type] && p[type](data) 
		}

		delete this.pending
	}
}
{% endhighlight %}

Example: [http://jsfiddle.net/4e3rV/1/](http://jsfiddle.net/4e3rV/1/)

## But where?

Everywhere. Cleanup your javascript code. Replace nested callbacks during sequential API calls, animations (etc) with promises. Promises are a great programming paradigm which have to be vigorously exploited.

