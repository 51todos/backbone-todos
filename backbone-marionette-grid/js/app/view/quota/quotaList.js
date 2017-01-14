define([
    'tpl!app/view/quota/templates/quotaList.tpl'
],function(listTpl){
    return Marionette.ItemView.extend({
        //template: listTpl,
        initialize: function(options){
            this.data = options.data;
        },
        doRender: function(){
            return listTpl({items:this.data});
        }
    });

});
