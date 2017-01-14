/**
 * User hefeng
 * Date 2016/5/6
 */
define([
    'app/group_merchant/bill/page_view'
], function(BillPageView) {

    var BillCtrl = Marionette.Controller.extend({
        show: function() {
            if(!this._hasRender) {
                this._render();
                this._hasRender = true;
            }
        },

        _render: function() {
            App.billRegion.show(new BillPageView);
        }
    });

    return new BillCtrl;

});