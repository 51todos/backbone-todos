define([
    'app/group_merchant/store/page_view'
], function(PageView) {
    //var quotaTask = new Collection(); //{url: Ctx.url('quota.list')}
    var Ctrl = Marionette.Controller.extend({
        show: function() {
            if (!this._hasRender) {
                App.storeRegion.show(new PageView());
            }
            this._hasRender = true;
        }
    });

    var ctrl = new Ctrl();

    App.on('show:store', function() {
        shiftTheTab();
        ctrl.show();
    });

    function shiftTheTab() {
        $(".tab-pane").removeClass("active");
        $("#store-pane").addClass("active");
        $("#main-tabs").children("li").removeClass("active");
    }

});