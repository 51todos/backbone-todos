define([
    'tpl!app/view/txn/templates/flowItem.tpl',
    'tpl!app/view/txn/templates/dayFlows.tpl',
    'moment'
], function (rowTpl, tpl) {

    var RowView = Marionette.ItemView.extend({
        tagName: "tr",
        className: "tr-flow-row pointer light-blue-activable",
        template: rowTpl,

        triggers: {
            'click': 'click'
        }
    });


    var TableView = Marionette.CompositeView.extend({
        className: 'day-flows',
        itemView: RowView,
        itemViewContainer: ".flow-items-wrap",

        template: tpl,

        events: {
        },

        triggers: {
            'click .more-trigger': 'more:summary:pick'
        },

        ui: {
            pageInfoText: '.page-info .text',
            pre: '.previous',
            next: '.next'
        },

        constructor: function (options) {
            var me = this;
            Marionette.CompositeView.prototype.constructor.apply(this, arguments);

            _.each(options._events, function (fn, ev) {
                me.on(ev, fn.fn ? fn.fn : fn, fn.scope || null);
            });
        },

        busy: function (toggle) {
            Opf.UI.setLoading(/*this.ui.body, */toggle);
        },
        onDataSync: function () {
            this.busy(false);
        },
        
        updatePageInfo: function (store, resp) {
            var page = resp.page;
            var pageInfoTxt;

            if(page.totalCount == '0') {

                pageInfoTxt = '共 0 笔';

            }else {

                pageInfoTxt = Opf.String.format('第 {0}~{1}笔 / 共 {2}笔',
                    page.startIndex + 1,
                    page.startIndex + store.length,
                    page.totalCount
                );
            }
            
            this.ui.pageInfoText.text(pageInfoTxt);
            this.ui.pre.toggleClass('disabled', !page.previous);
            this.ui.next.toggleClass('disabled', !page.next);

        },

        onRender: function () {
            console.log('txn view onrender');
        },

        xserializeData: function () {
            //  "id": "20140523000000000016",
            // "date": "20140523",
            // "time": "113213",
            // "amt": 0.05,
            // "bankNo": "310290000013",
            // "stat": "4",
            // "fdxxx": "银联收不到发卡行应答",
            // "acNo": "6225000000000212",
            // "traceNo": "000000000016",
            // "iboxNo": "50000002",
            // "signature": ""

            // <date: [item,...]>
            var groups = _.groupBy(this.collection.toJSON(), function (item) {
                return item.date;
            });

            var days = _.keys(groups).sort();

            var dayItems = _.map(days, function (_day) {
                var timeBillArrr = groups[_day];
                var amtSum4Day = 0;
                var daySuccessAmt = 0;
                 _.each(timeBillArrr, function(_item){ 
                    amtSum4Day += _item.amt;
                });
                return {
                    date: _day,
                    dayAmt: amtSum4Day,
                    items: timeBillArrr
                };
            }); 

            return {
                dayItems: dayItems
            };
        }
    });


    return TableView;

});