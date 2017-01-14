define([
    'tpl!app/group_merchant/common/components/grid/templates/pager.tpl'
], function(pagerTplFn){
    return Marionette.ItemView.extend({
        initialize: function(options){
            this.data = options.data;
        },

        doRender: function(){
            return pagerTplFn({page:this.data});
        }
    });
});