/**
 * Created by hefeng on 2016/2/22.
 */
define([
    'tpl!app/group_merchant/common/components/grid/templates/header.tpl'
], function(headerTplFn) {
    return Marionette.ItemView.extend({
        className: 'grid-header',

        tagName: 'tr',

        template: headerTplFn,

        initialize: function(options, params) {
            this.options = options;
            this.parent = (params && params.context) || null;
            this.render();
        },

        serializeData: function() {
            return {opts:this.options};
        },

        ui: {
            'checkbox': ':checkbox'
        },

        events: {
            'click @ui.checkbox': 'onCheck'
        },

        onCheck: function(e) {
            if($(e.target).is(':checked')) { //$("#xxx").prop("checked")
                this.trigger('grid:checked');
            } else {
                this.trigger('grid:unchecked');
            }
        }
    })
});
