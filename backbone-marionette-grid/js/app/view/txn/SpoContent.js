define([
    'tpl!app/view/txn/templates/spoContent.tpl'
], function(tpl) {

    var View = Marionette.ItemView.extend({
        template: tpl,
        className: 'spo-download',

        initialize : function(params){
            this.txId = params.txId;
        },

        serializeData : function(){
            var url = Ctx.url('sign.purchase.order.download', {txId : this.txId});
            return {url : url};
        }
    });

    return View;

});