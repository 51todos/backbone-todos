/**
 * User hefeng
 * Date 2017/2/7
 */
define([
	'tpl!test/model/main.tpl'
], function(modelMainTpl) {
	return {
		start: function() {
			var model = new Epoxy.Model({price:100});
			model.addComputed("formattedPrice", {
				deps: ["price"],
				get: function( price ) {
					return "$"+ price;
				},
				set: function( value ) {
					return {price: parseInt(value.replace("$", ""))}
				}
			});

			console.log( model.get("formattedPrice") ); // '$100'
			model.set("formattedPrice", "$150");
			console.log( model.get("price") ); // 150

			var BindingView = Backbone.Epoxy.View.extend({
				el: _.template(modelMainTpl),
				model: new Backbone.Model({firstName:"He", lastName:"Feng"}),
				bindings: "data-bind",
				render: function() {
					this.$el.appendTo("body");
				}
			});

			var bindingView = new BindingView;

			bindingView.render();
		}
	}
});