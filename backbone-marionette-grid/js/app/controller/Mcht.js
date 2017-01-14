define([
    'app', 
    'app/view/mcht/Mcht', 
    'app/model/Mcht'
], function(App, MchtView, MchtModel) {

    return Marionette.Controller.extend({

        initialize: function () {
            this.model = new MchtModel();

            //TODO临时，到时候弄个请求专门获取用户信息...
            this.model.on('sync', function (m, resp) {
                $('#user-nav').find('.username').text(resp.mchtUserName);
            });
        },

        busy: function (toggle) {
            App.mchtRegion.ensureEl();
            Opf.UI.setLoading(App.mchtRegion.$el, toggle);
        },

        _renderMchtView: function () {
            var me = this;

            if(!this._hasRender) {

                me.busy();
                me.model.fetch({
                    success: function () {
                        var view = new MchtView({
                            model: me.model
                        });
                        App.mchtRegion.show(view);
                    },
                    complete: function () {
                        me.busy(false);
                    }
                });

            }

            this._hasRender = true;
        },

        show: function () {
            this._renderMchtView();
        }

    });
});