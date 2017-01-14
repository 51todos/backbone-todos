define(['tpl!app/view/record/sub/templates/repairAmt.tpl'],function(Tpl){
	var ItemView = Marionette.ItemView.extend({
		template: _.template("<td class='repairamt-oprtype'><%= oprType %></td><td class='repairamt-amt'><%= amt %></td><td class='repairamt-oprtime'><%= oprTime %></td><td class='repairamt-descr'><%= descr %></td>"),
		tagName: "tr",
		className: 'repair-amt-item',

		templateHelpers: function(){
			var me = this;
			return {
				oprType: me.formatOprType(me.model.get('oprType')),
				oprTime:me.formatOprTime(me.model.get('oprTime') || "")
			}
		},

		formatOprType: function(val){
			//1：增调 2：减调 3：已截留 9：解冻申请 8：解冻停止 0：已解冻
			var map = {
				'1': '增调',
				'2': '减调',
				'3': '已截留',
				'9': '解冻申请',
				'8': '解冻停止',
				'0': '已解冻'
			};
			return map[val];
		},

		formatOprTime: function(str){
			return (str || "").replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,'$1-$2-$3 $4:$5:$6');
		}

	});

	var CompositeView = Marionette.CompositeView.extend({
		template: Tpl,
		itemView: ItemView,
		itemViewContainer: 'tbody',
		className: 'repair-amt-table',
		ui: {
			previous: '.previous',
			next: '.next'
		},

		initialize: function(options){
			this.collection = options.collection;
			this.totalData = options.totalData;
		},

		serializeData: function(){
			return {
				repaireAmt: this.totalData.repairAmt || '0',
				repairedAmt:this.totalData.repairedAmt || '0',
				unRepairAmt:this.totalData.unRepairAmt || '0',
				unfreezeSum:this.totalData.unfreezeSum || '0'
			}
		},


		onRender: function(){
			var me = this,
				ui = me.ui;

			//更新按钮状态，只在 render 时做一次
			ui.previous.toggleClass('disabled', me.collection.state.isFirstPage);
			ui.next.toggleClass('disabled', me.collection.state.isLastPage);



			me.$el.dialog({
				title: '',
				autoOpen: true,
				modal: true,
				width: 926,
				draggable: false,
				resizable: false,
				create: function () {
					$(this).closest('.ui-dialog').addClass('repair-amt-dialog');
					$(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').addClass('icon-remove');
				},
				open: function(){
					var $dialog = $(this).closest('.ui-dialog');
					$dialog.outerWidth(_.min([$dialog.outerWidth(),$(window).width()]));

				},
				close: function(event, ui) {
					$(this).dialog('destroy');
				}
			});
			this.addListener();
		},

		addListener: function(){
			var me = this,
				ui = me.ui;
			ui.previous.on('click', function(){
				me.collection.getPreviousPage();
			});
			ui.next.on('click', function(){
				me.collection.getNextPage();
			});
			this.collection.on('sync', function(collection, resp){
				ui.previous.toggleClass('disabled', collection.state.isFirstPage);
				ui.next.toggleClass('disabled', collection.state.isLastPage);

			});
		}

	});

	return CompositeView;
});