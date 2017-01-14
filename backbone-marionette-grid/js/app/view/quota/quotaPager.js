define([
    'tpl!app/view/quota/templates/quotaPager.tpl'
], function(pagerTpl){
    return Marionette.ItemView.extend({
        initialize: function(options){
            this.data = options.data;
        },

        doRender: function(){
            return pagerTpl({page:this.data});
        }
    });
});