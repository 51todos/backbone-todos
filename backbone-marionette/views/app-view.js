/**
 * User hefeng
 * Date 2017/1/13
 */
define([
	'require', 'exports', 'module',
	'backbone.marionette',
	'views/table-view',
	'tpl!templates/app-container-tpl.html'
], function(require, exports, module, Marionette, TableView, AppTpl) {

	module.exports = Marionette.View.extend({
		el: '#J_app-container',

		template: _.template(AppTpl),

		ui: {
			createBtn: ':button',
			checkedAll: '#J_checkedAll',
			checkedSome: '#J_checkedSome'
		},

		events: {
			'click @ui.createBtn': 'createOne',
			'click @ui.checkedAll': 'checkedAll',
			'click @ui.checkedSome': 'checkedSome'
		},

		initialize: function() {
			this.render();
		},

		_getParams: function() {
			var $form = this.$('form');
			return {
				name: $form.find('[name="name"]').val(),
				sex: $form.find('[name="sex"]').val(),
				email: $form.find('[name="email"]').val()
			}
		},

		render: function() {
			this.$el.append(this.template());
			this.tableView = new TableView();
		},

		createOne: function() {
			var params = this._getParams();
			this.tableView.createItem(params);
		},

		checkedAll: function(evt) {
			this.tableView.checkedAll($(evt.target).is(":checked"));
		},

		checkedSome: function() {
			this.tableView.checkedSome();
		}
	})

});
