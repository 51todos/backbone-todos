/**
 * User hefeng
 * Date 2017/1/13
 */
define([
	'models/table-item-model'
], function(TableItemModel) {

	var TableCollection = Backbone.Collection.extend({
		model: TableItemModel,

		localStorage: new Backbone.LocalStorage('backbone-demo')

		//url: './list.json'
	});

	return TableCollection;
});
