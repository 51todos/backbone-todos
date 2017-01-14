define([
    'app/view/record/sub/BaseSubView',
    'tpl!app/view/record/sub/templates/failToSettle.tpl'
], function(BaseSubView, tpl) {


    return BaseSubView.extend({

        title: '结算失败后再次转款',
        onRender: function () {
            BaseSubView.prototype.onRender.apply(this, arguments);

            var strHtml = tpl({
                data: this.data,
                helpers: {
                    getHead: function (data) {
                        return Opf.String.confirmFullStop(data.retMsg);
                    },

                    getFoot: function (data) {
                        return Opf.String.confirmFullStop(data.nextDo);
                    }
                }
            });

            console.log('结算失败后再次转款', this.data, strHtml);

            this.$('.content').html(strHtml);
        }

    });


});