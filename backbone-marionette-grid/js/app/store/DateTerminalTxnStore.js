/**
 * 某日的终端下的交易明细
 */
define([
], function() {

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
            this._tno = options.tno;
            this._date = options.date;

            this._page = $.extend({}, PAGE_INFO, options.page);

            //事件绑定按顺序执行，这里绑定同步事件后更新分页信息
            //因为创建View之前会先创建Collection，保证后续绑定的sync事件
            //时，collection的信息都是最新的
            //实在不行就在fetch的success回调里面拦截吧
            this.on('sync', function (cIns, resp, options) {
                if(resp) {

                    console.log('DateTerminalTxnStore sync', me._page);

                    _.extend(me._page, _.pick(resp, PAGE_INFO_KEYS));

                    console.log('DateTerminalTxnStore after sync', me._page);

                }
            });
        },

        parse: function (resp) {
            return resp.result || [];
        },

        pageParams: function (arrow) {
            var page = this._page;
            return $.param({
                number: parseInt(page.number, 10) + (
                        arrow === 'next' ? 1 : 
                            arrow === 'previous' ? -1 : 0
                    ),
                size: page.size 
            });
        },

        genGetUrl: function (arrow) {
            return Ctx.url('bill.algo.tno',{date: this._date, tno: this._tno}) + 
                '?' + this.pageParams(arrow);
        },

        fetchNext: function (options) {
            return this.fetch(options, 'next');
        },

        fetchPrevious: function (options) {
            return this.fetch(options, 'previous');
        },

        fetch: function (options, arrow) {
            var url = this.genGetUrl(arrow);

            console.log('DateTerminalTxnStore before fetch ', url);
            var ajaxOptions = _.extend(options,{
                url: url
            });
            var ret = Backbone.Collection.prototype.fetch.call(this, ajaxOptions);

            return ret;
        }


    });
});