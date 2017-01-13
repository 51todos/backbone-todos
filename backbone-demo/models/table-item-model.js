/**
 * table-item-model
 */
define(function() {

	return Backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			name: '',
			sex: '',
			email: '',
			state: false
		},

		// Toggle the `state` state of this todo item.
		toggle: function () {
			this.save({
				state: !this.get('state')
			});
		}
	});

});
