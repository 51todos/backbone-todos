/**
 * table-item-model
 */
define(function() {
	// item template
	var itemTpl = [
		'<td><%=cid%></td>',
		'<td><%=name%></td>',
		'<td><%=sex%></td>',
		'<td><%=email%></td>',
		'<td><a href="javascript:void(0);" id="J_action-del-<%=cid%>">删除</a></td>'
	].join('');

	return Backbone.View.extend({
		tagName: 'tr',

		template: _.template(itemTpl),

		events: {
			'click a[id^=J_action-del]': 'action_del'
		},

		initialize: function() {
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function() {
			this.$el.html(this.template(_.extend(this.model.toJSON(), {cid:this.model.cid})));
			return this;
		},

		action_del: function() {
			this.model.destroy();

			/*var $target = $(evt.target);
			 var cid, eleId = $target.attr('id');

			 if(/.*(c\d+)$/ig.test(eleId)) {
			 cid = RegExp.$1;
			 tableList.remove(tableList.get(cid));
			 } else {
			 console.error("删除失败");
			 }*/
		}
	});
});
