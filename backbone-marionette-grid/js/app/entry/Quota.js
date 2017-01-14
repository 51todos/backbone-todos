define([
    'app/view/quota/quotaView'
], function(quotaView, Collection) {
    //var quotaTask = new Collection(); //{url: Ctx.url('quota.list')}
    var Ctrl = Marionette.Controller.extend({
        /*initialize: function() {
            this.collection = new Collection();
        },*/

        showList: function() {
            var me = this;
            me.view = new quotaView();

            //me._addListener();
            //quotaTask.getFirstPage();

            App.quotaRegion.show(me.view);
        },

        _addListener: function(){
            var me = this;

            /*this.collection.on('sync', function(model, resp){
                console.log("========== sync ============");
                console.info(me.view);


            });*/


            /*me.view.on('first:page', function(){ quotaTask.getFirstPage();});
            me.view.on('last:page', function(){ quotaTask.getLastPage();});
            me.view.on('previous:page', function(){ quotaTask.getPreviousPage();});
            me.view.on('next:page', function(){ quotaTask.getNextPage();});*/
        }

    });

    var ctrl = new Ctrl();

    App.on('show:quota', function(event) {
        shiftTheTab();
        ctrl.showList();
    });

    function shiftTheTab() {
        $(".tab-pane").removeClass("active");
        $("#quota-pane").addClass("active");
        $("#main-tabs").children("li").removeClass("active");
    }

});