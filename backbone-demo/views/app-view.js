/**
 * User hefeng
 * Date 2017/1/13
 */
define([
	'require', 'exports', 'module',
	'views/table-view'
], function(require, exports, module, TableView) {

	module.exports = Backbone.View.extend({
		el: '.container',

		initialize: function() {
			this.tableView = new TableView();
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
			var that = this;
			var $btn = this.$(':button');
			var $checkAll = this.$('#J_checkedAll');
			var $checkSome = this.$('#J_checkedSome');

			// 新增按钮
			$btn.on('click', function() {
				var params = that._getParams();

				/*var itemModel = new Backbone.Model(params);
				that.tableView.addItem(itemModel);*/

				that.tableView.createItem(params);

				//tableList.set([itemModel]);
				//tableList.push(itemModel);
			});

			// 全部选中
			$checkAll.on('click', function() {
				that.tableView.checkedAll($(this).is(":checked"));
			});

			// 部分选中
			$checkSome.on('click', function() {
				that.tableView.checkedSome();
			});
		}
	})

});
