define([
    'app/view/mcht/Mcht'
], function(MchtView) {

    var Ctrl = Marionette.Controller.extend({

        initialize: function(model) {
            //TODO恶心
            this.model = App.getMchtModel();
        },

        busy: function(toggle) {
            App.mchtRegion.ensureEl();
            Opf.UI.setLoading(App.mchtRegion.$el, toggle);
        },

        _render: function() {
            var view = new MchtView({
                model: this.model
            });
            App.mchtRegion.show(view);
        },

        renderMchtView: function() {
            var me = this;

            if (!this._hasRender) {
                //太恶心了
                if (me.model.hasLoaded()) {
                    me._render();
                } else {
                    me.model.once('sync', function() {
                        me._render();
                    });
                }
            }

            this._hasRender = true;
        },

        show: function() {
            this.renderMchtView();
        }
    });

    var ctrl = new Ctrl();

    App.on('show:mcht', function(event) {
        shiftToMchtTab();
        ctrl.show();

        function shiftToMchtTab() {
            $(".tab-pane").removeClass("active");
            $("#mcht-pane").addClass("active");
            $("#main-tabs").children("li").removeClass("active");
        }
    });

});