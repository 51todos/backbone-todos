/**
 * User hefeng
 * Date 2016/5/24
 */
define(function(){

    var formatUtil = Opf.Util.Format;

    // 结算金额格式化
    var settleAmtFormatter = function(val) {
        return val&&val>0? '<strong class="text-color-green">' + Opf.Number.currency(val,2,'¥','','.',false) + '</strong>' : val;
    };

    // 异常交易详情
    var _settleDtlConf = [
        { label: '交易本金', key: 'txAmt', formatter:formatUtil.incomeFormatter }, //交易本金
        { label: '手续费', key: 'feeAmt', formatter:formatUtil.outlayFormatter }, //手续费
        { label: '手续费减免', key: 'freeAmt', formatter:formatUtil.amtFormatter }, //手续费减免
        { label: '异常交易', key: 'errAmt', formatter:formatUtil.outlayFormatter }, //异常交易
        { label: '异常交易确认无误', key: 'errOkAmt', formatter:formatUtil.amtFormatter }, //异常确认金额
        { label: '截留金额', key: 'repairAmt', formatter:formatUtil.outlayFormatter }, //截留金额
        { label: '截留解冻金额', key: 'unrepairAmt', formatter:formatUtil.amtFormatter }, //截留解冻金额
        { label: '上周期结算失败', key: 'uperrAmt', formatter:formatUtil.amtFormatter }, //上周期结算失败
        //{ label: '商户号', key: 'mchtNo' }, //商户号
        { label: '结算金额', key: 'settleAmt', formatter: settleAmtFormatter } //结算金额
        //{ label: '对账日期', key: 'settleDate' }, //对账日期
    ];

    return {
        settleDtlConf: _settleDtlConf
    }
});