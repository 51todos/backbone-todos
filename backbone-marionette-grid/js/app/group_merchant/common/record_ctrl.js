/**
 * User hefeng
 * Date 2016/5/6
 */
define([
    'app/group_merchant/record/page_view'
], function(RecordPageView) {

    var RecordCtrl = Marionette.Controller.extend({
        show: function() {
            if(!this._hasRender) {
                this._render();
                this._hasRender = true;
            }
        },

        _render: function() {
            App.recordRegion.show(new RecordPageView);
        }
    });

    return new RecordCtrl;

});