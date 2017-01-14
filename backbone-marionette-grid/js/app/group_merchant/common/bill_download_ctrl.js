/**
 * User hefeng
 * Date 2016/5/6
 */
define([
    'app/group_merchant/bill_download/page_view'
], function(BillDownloadPageView) {

    var BillDownloadCtrl = Marionette.Controller.extend({
        show: function() {
            if(!this._hasRender) {
                this._render();
                this._hasRender = true;
            }
        },

        _render: function() {
            App.billDownloadRegion.show(new BillDownloadPageView);
        }
    });

    return new BillDownloadCtrl;

});