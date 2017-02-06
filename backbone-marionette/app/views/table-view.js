/**
 * User hefeng
 * Date 2017/1/13
 */
define([
	'app/collections/table-collection',
	'app/views/table-item-view',
	'tpl!app/templates/table.tpl'
], function(TableCollection, TableItemView, tableTpl) {
	var tableList = new TableCollection;

	return Marionette.View.extend({
		className: 'container-fluid',

		template: _.template(tableTpl),

		initialize: function() {
			this.listenTo(tableList, 'add', this.addItem);
			this.listenTo(tableList, 'all', _.debounce(this.allEvts, 0));
		},

		allEvts: function(p1, p2, p3) {
			console.log("Trigger event:", p1, p2, p3);
		},

		onRender: function() {
			tableList.fetch(); //{reset:true, remote:true}
		},

		addItem: function(itemModel) {
			var itemView = new TableItemView({ model: itemModel });
			this.$el.find('tbody').append(itemView.render().el);
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
