define([
    'app/view/bill/Bill',
    'app/view/bill/EachDayComView',
    'app/store/SettleRecordCollection',
    'moment',
    'datepicker'
    ], function(BillView, EachDayView, SettleRecordCollection) {

    var Ctrl =  Marionette.Controller.extend({

        initialize: function () {
            console.log('bill ctrl init ');

            var me = this;
            this.view = null;

            this.collection = new SettleRecordCollection();
        },

        onViewQuery: function(data){
            var view = this.view;

            console.log('控制器获取对账单数据, 参数', data);

            //后台接口，当没有传terminal表示搜索所有终端号            
            if(data.terminal === 'all') {
                data.terminal = null;
            }


            this.collection.applyQueryParam(data).getFirstPage();

            // Opf.ajax({
            //     autoMsg: false,
            //     url: Ctx.url('bill.algo.details'),
            //     type: 'GET',
            //     data: data,
            //     success: function(resp){
            //         view.update(resp);
            //     },
            //     error: function () {
            //         view.clear();
            //     },
            //     complete: function () {
            //         view.triggerMethod('after:update');
            //     }
            // });
        },

        _attatchEvents: function(){
            var me = this;
            var view = me.view;

            view.on('bill:query:by:date:tn', _.bind(this.onViewQuery, this));
            
            view.on('previous:page', function () {
                me.collection.getPreviousPage();
            });

            view.on('next:page', function () {
                me.collection.getNextPage();
            });
        },

        //绘制对账单主页面，一般情况下只会渲染一次
        //但从结算记录跳转过来时还需要渲染一下，此时options有startDate、endDate
        confirmBillMainPanel: function (options) {
            if(!this.view || (options.startDate && options.endDate)) {
                var options = _.extend({},{collection: this.collection},options);
                this.view = new BillView(
                    options
                );
                this._attatchEvents();
                App.billRegion.show(this.view);
            }
        },

        show: function (options) {
            var me = this;
            options = options || {};

            this.confirmBillMainPanel(options);
        }

    });

    return new Ctrl();
});