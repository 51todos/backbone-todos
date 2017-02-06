/**
 * User hefeng
 * Date 2017/2/6
 */
define([
	'tpl!app/templates/search.tpl'
], function(searchTpl) {

	return Mn.View.extend({
		template: _.template(searchTpl),

		ui: {
			addItemBtn: '#J_add-item',
			checkedAllBtn: '#J_checkedAll',
			checkedSomeBtn: '#J_checkedSome'
		},

		events: {
			'click @ui.addItemBtn': 'onAddItem',
			'click @ui.checkedAllBtn': 'onCheckedAll',
			'click @ui.checkedSomeBtn': 'onCheckedSome'
		},

		initialize: function(options) {
			this.options = options;
			this.parent = options.context
		},

		_getParams: function() {
			var $form = this.$('form');
			return {
				name: $form.find('[name="name"]').val(),
				sex: $form.find('[name="sex"]').val(),
				email: $form.find('[name="email"]').val()
			}
		},

		onAddItem: function() {
			var params = this._getParams();

			this.parent.tableView.createItem(params);
		},

		onCheckedAll: function(evt) {
			this.parent.tableView.checkedAll($(evt.target).is(":checked"));
		},

		onCheckedSome: function() {
			this.parent.tableView.checkedSome();
		}
	});
});
