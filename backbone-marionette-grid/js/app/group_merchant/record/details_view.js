/**
 * User hefeng
 * Date 2016/5/9
 */
define([
    'app/group_merchant/common/components/page/view',
    'app/group_merchant/record/details_conf',
    'tpl!app/group_merchant/record/templates/details.tpl'
], function(PageView, DetailsConf, DetailsTplFn) {
    var _onRender = PageView.prototype.onRender;
    var _serializeData = PageView.prototype.serializeData;

    return PageView.extend({
        initialize: function(data) {
            this.data = data;
            this.render();
        },

        template: DetailsTplFn,

        caption: '结算详情',

        toolbar: [
            {
                name: 'reply',
                btnCls: 'btn-primary',
                iconCls: 'icon-reply',
                text: '返回',
                onClick: 'record:reply'
            }
        ],

        serializeData: function() {
            var serializeObj = _serializeData.apply(this, arguments);

            return _.extend(this.data, serializeObj, {detailsConf: DetailsConf});
        },

        onRender: function() {
            _onRender.apply(this, arguments);
        },

        onRecordReply: function() {
            this.close();
        }

    })
});