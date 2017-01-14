define([
    'app',
    'app/store/TxnFlowStore',
    'app/view/txn/TxnMain',
    'app/view/txn/TxnDetail'
], function(App, FlowStore, TxnMain, TxnDetail) {

    var Ctrl =  Marionette.Controller.extend({

        initialize: function () {
            var me = this;

            this.store = new FlowStore();

            this.txnMainView = new TxnMain({
                    store: this.store
                });            

            App.txnRegion.show(this.txnMainView);

        },

        busy: function (toggle) {
            App.txnRegion.ensureEl();
            Opf.UI.setLoading(App.txnRegion.$el, toggle);
        },

        /**
         * {
         * start:'20140501',
         * end: 'x'
         * traceNo: '',
         * iboxNo: ''
         * }
         */
        _search: function (filtersObj) {
            var me = this;
            
            me.busy(true);
            
            this.store.fetch({
                success: function (c, resp) {
                    console.log('success search with', filtersObj, resp);

                    //后台没有查询到日期内交易流水时，还是会success
                    //查询到数据时则显示 SummaryTips 及 pager，否则显示 没有数据的页面
                    me._toggleView(resp);
                    
                    me.txnMainView.updateSummaryTips(resp, filtersObj);
                    me._updateButtonDate(resp, filtersObj);
                },
                complete: function(){
                    me.busy(false);
                }
            }, null, filtersObj);
        },


        _show: function () {
            var me = this;
            var store = me.store;
            if(!me._hasRender) {

                var txnMainView = me.txnMainView;


                me._search({
                    startDate: moment().startOf('week').format('YYYYMMDD'),
                    endDate: moment().endOf('week').format('YYYYMMDD')
                });

                me._resetButtonDate({
                    startDate: moment().startOf('week').format('YYYYMMDD'),
                    endDate: moment().endOf('week').format('YYYYMMDD')
                });

                txnMainView.on('next', function() {
                    console.log('>>> ctrl listen on next');
                    store.fetchNext({
                        complete: function() {
                            txnMainView.triggerMethod('data:sync');
                        }
                    });
                });

                txnMainView.on('previous', function() {
                    console.log('>>> ctrl listen on previous');
                    store.fetchPrevious({
                        complete: function() {
                            txnMainView.triggerMethod('data:sync');
                        }
                    });
                });

                txnMainView.on('submit:search', function (filtersObj) {
                    me._resetButtonDate(filtersObj);
                    me._search(filtersObj);
                });

                txnMainView.on('txn:flow:show', function (bid) {
                    console.log("pop to show txnDetail");
                    var flowItemM = me.store.findWhere({id:bid}).attributes;

                    //var txnDetail = txnDetailTpl(flowItemM);
                    var txnDetail = new TxnDetail(flowItemM).render();
                        txnDetail.on('txn:flow:close', function(){
                            $dialog.dialog('destroy');
                        });

                    var $dialog = Opf.UI.popDetailDialog({
                        title: '交易详情',
                        el: $(txnDetail.$el)
                    });
                });

                me._hasRender = true;
            }

        },

        _resetButtonDate: function(obj){
            if (obj.startDate === undefined && obj.endDate === undefined) { //当通过高级搜索而没有设置日期时 obj.startDate 和 obj.endDate 为 undefined，此时不设置日期按钮的值
                return;
            }
            
            console.log("reset button's date to : ", obj);
            var me = this,
                startDate = Opf.String.replaceYMD(obj.startDate,'$1/$2/$3'),
                endDate = Opf.String.replaceYMD(obj.endDate,'$1/$2/$3'),
                date;
                startDate === endDate ? date = startDate : date = (startDate+'-'+endDate);
            me.txnMainView.$el.find('.range-date').text(date);
        },

        _updateButtonDate: function(resp, filtersObj) {
            if (filtersObj.startDate && filtersObj.endDate) { //如果通过日期选择按钮查询，则不重设日期选择按钮的值
                return;
            }
            if (resp.startDate == undefined && resp.endDate == undefined) { //如果后台没有查询到数据
                this.txnMainView.$el.find('.range-date').text("所有交易日期");
                return;
            }

            var options = {
                startDate : resp.startDate,
                endDate : resp.endDate
            };

            this._resetButtonDate(options);
        },


        _toggleView: function(resp){
            var me = this;
            if (resp.page && resp.page.result.length) {
                me.txnMainView.$el.find('.txn-no-data').hide();
                me.txnMainView.$el.find('.unit-inner.summary').show();
                me.txnMainView.$el.find('.foot').show();
            } else {
                me.txnMainView.$el.find('.txn-no-data').show();
                me.txnMainView.$el.find('.unit-inner.summary').hide();
                me.txnMainView.$el.find('.foot').hide();
            }
        },

        show: function () {
            var me = this;
            me._show();
        }

    });
    
    return new Ctrl();
});