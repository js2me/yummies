# Pub Sub

### SubFn
_No description._


### PubSub
The Publish-Subscribe pattern, which allows objects to interact with each other
through an event system. Subscribers can subscribe to events and receive notifications
when these events occur. The last published data can be accessed through the `data` property.


### createPubSub()
Creates a simple publish-subscribe dispatcher that stores the last published
arguments and allows subscription management.

