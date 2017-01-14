/**
 * table-item-model
 */
define([
	'tpl!templates/table-item-tpl.html'
], function(itemTpl) {

	return Backbone.View.extend({
		tagName: 'tr',

		template: _.template(itemTpl),

		events: {
			'click a[id^=J_action-del]': 'action_del',
			'click :checkbox': 'action_cb'
		},

		initialize: function() {
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'change:state', this.changeState);
		},

		render: function() {
			this.$el.html(this.template(_.extend(this.model.toJSON(), {cid:this.model.cid})));
			return this;
		},

		changeState: function(model, state) {
			this.$el.find(':checkbox').prop('checked', state);
		},

		action_cb: function(evt) {
			this.model.save({state:$(evt.target).is(":checked")}, {merge:true});
		},

		action_del: function() {
			this.model.destroy();
		}
	});
});
