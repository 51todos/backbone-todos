define([
    'app/view/service/Service',
    'app/store/PagebleService'
    ],function(ComView,Collection){
    var Ctr = Marionette.Controller.extend({


        initialize: function(){
            var me = this;
            this.mchtNo = App.getMchtModel().get('mchtNo');
            this.collection = new Collection([],{url: Ctx.url('service.list', {mchtNo: this.mchtNo})});
        },

        showList: function(){
            var me = this;
            //若不在每次调用 showList 时 new 一个 view ，则会出现 ViewDestroyedError 错误
            me.view = new ComView({collection: me.collection});
            me._addListener();
            me.collection.getFirstPage();
        },


        _addListener: function(){
            var me = this;
            this.view.on('request:stop:service', function(id, $el){
                var $button = $el.find('.request-stop-service'),
                    data = {
                        mchtNo: me.mchtNo,
                        ids: $.makeArray(id)
                    };
                Opf.UI.busyText($button);
                Opf.ajax({
                    url: $button.hasClass('request') ? Ctx.url('request.service') : Ctx.url('stop.service'),
                    type: 'POST',
                    data: JSON.stringify(data),
                    success: handleSuccess,
                    complete: function(){
                        Opf.UI.busyText($button, false);
                        me.collection.getFirstPage();
                    }
                });

                function handleSuccess(resp){
                }
            });

            this.collection.on('sync', function(model, resp){
                App.serviceRegion.show(me.view);
            });


            this.view.on('first:page', function(){ this.collection.getFirstPage();});
            this.view.on('last:page', function(){ this.collection.getLastPage();});
            this.view.on('previous:page', function(){ this.collection.getPreviousPage();});
            this.view.on('next:page', function(){ this.collection.getNextPage();});
        }

        
    });

    var ctrl = new Ctr();

    App.on('show:service', function(event) {
        shiftToServiceTab();
        ctrl.showList();

        function shiftToServiceTab() {
            $(".tab-pane").removeClass("active");
            $("#service-pane").addClass("active");
            $("#main-tabs").children("li").removeClass("active");
        }
    });
});