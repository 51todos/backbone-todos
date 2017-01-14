define([
    'app/group_merchant/users/page_view'
], function(PageView) {
    var Ctrl = Marionette.Controller.extend({
        show: function() {
            if (!this._hasRender) {
                App.usersRegion.show(new PageView());
            }
            this._hasRender = true;
        }
    });

    var ctrl = new Ctrl();

    App.on('show:users', function() {
        shiftTheTab();
        ctrl.show();
    });

    function shiftTheTab() {
        $(".tab-pane").removeClass("active");
        $("#users-pane").addClass("active");
        $("#main-tabs").children("li").removeClass("active");
    }

});