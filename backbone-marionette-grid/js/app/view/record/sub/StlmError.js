define([
    'app/view/record/sub/BaseSubView',
    'tpl!app/view/record/sub/templates/stlmError.tpl'
], function(BaseSubView, tpl) {

    var ERROR_TYPE = {
        '1': '对账不平',
        '2': '风控拦截延迟清算',
        '3': '手工延迟清算',
        '4': '商户不正常延迟清算'
    };

    var RESULT_FLAG = {
        '0': '工作人员已处理，且款项已清算。',
        '1': '工作人员已处理，即将参与清算。',
        '2': '已作退货处理。',
        '3': '已向银行请款。',
        '4': '已挂账。',
        '5': '已作退货处理。',
        '9': '工作人员即将处理。'
    };

    return BaseSubView.extend({

        title: '异常交易',

        onRender: function () {
            BaseSubView.prototype.onRender.apply(this, arguments);

// txDate;//交易日期
//      txTime;//交易时间
//      traceNo;// 平台流水
//      errType // 差错类型(1-对账不平，2-风控拦截延迟清算，3-手工延迟清算)
//      stlmType；//缺少 对账不平类型
//      errDesc；//缺少 差错描述
//      nextDo;//原因及处理描述
//      txAmt;//交易金额
//      resultFlag // 结果标示(0-参入清算后并已清分，1-处理后参加清算，2-手工处理退货,3-手工处理请款,4-手工处理挂账,5-手动退货,9-未处理)
//      acNo;  // 主账户

            var strHtml = tpl({
                data: this.data,
                helpers: {
                    //头部描述组成规则是  [差错类型]翻译 + [差错描述]
                    //当差错类型为‘对账不平’，[差错类型翻译`] = [差错类型翻译] + [对账不平翻译]
                    getHead: function (item) {
                        var result = ERROR_TYPE[item.errType] || '';
                        var errDesc = item.desc || '';

                        if(errDesc) {
                            result += '，' + errDesc;
                        }
                        result = Opf.String.confirmFullStop(result);
                        return result;
                    },
                    getFoot: function (item) {
                        return (RESULT_FLAG[item.resultFlag] || '') + Opf.String.confirmFullStop(item.nextDo);
                    }
                }
            });
            // console.log('异常交易 ', this.data, strHtml);

            this.$('.content').html(strHtml);
        }

    });


});