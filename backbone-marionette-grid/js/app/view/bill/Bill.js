define([
    'tpl!app/view/bill/templates/bill.tpl',
    'app/view/bill/EachDayComView',
    'app/view/bill/RemoteTerminalSelection',
    'app/view/txn/RangeDatePicker',
    'fwk/components/downloadTask',
    'moment'
    ],function(tpl, EachDayView, RemoteTerminalSelection, RangeDatePicker, downloadTask){

        var TERMINALS_NUM_THRESHOLD  = 10;//use static select options when terminals number <= this threshold

        var MBillView = Marionette.ItemView.extend({

            initialize: function(options){
                console.log('>>>MBillView initialize', arguments);
                this.tnSelectionType = null;//'local'/'remote'

                this.collection = options.collection;

                //默认当天对账单
                this.startDate = this.endDate = moment().format('YYYYMMDD');

                //从结算记录点击 查看相关的交易 跳转过来时，对账单日期为传过来的日期
                if (options.startDate) {
                   	this.startDate = this.endDate = options.startDate; // = options.endDate
                }
            },

            template: tpl,

            ui: {
                summary : '.summary',
                //downloadBtn: '.btn-download',
                complexDownloadBtnTextEl: '.complex-download .text',
                dateSelect: 'button.date-select',
                selectedTerminal: '.selected-terminal',
                terminalMenu: '.terminal-select .dropdown-menu',//use when a bit tno
                complexDownload: '.complex-download',
                simpleDownload: '.simple-download',
                remoteTnSelSitter: '.remote-tn-sel-sitter',
                datePickerSit: '.date-picker-sit',

                daysBill: '.days-bill',
                billNoData: '.bill-no-data',
                foot: '.foot',

                pagePrevious: '.out-pager .previous',
                pageNext: '.out-pager .next',
                pageText: '.out-pager .text'
            },

            events:{
                'click button.date-select': 'toggleDateRangePicker',
                'click #normal-download': 'onDownloadClick',

                'click .out-pager .previous': function (e) {
                    console.log('点击了大分页，前一页');
                    if(!$(e.target).closest('li').hasClass('disabled')) {
                        this.trigger('previous:page', e);
                    }
                },
                'click .out-pager .next': function (e) {
                    console.log('点击了大分页，后一页');
                    if(!$(e.target).closest('li').hasClass('disabled')) {
                        this.trigger('next:page', e);
                    }
                }

            },

            //更新交易日期数据
            update: function (data) {
                //没数据的时候长这样{pageBean:null, txCount:null, totalAmt:null}
                //往后数据结构改成这样{data:{pageBean, xxx}}, 没数据就这样{data:null}
                if(data.pageBean === null) {
                    data = null;
                }
                console.log('更新对账单主页面数据');
                this.updateDaysTable(data&&data.pageBean ? data.pageBean.content : []);
                this.updateSummaryCountandAmt(data);
                this.checkDownloadBtn(data);
            },

            //清空日期交易数据
            clear: function () {
                this.$el.find('div.days-bill').html('无数据');
                this.updateSummaryCountandAmt(null);
                this.checkDownloadBtn(null);
            },

            checkDownloadBtn: function (data) {
                var me = this, ui = me.ui;
                ui.complexDownload.hide();

                //TODO 后续通过用户信息&&data 来判断
                if(App.isPrimaryUser && data && Ctx.enableDownloadBill) {
                    ui.complexDownload.show();
                    /*if(data.mchtResv1 !== '1') {
                        ui.complexDownload.find('#txt-dl').closest('li').hide();
                    }*/
                }
            },

            updateDaysTable: function (txnDaysData) {
                var me = this,
                    $container = this.$el.find('div.days-bill'),
                    $settleDate = this.$el.find('button.date-select'),
                    $terminal = this.$el.find('select.terminal-select');

                $container.empty();

                if(!_.isEmpty(txnDaysData)) {
                    _.each(txnDaysData, function(eachDayData) {

                        var eachDayView = new EachDayView({
                            data: eachDayData,
                            ownerView: me
                        }).render();

                        $container.append(eachDayView.$el);
                    });
                }

            },

            updateSummaryCountandAmt: function(data) {
                this.$el.find('.tx-count').text(data&&data.txCount ? data.txCount : 0);
                this.$el.find('.total-amt').text(data&&data.totalAmt ?  data.totalAmt : 0).prepend('&yen;');
                this.$el.find('.total-feeamt').text(data&&data.totalFeeAmt ?  data.totalFeeAmt : 0).prepend('&yen;');
                this.$el.find('.total-freeAmt').text(data&&data.totalFreeAmt ?  data.totalFreeAmt : 0).prepend('&yen;');
            },


            onRender: function(){
                var me = this,
                    ui = this.ui;

                me.renderTerminalSelection();
                me.renderDownloadTask();

                //初始化触发条件改变事件
                this.listenTo(this.collection, 'request', function (collection, resp) {
                    me.onBeforeUpdate();
                });
                
                //没考虑后台数据为空，或者success为false的情况
                this.listenTo(this.collection, 'sync', function (collection, resp) {

                    //根据后台查询到数据的，显示正常视图 或者 没有查询到数据视图，以 resp.pageBean为判断依据
                    me.toggleView(resp&&resp.pageBean ? resp.pageBean.content : []);

                    me.update(resp);
                    me.onAfterUpdate();
                    me.updatePager(collection);

                });

                this.updateDateText(this.startDate, this.endDate);
            },

            updatePager: function (collection) {
                var ui = this.ui;
                ui.pagePrevious.toggleClass('disabled', !collection.state.hasPreviousPage);
                ui.pageNext.toggleClass('disabled', !collection.state.hasNextPage);

                var txDayNum = collection.state.totalRecords;
                ui.pageText.text(   (txDayNum ? '共 ' + txDayNum + ' 天' : '无') + '交易数据');
            },

            onBeforeUpdate: function () {
                Opf.UI.setLoading(this.$el, true);
            },

            onAfterUpdate: function () {
                Opf.UI.setLoading(this.$el, false);
            },

            //更改某种搜索条件之后都会调用该方法
            _onQueryChange: function () {
                this.trigger('bill:query:by:date:tn', this.getQueryOptions());
            },

            renderTerminalSelection: function(){
                var me = this;

                Opf.ajax({
                    url: Ctx.url('bill.algo.details.terminal', {num: TERMINALS_NUM_THRESHOLD }),
                    type: 'GET',
                    success: function(resp){
                        console.log("从服务器获取终端数据", resp);
                        if (resp.hasMore) {
                            // 终端条目多，不生成选项，使用模糊搜索
                            me.renderTerminalSelection4Remote();
                            me.tnSelectionType = 'remote';
                        } else if(resp.data && resp.data.terminalNo) { // resp 可能是一个空对象 ，这里作保护
                            // 终端条目不多，生成本地选项
                            me.renderTerminalSelection4BitOnes(resp.data.terminalNo);
                            me.tnSelectionType = 'local';
                        }
                        //渲染终端号选项是异步操作，完成终端号渲染后调用_onQueryChange，表示初始化完成触发查询改变
                        me._onQueryChange();
                    }
                });
            },

            renderTerminalSelection4Remote: function () {
                var me = this;
                var ui = this.ui;
                var remoteTnSel = this.remoteTnSel = new RemoteTerminalSelection();

                remoteTnSel.on('change', function (val) {
                    me._onQueryChange();
                });

                ui.remoteTnSelSitter.append(remoteTnSel.$el).addClass('invisible-in-xs').show();
            },

            //终端数量不多的话,直接展现所有终端选项
            renderTerminalSelection4BitOnes: function (tnNos) {
                var me = this, ui = me.ui;

                var strOptions = _.map(tnNos, function(no){
                    return '<li><a href="javascript:void(0);" value="'+no+'">终端号: '+no+'</a></li>';
                }).join('');

                me.ui.terminalMenu.append($(strOptions)).parent().addClass('invisible-in-xs').show();

                me.ui.terminalMenu.on('click a', function(e){
                    ui.selectedTerminal.text($(e.target).text());
                    ui.selectedTerminal.attr('value', $(e.target).attr('value'));
                    me._onQueryChange();
                });
            },

            renderDownloadTask: function(){
                var me = this, ui = me.ui;
                var downloadTaskOpts = {
                    caption: '交易流水对账单',
                    targetView: me,
                    type: 'excel'
                };
                var downloadTaskView = downloadTask.init(downloadTaskOpts).render();
                ui.complexDownload.empty().append(downloadTaskView.$el);
            },

            setDateSelectValue: function(startDate, endDate){
                console.log("setDateSelectValue: ", startDate, endDate);
                this.startDate = startDate;
                this.endDate = endDate;

                this.updateDateText(startDate, endDate);
            },

            updateDateText: function (startDate, endDate) {
                if(!startDate) return;

                var result = formatDateSelectTxt(startDate);

                //如果没有结束日期，或者其实和结束一样，则只显示一天的日期
                if(endDate && endDate !== startDate) {
                    result += '-' + formatDateSelectTxt(endDate);
                }

                this.ui.dateSelect.text('对账日期 ' + result);
            },

            //获取当前选中的终端号码， 选择全部则返回'all'
            getTerminalVal: function () {
                if(this.tnSelectionType === 'local') {
                    return this.ui.selectedTerminal.attr('value');
                }else if(this.tnSelectionType === 'remote') {
                    return this.remoteTnSel.getValue();
                }
                return null; // resp 是空对象的情况 tnSelectionType 为 null
            },

            //获取起始日期和结束日期
            getDateValues: function () {
                return {
                    startDate: this.startDate,
                    endDate: this.endDate
                };
            },

            getQueryOptions: function(){
                var options = {
                        startDate: this.startDate,
                        endDate: this.endDate,
                        terminal: this.getTerminalVal()
                        // ,//TODO 如果远程搜索则更换取值方式
                        // number :  '0',
                        // size: Opf.Media.gt(Opf.Media.XS) ? '10' : '5'
                    };
                return options;
            },

            renderDatePickerView: function(){
                var me = this;
                var datePickerView = this.datePickerView = new RangeDatePicker({limitDateRange:'month'}).render();

                datePickerView.on('submit', function (obj) {
                    me.setDateSelectValue(obj.startDate, obj.endDate);

                    me._onQueryChange();
                });
                this.ui.datePickerSit.append(datePickerView.$el);
            },

            toggleDateRangePicker: function(){
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

            toggleView: function(haveDataToShow) {
                var me = this;
                if (_.isEmpty(haveDataToShow)) {
                    me.ui.summary.hide();
                    me.ui.daysBill.hide();
                    me.ui.foot.hide();

                    me.ui.billNoData.show();
                } else {
                    me.ui.summary.show();
                    me.ui.daysBill.show();
                    me.ui.foot.show();

                    me.ui.billNoData.hide();
                }
            }

        });

        function formatDateSelectTxt (date) {
            return date ? Opf.String.replaceYMD(date, 'YYYY/MM/DD') : '';
        }

        return MBillView;
});