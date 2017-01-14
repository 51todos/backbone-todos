define([
    'app/model/RecordSummary'
], function(BillSummaryModel) {

    var DEFAULT_ROW_NUM = 7;

    return Backbone.Collection.extend({
        url: function () {
            return Ctx.url('bill.summary.last', {num: DEFAULT_ROW_NUM});
        },
        //?filters:{"groupOp":"AND","rules":[{"field":"settleDate","op":"ge","data":"20140521"},{"field":"settleDate","op":"le","data":"20140529"}]}
        model: BillSummaryModel,

        containsBySettleDate: function (date) {
            var strYMD = moment(date).formatPureYMD();
            return this.some(function (m) {
                return m.get('settleDate') === strYMD;
            });
        }
    });

});