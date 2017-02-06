/**
 * User hefeng
 * Date 2017/1/11
 */
define([
	'backbone.marionette',
	'backbone.radio'
], function(Mn, Rd) {

	var basicChannel = Rd.channel('basic');
	var testChannel = Rd.channel('test');

	basicChannel.on('basic:channel', function() {
		console.log("basicChannel");
	});

	testChannel.on('test:channel', function() {
		console.log("testChannel");
	});
	testChannel.reply('test:channel');

	var TestObject = Mn.Object.extend({

		initialize: function() {
			this.listenTo(testChannel, 'test:channel', this.leftBuilding);
			this.listenTo(testChannel, 'test:enterChannel', function(person) {
				console.log(person.get('name') + ' has entered the building!');
			});

			basicChannel.reply('user:logged:in', this.isLoggedIn);
		},

		leftBuilding: function(person) {
			console.log(person.get('name') + ' has left the building!');
		},

		isLoggedIn: function(options) {
			var model = this.model = options.model;
			return model.getLoggedIn();
		}
	});

	var NotificationHandler = Mn.Object.extend({
		channelName: 'notify',

		radioRequests: {
			'show:success': 'showSuccessMessage',
			'show:error': 'showErrorMessage'
		},

		radioEvents: {
			'user:logged:in': 'showProfileButton',
			'user:logged:out': 'hideProfileButton'
		},

		showSuccessMessage: function(message) {
			console.log(message);
		},

		showErrorMessage: function(message) {
			console.log(message);
		},

		showProfileButton: function(user) {
			console.log(user.get("name"), user.get("sex"));
		},

		hideProfileButton: function(user) {
			console.log(user.get("name"), user.get("sex"));
		}
	});

	return {
		start: function() {
			var testObject = new TestObject();
			var testChannel = Rd.channel('test');
			var basicChannel = Rd.channel('basic');
			var personModel = new Backbone.Model({name:"hefeng"});

			// Events
			basicChannel.trigger('basic:channel');
			testChannel.trigger('test:channel', personModel);
			testChannel.trigger('test:enterChannel', personModel);

			// request
			var LoginModel = Backbone.Model.extend({
				defaults: {
					isAuth: false
				},

				getLoggedIn() {
					return this.get('isAuth');
				}
			});
			var loggedIn = basicChannel.request('user:logged:in', {model: new LoginModel()});
			console.log("loginedIn", loggedIn);

			// Events & Requests
			var notifyChannel = Rd.channel('notify');
			var userModel = new Backbone.Model({
				name: "hefeng",
				sex: "male"
			});

			new NotificationHandler;
			notifyChannel.request('show:error', 'A generic error occurred!');
			notifyChannel.trigger('user:logged:in', userModel);
		}
	};
});
