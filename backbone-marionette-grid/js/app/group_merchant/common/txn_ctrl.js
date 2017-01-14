/**
 * User hefeng
 * Date 2016/5/6
 */
define([
    'app/group_merchant/txn/page_view'
], function(PageView) {

    var TxnCtrl = Marionette.Controller.extend({
        show: function() {
            if(!this._hasRender) {
                this._render();
                this._hasRender = true;
            }
        },

        _render: function() {
            App.txnRegion.show(new PageView);
        }
    });

    return new TxnCtrl;

});