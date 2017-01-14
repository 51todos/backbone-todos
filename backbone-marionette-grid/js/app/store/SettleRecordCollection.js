//按照对账日期范围查询的交易记录
//集合里面一条记录对应一个交易日期数据
define([
    'app/store/OpfPageableCollection'
], function(OpfPageableCollection) {

    
    return OpfPageableCollection.extend({

        url: Ctx.url('bill.algo.details'),

        state: {
            pageSize: 3
        },

        queryParams: {
            //TODO 
            //初始化要设置一个size，EachDay...View对应的collection也要设置一个
            //怎么弄？？把他的collection.prototype引过来
            txnDayPageSize: 10//小分页初始化页数

        },

        applyQueryParam: function (data) {
            $.extend(this.queryParams, data);
            return this;
        },

        parse: function (resp, queryParams, state, options) {
            return OpfPageableCollection.prototype.parse.call(this, resp.pageBean, queryParams, state, options);
        }


    });
});