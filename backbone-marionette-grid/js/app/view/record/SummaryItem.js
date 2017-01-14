/**
 * 生成结算记录某一天的结算详情
 */

define([
    'moment',
    'tpl!app/view/record/templates/summaryItem.tpl',
    'app/view/record/LabelValueTable'
], function(moment, summaryItemTpl, LabelValueTable) {

    return  Marionette.ItemView.extend({
        className: 'summary-item',
        events: {
            'click tr[detail]': 'showSubDetail',
            'click .switch-record': 'switchRecord',
            'click .switchPanel li': 'switchRecord',
            'click .switch-container li': 'switchRecord'
        },
        triggers: {
            'click .back-trigger': 'back'
        },

        template: summaryItemTpl,

        initialize: function(options){
            this.model = options.model;
            this.nodeTimeAndIDList = this._sort(options.nodeTimeAndIDList);
            this.id = options.id;
            this.nodeTime = this._getNodeTime();
        },


        mixinTemplateHelpers: function (data) {
            var me = this,
                nodeTimeList = this._getNodeTimeList();

            data = {
                list: _.map(me.nodeTimeAndIDList, function(item){
                    return '<li class="'+ ((item.nodeTime == me.nodeTime)? "disabled":"") +'" value="'+ item.id +'"><span>' + format(item.nodeTime, item.settleNum) + '</span></li>';
                    }).join(''),
                formatedSettleDate: moment(data.settleDate, "YYYYMMDD").format("M月D日"),
                discMessage: me.nodeTime ? (me.nodeTime.replace(/\d{8}0{0,1}(\d{1,2})(\d{2})(\d{2})$/, "$1时$2分")) : "T+1",
                isFirstPage: _.indexOf(nodeTimeList, me.nodeTime) == 0,
                isLastPage: _.indexOf(nodeTimeList, me.nodeTime) == nodeTimeList.length - 1
            };

            return data;

            function format(str, settleNum){ //settleNum 是标志 T+1 或是 T+0

                //如果没包含 TN，就是T+0
                if(settleNum.indexOf('TN') == -1){ //T+0
                    if (/\d{14}/.test(str)) {
                        return str.replace(/\d{8}0{0,1}(\d{1,2})(\d{2})(\d{2})$/, "$1:$2");
                    }
                }
                return "T+1";
            }

        },

        showSubDetail: function (e) {
            var me = this,
                $tr = $(e.target).closest('tr'),
                options = {
                    name: $tr.attr('name'),
                    id: me.id,
                    uperrAmtId: $tr.attr('id')
                };
            this.trigger('sub:detail:show', options);
        },

        switchRecord: function(e){

            var $target = $(e.currentTarget),
                me = this,
                options;

            //点击了 disabled 的按钮则返回
            if ($target.is('.disabled')) {
                return ;
            }

            options = {
                shouldFetchData: true,
                nodeTimeAndIDList: me.nodeTimeAndIDList,
                id: getNewID()
            };

            function getNewID(){
                if ($target.is('li')) {
                    return $target.attr('value');
                }
                var nodeTimeList = me._getNodeTimeList(),
                    index = _.indexOf(nodeTimeList, me.nodeTime),
                    newNodeTime =  $(e.target).is('.pre-record') ? nodeTimeList[index-1] : nodeTimeList[index+1];

                    return _.find(me.nodeTimeAndIDList, function(item){ return item.nodeTime == newNodeTime;}).id;
            }

            this.trigger('switch:record',options);
        },


        onRender: function () {
            var me = this,
                data =  this.model.toJSON(),
                wrapper = $('<div class="ct-inner"></div>'),
                configForCurrentAmt = {
                    caption: '当日应结金额组成',
                    sumup: data.currentAmt,
                    content: {
                        txAmt: data.txAmt,
                        feeAmt: data.feeAmt,
                        freeAmt:data.freeAmt,
                        errAmt: data.errAmt,
                        repairAmt: data.repairAmt,
                        unrepairAmt: data.unrepairAmt,
                        unErrAmt: data.unErrAmt
                    },
                    detail: {
                        errAmt: 'errAmt',
                        repairAmt: 'repairAmt',
                        unrepairAmt: 'unrepairAmt',
                        unErrAmt: 'unErrAmt'
                    }
                },
                configForActualAmt = {
                    caption: '实际结算金额',
                    sumup: data.settleAmt,
                    content: {
                        currentAmt: data.currentAmt,
                        uperrAmt: data.uperrAmt
                    },
                    detail: {}
                },
                configForUperAmt = {
                    caption: '结算失败后再次转账',
                    sumup: data.uperrAmt,
                    content: data.upSettleErrors,
                    detail: {
                        upSettleError: 'uperrAmt'
                    }
                },
                amtFail,
                dangriyingjiejine;

            addContentToWrapper();
            this.$("div.detail-container").html(wrapper);

            function addContentToWrapper(){

                

                //生成当日应结金额
                //当日应结金额 = 本金 - 手续费 - 差错交易金额 + 差错交易处理后清算 - 资金截留 + 归还截留
                //当日应结金额有可能为零，但只要 手续费 或者 差错交易金额 或者 资金截留 其中之一不为零 就要显示

                if (isNotZero(data.feeAmt) || isNotZero(data.errAmt) || isNotZero(data.repairAmt)) {
                    currentAmtView = new LabelValueTable(configForCurrentAmt);
                    wrapper.append(currentAmtView.$el);
                }

                //生成实际结算金额及结算失败后再转账
                if (isNotZero(data.uperrAmt)) {
                        actualAmtView = new LabelValueTable(configForActualAmt);
                        wrapper.prepend(actualAmtView.$el);
                        uperAmtView = new LabelValueTable(configForUperAmt);
                        wrapper.append(uperAmtView.$el);

                }

                //生成重新结算日期提示
                if (data.reSettleDate) {
                    var reSettleTpl = [
                                    '<div class="re-settle-desc">',
                                        '<span>',
                                            '款项已于'+ Opf.String.replaceYMD(data.reSettleDate, 'YYYY年M月D日') +'重新结算给您。',
                                        '</span>',
                                    '</div>'
                                    ].join('');
                    wrapper.prepend($(reSettleTpl));
                }

                //生成结算失败提示
                if((data.resultStatus === "1" || data.reSettleDate) && data.resultDesc){ //结算失败标志为 1 或者有重新结算日期，若有描述失败原因则显示
                    var amtFail = [
                            '<div class="result-fail-desc">结算失败原因：',
                                '<span>'+ data.resultDesc || '' +'</span>',
                            '</div>'
                    ].join('');
                    wrapper.prepend($(amtFail));
                }

                //生成正在结算提示
                if(data.resultStatus === "2"){
                    var amtSettling = [
                            '<div class="result-settling-desc">',
                                '<span>此笔款项正在结算中</span>',
                            '</div>'
                    ].join('');
                    wrapper.prepend($(amtSettling));
                }

            }

            function isNotZero(val){
                return val !== '0.00';
            }

        },

        _sort: function(nodeTimeAndIDList){
            return _.sortBy(nodeTimeAndIDList, function(item){
                return item.nodeTime;
            });
        },

        _getNodeTimeList: function(){
            return _.pluck(this.nodeTimeAndIDList, 'nodeTime');
        },

        _getNodeTime: function(){
            var me = this;
            return _.find(this.nodeTimeAndIDList, function(item){return item.id == me.id;}).nodeTime;
        }
                
        
    });

});