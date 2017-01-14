/**
 * 这个store有两个作用
 * 1.纯粹用来获取数据,调整分页参数(这部分数据可能是多天的数据)
 * 2.在渲染流水信息的时候，一天对应一个store
 */
define([
], function() {
    //TODO 抽象一个PageableStore

    var PAGE_INFO = {
        number: 0,//当前第几页,从0开始
        size: 7,//每页显示多少条
        previous: false,
        next: false,
        totalCount: 0,//一共多少条记录
        totalPages: 0,
        startIndex:0 //当前页面第一条数据处于整表的游标索引，从0开始
    };

    var PAGE_INFO_KEYS = _.keys(PAGE_INFO);

    return Backbone.Collection.extend({

        model: Backbone.Model.extend({}),

            /**
             */
        initialize: function (options) {
            var me = this;
            options = options || {};

            this._page = $.extend({}, PAGE_INFO, options.page);

            //事件绑定按顺序执行，这里绑定同步事件后更新分页信息
            //因为创建View之前会先创建Collection，保证后续绑定的sync事件
            //时，collection的信息都是最新的
            //实在不行就在fetch的success回调里面拦截吧
            this.on('sync', function (cIns, resp, options) {
                if(resp && resp.page) {

                    // console.log('DateTerminalTxnStore sync', me._page);

                    _.extend(me._page, _.pick(resp.page, PAGE_INFO_KEYS));

                    // console.log('DateTerminalTxnStore after sync', me._page);

                }
            });
        },

        parse: function (resp) {
            return resp.page ? resp.page.result : [];
        },

        xxxxx: function (obj) {
            var filters = {"groupOp": "AND", rules: []};

            obj.start   && filters.rules.push({"field": "date", "op": "ge", "data": obj.start});
            obj.end     && filters.rules.push({"field": "date", "op": "le", "data": obj.end});
            obj.iboxNo  && filters.rules.push({"field": "iboxNo", "op": "eq", "data": obj.iboxNo});
            obj.traceNo && filters.rules.push({"field": "traceNo", "op": "eq", "data": obj.traceNo});

            return JSON.stringify(filters);
        },

        xpageParams: function (arrow, filtersObj) {
            var page = this._page;
            var number = 0, filters;
            var lastPageNo = parseInt(page.number, 10);

            number = arrow === 'next' ? (lastPageNo + 1) : 
                        arrow === 'previous' ? (lastPageNo - 1) : 0;

            //如果有传filtersObj 参数，就把它当作最新的搜索条件
            if(filtersObj) {
                filters = this.xxxxx(filtersObj);
                page.filters = filters;
            }

            var obj = {
                number: number,
                filters: filters || page.filters,
                size: page.size 
            };

            if(filtersObj) {
                obj.filters = this.xxxxx(filtersObj);
            }

            return $.param(obj);
        },

        pageParams: function (arrow, filtersObj) {
            var page = this._page;
            var number = 0, filters;
            var lastPageNo = parseInt(page.number, 10);

            number = arrow === 'next' ? (lastPageNo + 1) : 
                        arrow === 'previous' ? (lastPageNo - 1) : 0;

            //如果有传filtersObj 参数，就把它当作最新的搜索条件
            if(filtersObj) {
                filters = filtersObj;
                page.filters = filters;
            }

            var obj = {
                number: number,
                size: page.size 
            };

            $.extend(obj, filters || page.filters);

            return $.param(obj);
        },

        genGetUrl: function (arrow, filtersObj) {
            return Ctx.url('txn.flow.search') + '?' + this.pageParams(arrow, filtersObj);
        },

        fetchNext: function (ajaxOption) {
            return this.fetch(ajaxOption, 'next');
        },

        fetchPrevious: function (ajaxOption) {
            return this.fetch(ajaxOption, 'previous');
        },

        //filtersObj暂时针对“且”的情况
        fetch: function (ajaxOption, arrow, filtersObj) {
            var url = this.genGetUrl(arrow, filtersObj);

            console.log('DateTerminalTxnStore before fetch ', url);
            var ret = Backbone.Collection.prototype.fetch.call(this, $.extend(true,{
                url: url
            }, ajaxOption));

            return ret;
        }


    });
});