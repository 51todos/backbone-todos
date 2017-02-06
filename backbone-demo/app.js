/**
 * User hefeng
 * Date 2017/1/11
 */
define([
	'require', 'exports', 'module', 'jquery',
	'app/views/app-view'
], function(require, exports, module, $, AppView) {

	/*==========================================*/
	/*var man = new Backbone.Model({
		name: "",
		sex: "女",
		age: 32,
		score: 120
	});
	//var man = new person();

	var obj = _.extend({}, Backbone.Events);
	obj.listenTo(man, "change:age", function (model, value) {
		var oldage = model.previous("age");
		var newage = model.get("age");
		if (oldage != newage) {
			console.log("age原值:" + oldage + ",新值:" + newage);
		}
	});
	man.set("age", 37);*/
	/*==========================================*/

	module.exports = {
		start: function() {
			console.log("App start", new AppView);
		}
	};
});
