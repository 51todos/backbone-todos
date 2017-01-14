define([
    'app/store/RecordSummaryList',
    'app/model/DateTerminalRecord',
    'app/model/RecordSummary',
    'app/view/record/RecordDatePicker',
    'app/view/record/SummaryList',
    'app/view/record/SummaryItem',
    'app/view/record/SummaryCalendar'
    ], function(RecordSummaryListStore, DateRecordModel, RecordSummaryModel, DatePickerView, 
        SummaryListView, SummaryItemView, SummaryCalendarView) {

    //针对小屏幕，跳转页面
    var CLS = {
        SHOW_ITEM: 'opf-screen-detailing'//进入某天账单终端分组概要
    };

   var SUB_DETAIL_MAP = {
        errAmt: {urlKey: 'bill.date.stlmerror', viewClazz: 'app/view/record/sub/StlmError', viewTpl: 'tpl!app/view/record/sub/templates/popErrAmt.tpl', title: '异常交易'},

        //资金截留
        repairAmt: {urlKey: 'bill.date.stlmrepair', viewClazz: 'app/view/record/sub/StlmRepair', viewTpl: 'tpl!app/view/record/sub/templates/popStlmRepair.tpl', title: '资金截留'},
        //结算失败后再次转款
        uperrAmt: {urlKey: 'bill.date.settleerror', viewClazz: 'app/view/record/sub/FailToSettle', viewTpl: 'tpl!app/view/record/sub/templates/popUpperAmt.tpl', title: '结算失败后再次转款'},
        //异常交易已确认无误
        unErrAmt: {urlKey: 'bill.date.stlmerror.next', viewClazz: 'app/view/record/sub/ErrorToSettle', viewTpl: 'tpl!app/view/record/sub/templates/popStlmError.tpl', title: '异常交易已确认无误'},
        //归还截留资金
        unrepairAmt: {urlKey: 'bill.date.stlmrepair.next', viewClazz: 'app/view/record/sub/RepairToSettle', viewTpl: 'tpl!app/view/record/sub/templates/popUnrepairAmt.tpl', title: '归还截留资金'}
    };

    var busy = Opf.UI.setLoading;

    var RecordLayout = Marionette.Layout.extend({
        className: 'container record-container',
        template: '#bill-layout-tpl',
        regions: {
            summaryListRegion: '.summary-list-wrap',
            summaryItemRegion: '.summary-item-wrap',
            txnDetailRegion: '.txn-detail-wrap',
            itemSubDetailRegion: '.item-sub-detail-wrap'
        },
        onRender: function () {
            this.summaryListRegion.ensureEl();
            this.summaryItemRegion.ensureEl();
            this.txnDetailRegion.ensureEl();
            this.itemSubDetailRegion.ensureEl();


            //差错交易 页面返回后，右侧概要详情显示
            // itemSubDetailRegion.on('close', function () {

            // });
            //差错交易 页面返回后，右侧概要详情显示

        }
    });

    var Ctrl =  Marionette.Controller.extend({

        initialize: function () {
            var me = this;
            console.log('bill ctrl init ');



            this.layout = new RecordLayout();

            this.store = new RecordSummaryListStore();

            this.lastAddRecordSummaryModel = null;
            //TODO 保存已经生成的账单<date, url>

            App.recordRegion.show(this.layout);
        },

        _render: function () {
            var me = this;
            me.store.fetch();
            setTimeout(function(){
                if( me.store.length > 0){
                    busy(App.recordRegion.$el);
                }
            }, 100);
            me.store.once('sync', function () {
                //通过once绑定的事件，保证只会创建一次view左侧summarylist View

                //给小屏幕(width<=767px)下的layout绑定一个类，用于在小屏幕时控制列表的样式
                if (Opf.Media.lt(Opf.Media.SM)) {
                    me.layout.$el.addClass('xs-container');
                }

                //给平板屏幕(768px<=width<=991px)下的layout绑定一个类，用于在平板屏幕时控制列表的样式
                if (Opf.Media.gt(Opf.Media.XS) && Opf.Media.lt(Opf.Media.MD)) {
                    me.layout.$el.addClass('sm-container');
                }

                me.summaryListView = me.generateSummaryView();

                me.layout.summaryListRegion.show(me.summaryListView);

                //必须等画完才能绑定
                me.summaryListView.on('itemview:render', function (options) {
                    console.log(arguments);

                    var getNodeTimeAndID = function(options){
                        var deferr = $.Deferred();
                        Opf.ajax({
                            url: Ctx.url('mcht.settle.info', {settleDate: options.settleDate}),
                            success: function(resp) {
                                options.nodeTimeAndIDList = resp;
                                deferr.resolve();
                            }
                        });
                        return deferr.promise();
                    };
                    if (options.id || !options.shouldFetchData) {
                        me._showSummaryItem(options);
                    } else {
                        $.when(getNodeTimeAndID(options)).done(function(){
                            options.id = _.sortBy(options.nodeTimeAndIDList, function(item){return item.nodeTime;})[0].id;
                            me._showSummaryItem(options);
                        });
                    }
                });

                setTimeout(function(){
                    busy(App.recordRegion.$el, false);    
                }, 200);
            });
        },

        show: function () {
            if(!this._hasRender) {
                this._render();
                this._hasRender = true;
            }
        },

        generateSummaryView: function(){
            var me = this;
            if (Opf.Media.gt(Opf.Media.SM)) {
                return new SummaryCalendarView();
            }
            return new SummaryListView({
                collection: me.store,
                _events: {
                    'summary:item:show': {
                        fn: function(options){
                            me.summaryListView.trigger("itemview:render",options);
                        },
                        scope: me
                    },
                    'more:summary:pick': {
                        fn: me._showRecordDatePicker,
                        scope: me
                    }
                }
            });
        },

        _addOneDateRecord: function (strDate) {
            var me = this;
            var addRecordSummaryModel = new RecordSummaryModel();
            busy(me.layout);
            addRecordSummaryModel.fetchByDate(strDate, {
                success: function (child, resp) {
                    //后台返回空数组，立即返回
                    if(resp.length === 0){
                        return ;
                    }
                    var $ellipsis = me.layout.$el.find('.td-ellipsis').parent();
                    if($ellipsis.length < 1){
                        me.layout.$el.find('.summary-table tbody').append([
                            '<tr><td colspan="2" class="td-ellipsis text-center">',
                                '<div class="dot">&#9679;</div>',
                                '<div class="dot">&#9679;</div>',
                                '<div class="dot">&#9679;</div>',
                            '</td></tr>'    
                        ].join(''));
                    }
                    if(me.lastAddRecordSummaryModel){
                        me.store.remove(me.lastAddRecordSummaryModel);
                    }
                    me.store.add(addRecordSummaryModel);
                    me.lastAddRecordSummaryModel = addRecordSummaryModel;
                    me.recordDatePicker.close();
                    me.layout.$el.find('.tr-summary:last').trigger('click');
                },
                error: function () {

                },
                complete: function () {
                    busy(me.layout, false);
                }
            });

        },

        _ensureRecordDatePicker: function () {
            var me = this;
            if (!me.recordDatePicker) {
                me.recordDatePicker = new DatePickerView({
                    store: me.store
                });

                me.recordDatePicker.on('recorddate:pick', function(e) {
                    var strDate = moment(e.date).formatPureYMD();

                    console.log('recorddate:pick', e);

                    var hasExist = me.store.some(function(m) {
                        return m.get('settleDate') === strDate;
                    });

                    if (hasExist) {
                        me.recordDatePicker.close();
                    }else {
                        me._addOneDateRecord(strDate);
                    }

                });
            }
        },

        _showRecordDatePicker: function() {
            var me = this,
                strDate;
            me._ensureRecordDatePicker();
            //更新可选时间 (简单的就是给个时间范围，复杂的话就确定哪些天有账单)
            me.recordDatePicker.show();
        },

        //例如 显示“差错交易” 详情
        _showSubDetail: function (options) {
            //TODO refactor
            var me = this;
         

            console.log(options.name);
            var item = SUB_DETAIL_MAP[options.name];
            //只有当显示 结算失败后再次转款 时才不从后台请求数据，根据options.id 从 dateRecordModel 中取数据，其他情况从后台请求数据
            if (options.name === "uperrAmt") {
                //取相应的 结算失败后再次转款
                var upSettleError = _.findWhere(me.dateRecordModel.get('upSettleErrors'),{id: options.uperrAmtId});
                console.info('show upSettleError sub view', options, upSettleError);

                if (Opf.Media.gt(Opf.Media.SM)) {
                    generatePopWindow(upSettleError);
                } else{
                    generateNestedView(upSettleError);
                }
            }
            //如果是 资金截留 或 归还截留资金
            else if(options.name == 'repairAmt' || options.name == 'unrepairAmt'){
                require(['app/view/record/sub/RepairAmtPageView','app/store/PagebleRepairAmtDetail'],function(RepairAmtView,RepairAmtPageCollection){
                    var repairAmtPageCollection = new RepairAmtPageCollection([], {url:Ctx.url('bill.date.stlmrepair',{ mchtNo: App.getMchtModel().get('mchtNo')}) });//TODO url

                    repairAmtPageCollection.fetch().done(function(resp){
                        if(resp){
                            new RepairAmtView({
                                totalData: resp.totalData,
                                collection: repairAmtPageCollection
                            }).render();
                        }
                        else {
                            Opf.alert({title: '抱歉',
                                message: '未能正确获取数据'
                            });
                        }
                    });
                });
            }
            else {
                busy();
                $.ajax({
                    url: Ctx.url(item.urlKey, {id: options.id}),
                    success: function (resp) {
                        if(options.name == 'repairAmt'){
                            _.each(resp,function(item){
                                item['settleDate'] = me.dateRecordModel.get('settleDate');
                            });
                        }
                        //大屏dd
                        if (Opf.Media.gt(Opf.Media.SM)) {
                            generatePopWindow(resp);
                        } else{
                            generateNestedView(resp);
                        }

                    },
                    complete: function () {
                        busy(false);
                    }
                });
            }
            function generatePopWindow(data) {
                require([item.viewTpl],function(tpl){
                    var $content = $(tpl({data: data}));
                    Opf.UI.popDetailDialog({
                        title: item.title,
                        el: $content
                    });
                });
            }

            function generateNestedView(data) {
                console.info('show sub view', name, data);
                require([item.viewClazz], function (View) {
                    var subView = new View({
                        data: data
                    });
                    me.layout.itemSubDetailRegion.show(subView);
                    //TODO 看看又没办法通过事件监听itemSubDetailRegion
                    //的显示和隐藏
                    //隐藏 summaryItemRegion
                    // me.layout.summaryItemRegion.$el.hide();
                    me.layout.summaryItemRegion.$el.addClass('hidden');

                    subView.on('close', function () {
                        //显示 summaryItemRegion
                        me.layout.summaryItemRegion.$el.removeClass('hidden');
                    });
                });
            }
        },

        _createSummaryItemView: function (options) {
            var me = this;

            var view = new SummaryItemView(options);

            view.on('back', function () {
                this._leaveScreen(CLS.SHOW_ITEM);
            }, this);


            view.on('relative:bill:view', function(settleDate){
                console.log("点击了 查看相关的交易信息，结算日期为", settleDate);

                App.trigger('show:bill:view', settleDate);

            });

            view.on('sub:detail:show', function (options) {
                me._showSubDetail(options);
            });

            view.on('switch:record', function(options){
                console.info("catch switch:record");
                me.summaryListView.trigger('itemview:render', options);
            });


            return view;
        },

        _enterScreen: function (cls) {
            this.layout.$el.addClass(cls);
        },


        _leaveScreen: function (cls) {
            this.layout.$el.removeClass(cls);
        },

        _showSummaryItem: function (options) {
            var me = this;

            me._lastSummaryItemXhr && me._lastSummaryItemXhr.abort();

            if (options.shouldFetchData) { //如果需要从后台获取数据
                var dateRecordModel = me.dateRecordModel = new DateRecordModel();

                busy(me.layout.summaryItemRegion.$el);
                me.layout.itemSubDetailRegion.close();

                //TODO busy true
                me._lastSummaryItemXhr = dateRecordModel.fetchById(options.id, {
                    success: function () {
                        me.layout.summaryItemRegion.show(me._createSummaryItemView({model:dateRecordModel, nodeTimeAndIDList: options.nodeTimeAndIDList, id: options.id}));
                    },
                    complete: function () {
                        busy(me.layout.summaryItemRegion.$el, false);
                    },
                    error: function(){
                        console.log("fetch one day information fail !");
                        me.layout.summaryItemRegion.close();
                    }
                });
            } else {
                var formatedSettleDate = moment(options.settleDate, "YYYYMMDD").format("M月D日"),
                    tplHtml = [
                            '<div class="summary-item">',
                                '<div class="back-header header text-center">',
                                    '<span class="settle-date">' + formatedSettleDate + ' 结算详情</span>',
                                '</div>',
                                '<div class="ct-inner">',
                                    '<div class="settle-no-data">',
                                        '<span class="opf-icon-search"></span>',
                                        '今天还没有结算记录',
                                    '</div>',
                                '</div>',
                            '</div>'
                        ].join(''),
                summaryItemRegion = me.layout.summaryItemRegion;
                summaryItemRegion.close();
                summaryItemRegion.$el.empty().append($(tplHtml));
            }

            //此处判断是否是小屏幕，然后增加相应的样式以实现在小屏幕下每次单独显示条目列表或者条目详情
            if (Opf.Media.lt(Opf.Media.MD)) {
                me._enterScreen(CLS.SHOW_ITEM);
            }

        }

    });

    return new Ctrl();
});