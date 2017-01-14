/**
 * User hefeng
 * Date 2017/1/13
 */
define([
	'backbone.marionette',
	'collections/table-collection',
	'views/table-item-view'
], function(Marionette, TableCollection, TableItemView) {
	var tableList = new TableCollection;

	return Marionette.View.extend({
		el: 'tbody',

		initialize: function() {
			this.listenTo(tableList, 'add', this.addItem);
			this.listenTo(tableList, 'all', _.debounce(this.render, 0));

			tableList.fetch(); //{reset:true, remote:true}
		},

		render: function(p1, p2, p3) {
			console.log(p1, p2, p3);
		},

		addItem: function(itemModel) {
			var itemView = new TableItemView({ model: itemModel });
			this.$el.append(itemView.render().el);
		},

		createItem: function(attrs) {
			tableList.create(attrs);
		},

		checkedAll: function(state) {
			tableList.each(function(itemModel) {
				itemModel.toggle(state);
			})
		},

		checkedSome: function() {
			tableList.each(function(itemModel) {
				itemModel.some();
			})
		}
	});
});
