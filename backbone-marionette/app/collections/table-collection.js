/**
 * User hefeng
 * Date 2017/1/13
 */
define([
	'app/models/table-item-model'
], function(TableItemModel) {

	return Backbone.Collection.extend({
		model: TableItemModel,

		localStorage: new Backbone.LocalStorage('backbone-marionette')

	});

});
