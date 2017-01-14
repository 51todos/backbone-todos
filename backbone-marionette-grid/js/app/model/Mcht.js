/**
 * 商户基本信息
 */
define([
], function() {

    return Backbone.Model.extend({

        initialize: function () {
            var me = this;

            this._loadedFlag = false;

            this.on('sync', function () {
                me._loadedFlag = true;
            });

            this.fetch();
        },

        //TODO 还是有点恶心
        hasLoaded: function () {
            return this._loadedFlag;
        },

        url: Ctx.url('mcht.info')

    });
    
});