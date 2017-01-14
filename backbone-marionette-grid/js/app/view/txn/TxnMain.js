define([
    'app/store/TxnFlowStore',
    'tpl!app/view/txn/templates/txnFlowMain.tpl',
    'app/view/txn/TxnFlowContent',
    'app/view/txn/RangeDatePicker',
    'app/view/txn/MoreSearch',
    'fwk/components/dialog'
], function(FlowsStore, tpl, FlowContentView, RangeDatePicker, MoreSearch, Dialog) {

    var TxnMainView = Marionette.ItemView.extend({

        className: 'txn-main',

        template: tpl,

        ui: {
            body: '.body',
            pageInfoText: '.page-info .text',
            pre: '.previous',
            next: '.next',
            datePickerSit: '.date-picker-sit',
            successCount: '.summary .success-count',
            successAmt: '.summary .success-amt',
            buttonDate: '.range-date'

        },

        events: {
            'click .range-trigger': 'toggleDateRangePicker',
            'click .more-search-trigger': 'showMoreSearch'
        },

        showMoreSearch: function () {
            var me = this;

            var dialog = new Dialog({
                title: "搜索交易流水",
                formView: new MoreSearch()
            }).render();

            dialog.on('submit', function (values) {
                me.trigger('submit:search', values);
            });
        },

        renderDatePickerView: function () {
            var me = this;
            var datePickerView = this.datePickerView = new RangeDatePicker({limitDateRange: 'month'}).render();
            datePickerView.on('submit', function (obj) {
                me.trigger('submit:search', obj);
            });
            this.ui.datePickerSit.append(datePickerView.$el);
        },

        toggleDateRangePicker: function () {
            if(!this.datePickerView) {
                this.renderDatePickerView();
            }
            this.datePickerView.toggle();
            if(this.datePickerView.$el.is(':visible')){
               $('body').append($('<div class="date-overlay"></div>')); 
            }else{
                $('.date-overlay').remove();
            }
            $(window).triggerHandler('resize.datePicker');
        },

        updateSummaryTips: function (resp, filtersObj) {

            console.log('update totalCount and totalAmt: >>>>',filtersObj);
            var successCount = resp.total || 0;
            var totalAmt = resp.totalAmt || 0;


            this.ui.successCount.text(successCount);
            this.ui.successAmt.text(totalAmt);
            this.ui.successAmt.prepend('&yen;');

        },

        initialize: function (options) {
            console.log('>>>TxnMainView initialize');
            var me = this;
            var ui = this.ui;
            this.store = options.store;//基于当前搜索条件得到的数据
        },

        _renderContentView: function (data) {
            var me = this;

            if(this.flowContentView) {
                this.flowContentView.remove();
            }

            var view = this.flowContentView= new FlowContentView ({
                data: data
            }).render();

            //make a events borrow list
            view.on('txn:flow:show', function (bid) {
                var args = $.makeArray(arguments);
                args.unshift('txn:flow:show');
                me.trigger.apply(me, args);
            });

            return view;
        },

        _convertData: function (resp) {
            var content = resp.page.result;
            var groups = _.groupBy(content, function (item) {
                return item.date;
            });

            //最近日期在前面
            var dateOrder = _.keys(groups).sort(function (a, b) {return parseInt(b, 10) - parseInt(a, 10);});
            var ret = [];

            _.each(dateOrder, function (strDate) {
                var flowItems4OneDate = groups[strDate];

                var dateSuccessTradeAmt = 0;//某天的成功交易金额

                _.each(flowItems4OneDate, function(item) {
                    var amt = parseFloat(item.amt);
            // 0-成功应答   1-请求   2-已冲正   
            // 3-已撤销   4-已确认   5-部分退货   6-全额退货
                    //TODO 问下每天的成功交易金额算法
                    //这里临时认为成功交易金额只包括成功应答
                    if(item.stat == '0') {
                        dateSuccessTradeAmt += amt;
                    }
                });
                ret.push({
                    date: strDate,
                    dateSuccessTradeAmt: dateSuccessTradeAmt.toFixed(2), 
                    items: flowItems4OneDate
                });
            });

            return ret;
        },

        onRender: function () {
            var me = this;
            var ui = this.ui;

            this.store.on('sync', function (s, resp) {
                console.log('同步流水数据');
                //TODO 区分交易正常失败

                if(!resp.page){ // 如果后台返回 resp 是一个 {} 空对象 ，为避免后续处理出错
                    resp.page = {result : []};
                }
                var data = me._convertData(resp);

                var contentView = me._renderContentView(data);
                
                ui.body.empty().append(contentView.el);

                me.updatePageInfo(resp);
                
                me.onDataSync();

                // 之前的设计是小屏幕不能默认显示某一天，如果需要的话，trigger前判断下屏幕
                if(/*Opf.Media.gt(Opf.Media.XS)*/false) {
                    var firstChild = me.$el.find('.tr-flow-row').first();
                    firstChild && firstChild.trigger('click');
                }

            });

            this.$el.on('click', '.previous:not(".disabled")', Opf.Function.createBuffered(function () {
                me.busy();
                me.trigger('previous');
            }, 250));

            this.$el.on('click', '.next:not(".disabled")', Opf.Function.createBuffered(function () {
                me.busy();
                me.trigger('next');
            }, 250));

            $(window).on('resize.datePicker',function(){
                if($(this).width() < 768) {
                    $('.date-overlay').hide();
                }else{
                    $('.date-overlay').show();
                }
            });
        },

        busy: function (toggle) {
            Opf.UI.setLoading(this.ui.body, toggle);
        },
        onDataSync: function () {
            this.busy(false);
        },

        updatePageInfo: function (resp) {
            var page = resp.page;
            var pageInfoTxt = "";
            if(page.totalCount <= 0){
            	pageInfoTxt = '共 0 笔';
            }else{
            	pageInfoTxt = Opf.String.format('第 {0}~{1}笔 / 共 {2}笔',
                        page.startIndex + 1,
                        page.startIndex + page.result.length,
                        page.totalCount
                    );
            }
            
            this.ui.pageInfoText.text(pageInfoTxt);
            this.ui.pre.toggleClass('disabled', !page.previous);
            this.ui.next.toggleClass('disabled', !page.next);
        }


    });

    return TxnMainView;

});