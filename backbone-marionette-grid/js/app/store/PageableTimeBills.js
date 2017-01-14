/**
 * 后台回传的小分页信息只剩下 totalElements 了
 * 所以手动算出其他所需的分页信息
 *
 * currentPage 也是手动维护，在用户点击相应按钮时更新，可能会有BUG
 */

define(['app/store/OpfPageableCollection'], function(OpfPageableCollection) {

    var BillsCollection = OpfPageableCollection.extend({

        url: Ctx.url('bill.algo.details.date'),

        // Initial pagination states

        /**
         * 改变pageSize 之前要想清楚！！！
         *
         * 不要辞去
         * 
         */
        state: {
            //这里设置的参数都要根据 PageableCollection 定义的字段名
            //真正传出去的参数名就在 queryParams 里面映射
            firstPage: 0,
            currentPage: 0,
            pageSize: 10 //这个值要跟模板中每页显示select对应，后期改成jsstorage取
        },

        queryParams: {

            //以下3项都不属于PageableCollection里面关于分页的参数
            //要自己写方法设置

            // 对应setQueryOptions方法要设置的参数
            startDate: null,
            endDate: null,
            terminal: null,
            txDate: null,


            currentPage: "number",
            pageSize: "size",
            totalRecords: null,
            totalPages: null,
            sortKey: null,
            order: null
        },

        //注意param每次都要"满key"
        setQueryOptions: function(params){
            $.extend(this.queryParams, params);
            return this;
        },

        updateCurrentPage: function(option){
            if (option == 'previous') {
                this.state.currentPage--;
            } else if(option == 'next'){
                this.state.currentPage++;

            } else if(_.isNumber(option)){
                this.state.currentPage = option;
            }
        },

        parseState: function(resp, queryParams, state, options) {
            var _resp = resp.pageBean;
            if(!_resp) return{
                totalRecords: 0,
                totalPages: 0
            };

            console.log('parseState');
            /*
            PageableCollection 刚好用到 firstPage 和 lastPage 作为第一页和最后一页的索引
            所以把后台使用的"是否第一页"和"是否最后一页"的标识，在前台这边转化一下
            */
            var pageSize = /*parseInt(_resp.size, 10)*/ parseInt(this.state.pageSize, 10);
            var totalRecords = parseInt(_resp.totalElements, 10);


            var currentPage = /*parseInt(_resp.number,10)*/ parseInt(this.state.currentPage, 10);
            var totalPages = /*parseInt(_resp.totalPages, 10)*/ Math.floor(totalRecords / pageSize) + 1;
            var hasNextPage = currentPage != totalPages - 1;
            var hasPreviousPage = currentPage != 0;
            var isFirstPage = !hasPreviousPage;
            var isLastPage = !hasNextPage;

            return {


                hasNextPage: hasNextPage,
                hasPreviousPage: hasPreviousPage,
                lastPage: totalRecords === 0 ? 0 : (Math.ceil(totalRecords / pageSize) - 1),
                isFirstPage: isFirstPage,
                isLastPage: isLastPage,
                currentPage: currentPage,
                numberOfElements: parseInt(pageSize, 10),
                pageSize: pageSize,
                sort: _resp.sort,
                totalRecords: totalRecords,
                totalPages: totalPages
            };
        },

        // get the actual records
        parseRecords: function(resp, options) {
            var _resp = resp.pageBean;
            return _resp ? _resp.content : [];
        }
        
        // parse: function (resp, queryParams, state, options) {
        //     return OpfPageableCollection.prototype.parse.call(this, resp.pageBean, queryParams, state, options);
        // }
    });

    return BillsCollection;

});