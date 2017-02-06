/**
 * User hefeng
 * Date 2017/1/13
 */
define([
	'app/views/condition-view',
	'app/views/table-view'
], function(ConditionView, TableView) {

	return Mn.View.extend({
		el: '.container',

		template: false,

		regions: {
			conditionRegion: '#J_app-condition-panel',
			listRegion: '#J_app-list-panel'
		},

		initialize: function() {
			this.conditionView = new ConditionView({context:this});
			this.tableView = new TableView({context:this});
			this.render();
		},

		onRender: function() {
			this.showChildView('conditionRegion', this.conditionView||null);
			this.showChildView('listRegion', this.tableView||null);
		}
	})

});
