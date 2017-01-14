define([
    'tpl!app/view/quota/templates/quotaView.tpl',
    'app/view/quota/quotaList',
    'app/view/quota/quotaPager'
],function(quotaTpl, listView, pagerView){
    return Marionette.ItemView.extend({
        template: quotaTpl,
        className: 'table-responsive',
        initialize: function(){
            this.url = Ctx.url('quota.list');
        },
        onRender: function(){
            var me = this;
            me.doRender();
        },
        doRender: function(options){
            var me = this;

            var mchtModel = App.getMchtModel();
            var mchtNo = mchtModel.get('mchtNo');

            var params = {
                number:0,
                size:10,
                mchtNo:mchtNo
            };
            var ajaxOptions = {
                type: 'GET',
                url: this.url,
                data: $.extend(params, options||{}),
                beforeSend: function(){
                    Opf.UI.setLoading(me.$el, true);
                },
                success: function (rsp) {
                    if(rsp && rsp.content){
                        var pageOptions = {
                            firstPage: rsp.firstPage,
                            lastPage: rsp.lastPage,
                            number: rsp.number,
                            numberOfElements: rsp.numberOfElements,
                            size: rsp.size,
                            totalElements: rsp.totalElements,
                            totalPages: rsp.totalPages
                        };
                        me.parseRecords(rsp.content);
                        me.parsePages(pageOptions);
                    }
                },
                complete: function(){
                    Opf.UI.setLoading(me.$el, false);
                }
            };
            Opf.ajax(ajaxOptions);
        },
        parseRecords: function(data){
            var view = new listView({data:data});
            this.$el.find("tbody").empty().append(view.doRender());
        },
        parsePages: function(data){
            var me = this;
            var view = new pagerView({data:data});
            var pageContext = this.$el.find("tfoot").empty().append(view.doRender());
            $("a.btn", pageContext).on('click', function(){
                if(!$(this).hasClass('disabled')) {
                    me.doRender({number:$(this).attr("data-number")});
                }
            });
        }
    })

});
