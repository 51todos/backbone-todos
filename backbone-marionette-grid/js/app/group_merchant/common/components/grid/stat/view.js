define([
    'tpl!app/group_merchant/common/components/grid/stat/templates/stat.tpl'
],function(statTplFn){

    return Marionette.ItemView.extend({
        template: statTplFn,

        className: 'component-grid-stat',

        ui: {

        },

        initialize: function(data) {
            this.statData = data;

            this.render();
        },

        serializeData: function() {
            return {
                statData: this.statData
            };
        },

        onRender: function() {
            //TODO
        }
    })

});
