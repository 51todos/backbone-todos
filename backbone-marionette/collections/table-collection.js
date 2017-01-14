/**
 * User hefeng
 * Date 2017/1/13
 */
define([
	//'backbone.marionette',
	'models/table-item-model'
], function(TableItemModel) {

	var TableCollection = Backbone.Collection.extend({
		model: TableItemModel,

		localStorage: new Backbone.LocalStorage('backbone-marionette')

		//url: './list.json'
	});

	return TableCollection;
});
