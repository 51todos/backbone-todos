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

		// Toggle the `state`
		toggle: function (newState) {
			this.save({
				state: newState //!this.get('state')
			});
		}
	});

});
