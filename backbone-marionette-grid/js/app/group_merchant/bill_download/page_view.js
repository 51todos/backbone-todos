/**
 * User hefeng
 * Date 2016/5/9
 */
define([
    'app/group_merchant/common/components/page/view',
    'app/group_merchant/common/components/config/view',
    'tpl!app/group_merchant/bill_download/templates/download.tpl'
], function(PageView, ConfView, downloadTplFn) {
    var _events = PageView.prototype.events;

    var buildUtil = Opf.Util.Build;

    return PageView.extend({
        caption: '账单下载',

        events: _.extend({}, _events, {
            'click #billDownloadIBX': 'billDownloadIBXFn',
            'click #billDownloadWX': 'billDownloadWXFn',
            'click #billDownloadZFB': 'billDownloadZFBFn'
        }),

        onRender: function() {
            var confOptions = {
                showType: 'search',
                contentConf: downloadTplFn()
            };

            var confView = this.confView = new ConfView(confOptions);

            this.searchRegion.show(confView);

            // 扩展UI
            this.ui.visibleRange = confView.$el.find('select[name="visibleRange"]');

            // 初始化“交易门店”组件
            this.renderVisibleRange(this.ui.visibleRange);
        },

        renderVisibleRange: function($target) {
            var that = this, ui = that.ui;

            buildUtil.buildSelect($target, 'visibleMap4download');

            $target.on('change', function() {
                var $self = $(this);

                switch($self.val()) {
                    // 指定分组
                    case "4":
                        _clear($self);

                        // 生成分组
                        var groupInfo = buildUtil.buildAjaxSelect({
                            el: '<select name="groupId" class="form-control form-control-inline" />',
                            url: Ctx.url('groupMerchant.search.groups'),
                            selected: true,
                            convertField: {
                                name: 'groupName',
                                value: 'groupId'
                            }
                        });
                        var groupInfoEl = groupInfo.$el;

                        $self.after(groupInfoEl);
                        break;

                    // 指定门店
                    case "5":
                        _clear($self);

                        var $select = $('<input name="mchtName" class="form-control" style="width: auto;" />');

                        $self.after($select);

                        buildUtil.buildSelect2($select, {
                            ajax: {
                                url: Ctx.url('groupMerchant.search.store')
                            },
                            params: {
                                id: 'name', // 获取参数标识
                                key: 'name' // 查询关键词标识
                            }
                        });
                        break;

                    default:
                        break;
                }
            }).trigger('change');

            function _clear($self, flag) {
                $self && $self.siblings().remove();
            }
        },

        billDownloadIBXFn: function(evt) {
            var downloadOptions = {
                $el: $(evt.target),
                caption: "下载钱盒对账单",
                url: Ctx.url('groupMerchant.bill.download'),
                ajaxData: _.extend(this.confView.getValues(), {paymentMethod:'201'})
            };

            Opf.Util.download(downloadOptions);
        },

        billDownloadWXFn: function(evt) {
            var downloadOptions = {
                $el: $(evt.target),
                caption: "下载微信对账单",
                url: Ctx.url('groupMerchant.bill.download'),
                ajaxData: _.extend(this.confView.getValues(), {paymentMethod:'202'})
            };

            Opf.Util.download(downloadOptions);
        },

        billDownloadZFBFn: function(evt) {
            var downloadOptions = {
                $el: $(evt.target),
                caption: "下载支付宝对账单",
                url: Ctx.url('groupMerchant.bill.download'),
                ajaxData: _.extend(this.confView.getValues(), {paymentMethod:'203'})
            };

            Opf.Util.download(downloadOptions);
        }
    })
});