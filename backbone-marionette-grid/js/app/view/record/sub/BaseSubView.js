define([
    'tpl!app/view/record/sub/sub.tpl'
], function(tpl) {
    var HELP_MAP = {
        '异常交易':'异常交易包括以下2种情况：<br>1.疑似违规的交易，例如同一张卡过于频繁地交易；<br>2.我方的交易记录与银联不一致，这通常是由于网络原因造成的。<br>当发生异常交易时，我们会暂时延迟该笔交易的结算，并派专员第一时间与您联系，确认交易情况正常后，我们会在最近的结算日转款给您。',
        '异常交易已确认无误':'之前被延迟结算的异常交易，我们现已确认交易情况无误。相关资金已经并入本日的结算金额中，一并结算给您，感谢您的耐心与理解。',
        '结算失败后再次转款':'导致结算失败的问题已经解决，因此资金已并入本日的结算金额中，一并结算给您。',
        '资金截留':'发生消费者调单拒付等特殊情况时，我们会先截留您的部分结算资金，并派专员第一时间与您联系。问题解决后，我们将在最近的结算日归还您的资金。',
        '归还截留资金':'之前截留的资金，已经并入本日的结算金额中归还给您。感谢您的耐心与理解。'
    };

    return Marionette.ItemView.extend({

        template: tpl,

        initialize: function (options) {
            // this.title = options.title;            
            this.data = options.data;
        },

        onRender: function () {
            var me = this;
            this.$el.on('click', '.back-trigger', function () {
                me.close();
            });
            this.$el.on('click','.get-help',function () {
                var aHack =  $('<a></a>');
                var $help = [
                    '<div class="help-wrap">',
                        '<span class="help-label">'+ HELP_MAP[me.title] +'</span>' ,
                    '</div>'
                ].join('');
                this._box = aHack.fancybox({
                    helpers: {
                        overlay: {
                            closeClick: false 
                        }
                    },
                    openEffect: 'none',
                    closeEffect: 'none',
                    afterLoad: function() {
                        this.inner.append($help);
                        me.$el.show();
                    }
                }).click();
            });
            me.$('.caption').text(me.title);
        }

    });

});