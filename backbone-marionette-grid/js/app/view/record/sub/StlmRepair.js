define([
    'app/view/record/sub/BaseSubView',
    'tpl!app/view/record/sub/templates/stlmRepair.tpl',
    'tpl!app/view/record/sub/templates/billAdjustHistory.tpl'
], function(BaseSubView, tpl, historyTpl) {

    var RESULT_FLAG = {
        '9': '未处理。',
        '8': '补账中。',
        '7': '补账完毕。',
        '3': '调账结束，已作退货处理。',
        '2': '调账结束，已作挂账处理。',
        '1': '调账结束，已调金额将会参与下一次清算。',
        '0': '调账结束，已调金额已经清算到您的收款账户。'
    };
//     3 调账结束，已作退货处理。
// 2 调账结束，已作挂账处理。
// 1 调账结束，已调金额将会参与下一次清算。
// 0 调账结束，已调金额已经清算到您的收款账户。
// 其他状态通通不显示。而且也不会带有处理描述。

    return BaseSubView.extend({

        title: '资金截留',

        events: {
            'click .js-view-history': 'onViewAdjustHistoryClick'
        },

        onViewAdjustHistoryClick: function (e) {
            var $trigger = $(e.target).closest('tr');
            var repairId = $trigger.attr('repairId');

            var tpl = [
            '<div class="bill-adjust-history">',
                '调账历史',
                '<div class="separator"></div>',
                '<div class="content"></div>',
            '</div>'
            ].join('');
            $history = $(tpl);
            var $content = $history.find('.content');

            this._box = $('<a></a>').fancybox({
                openEffect: 'none',
                closeEffect: 'none',
                afterLoad: function() {
                    this.inner.append($history);
                    Opf.UI.setLoading($content);
                    Opf.ajax({
                        url: Ctx.url('bill.date.repair.history', {
                            repairId: repairId
                        }),
                        success: function (resp) {
                            var strHtml = '无数据';
                            if(resp && resp.length) {
                                strHtml = historyTpl({data:resp});
                            }
                            Opf.UI.setLoading($content, false);
                            $content.append(strHtml);
                        }
                    });
                }
            }).click();
        },

        onRender: function () {
            BaseSubView.prototype.onRender.apply(this, arguments);

            var strHtml = tpl({
                data: this.data,
                helpers: {
                    getHead: function (item) {
                        return [
                        '<div>'+Opf.String.confirmFullStop(item.repairDesc)+'</div>',
                        '<div class="text-right">—— ',
                            Opf.String.replaceYMD(item.repairDate, '$2月$3日'),
                        '</div>'
                        ].join('');
                    },
                    getFoot: function (item) {
                      return (RESULT_FLAG[item.resultFlag] || '') + 
                                Opf.String.confirmFullStop(item.nextDo);
                    }
                }
            });


            this.$('.content').html(strHtml);
        }

    });


});