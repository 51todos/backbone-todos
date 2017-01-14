/**
 * User hefeng
 * Date 2016/5/9
 */
define([
    'app/group_merchant/common/components/page/view',
    'app/group_merchant/common/components/search/view',
    'tpl!app/group_merchant/bill/templates/search.tpl'
], function(PageView, SearchView, searchTplFn) {
    // Utils
    var formatUtil = Opf.Util.Format;
    var buildUtil = Opf.Util.Build;

    // pageView onRender
    var _onRender = PageView.prototype.onRender;

    return PageView.extend({
        caption: '对账信息',

        searchTemplate: searchTplFn(),

        grid: {
            caption: '查询结果',

            defaultRenderGrid: false,

            url: Ctx.url('groupMerchant.bill.list'), // 远程请求地址

            toolbar: [
                {
                    name: 'downloadBill',
                    btnCls: 'btn-link',
                    iconCls: 'icon-download',
                    text: '下载对账单',
                    onClick: 'download:bill'
                }
            ],

            gridComplete: function(resp) {
                var formatData = {
                    "content": [],
                    "ignoreFields": [],
                    "statDataMap": {},
                    "size": 10,
                    "number": 0,
                    "sort": null,
                    "lastPage": false,
                    "firstPage": false,
                    "totalPages": 0,
                    "totalElements": 0,
                    "numberOfElements": 0
                };

                var toolbarView = this.toolbarView;
                var $downloadBillBtn = toolbarView.$el.find('button[name="downloadBill"]');

                if(!_.isEmpty(resp)) {

                    // 设置汇总信息
                    var statDataMap = formatData.statDataMap;
                    statDataMap.totalAmt = resp.totalAmt; // 交易金额
                    statDataMap.totalFeeAmt = resp.totalFeeAmt; // 交易手续费
                    statDataMap.totalFreeFeeAmt = resp.totalFreeFeeAmt; // 交易手续费减免
                    statDataMap.totalSettleAmt = resp.totalSettleAmt; // 应结总额

                    // 设置分页信息
                    var page = resp.page||{};
                    formatData.number = page.number;
                    formatData.size = page.size;
                    formatData.totalElements = page.totalCount;
                    formatData.totalPages = page.totalPages;
                    formatData.firstPage = !page.previous;
                    formatData.lastPage = !page.next;
                    formatData.sort = page.sort;

                    // 设置数据列表
                    formatData.content = page.result;

                    // 启用下载按钮
                    $downloadBillBtn.prop('disabled', false);
                } else {
                    $downloadBillBtn.prop('disabled', true);
                }

                return formatData;
            },

            colNames: {
                txTime: '交易时间',
                acNo: '交易卡号',
                type: '支付方式',
                traceNo: '流水号',
                vocheNo: '凭证号',
                cycle: '结算周期',
                txAmt: '交易金额',
                feeAmt: '手续费',
                freeFeeAmt: '减免手续费',
                settleAmt: '结算金额',
                snNo: '终端编号'
            },

            colModel: [
                {
                    name: 'txTime',
                    type: 'daterangepicker',
                    searchable: true,
                    searchOption: {
                        tips: "查询日期范围不能超过31天"
                    }
                },
                { name: 'acNo', hidden:true, viewable:true },
                { name: 'type', formatter: formatUtil.txTypeFormatter },
                { name: 'traceNo' },
                { name: 'vocheNo', hidden:true, viewable:true },
                {
                    name: 'cycle',
                    viewable: false,
                    formatter: formatUtil.cycleFormatter
                },
                {
                    name: 'txAmt',
                    formatter: function(val) {
                        return '<span class="text-color-green">'+ formatUtil.incomeFormatter(val) +'</span>';
                    }
                },
                {
                    name: 'feeAmt',
                    formatter: function(val) {
                        return '<span class="text-color-blue">'+ formatUtil.outlayFormatter(val) +'</span>';
                    }
                },
                {
                    name: 'freeFeeAmt',
                    formatter: function(val) {
                        return '<span class="text-color-brown">'+ formatUtil.outlayFormatter(val) +'</span>';
                    }
                },
                {
                    name: 'settleAmt',
                    formatter: formatUtil.amtFormatter
                },
                { name: 'snNo', hidden:true, viewable:true }
            ],

            /**
             * [{
                 *  text: '更改状态',
                 *  name: 'changeState',
                 *  onClick: function() {} //回调
                 * }]
             */
            colAction: [],

            /**
             * edit/del/view 值为false则不显示该按钮
             * canRender: function(name){ <this> 行数据 } 可以根据行数据判断name="changeState"的按钮是否显示
             */
            colActionConf: {
                canRender: function(name, rowData) {
                    return !(name == 'del' || name == 'edit');
                }
            }
        },

        onDownloadBill: function(gridContext, $target) {
            var downloadOptions = {
                $el: $target,
                caption: "下载对账单",
                url: Ctx.url('groupMerchant.bill.algoDownload'),
                ajaxData: gridContext.parent.searchView.confView.getValues()
            };

            Opf.Util.download(downloadOptions);
        },

        onRender: function() {
            // 自定义searchView
            this.searchView = new SearchView(
                {searchTemplate: this.searchTemplate},
                {context:this}
            );

            _onRender.call(this, arguments);

            // triggerMethod
            this.gridView.on('download:bill', this.onDownloadBill);

            // 扩展UI
            this.ui.visibleRange = this.$el.find('select[name="visibleRange"]');
            this.ui.userId = this.$el.find('select[name="userId"]');

            // 初始化“交易门店”组件
            this.renderVisibleRange(this.ui.visibleRange);
            this.renderUsers(this.ui.userId);

        },

        renderVisibleRange: function($target) {
            var that = this, ui = that.ui;

            buildUtil.buildSelect($target, 'visibleRangeMap');

            $target.on('change', function() {
                var $self = $(this);

                switch($self.val()) {
                    // 本门店
                    /*case "1":
                        _clear($self, true);
                        that.renderUsers(ui.userId);

                        break;*/

                    // 搜索门店
                    case "2":
                        _clear($self, false);

                        var $select = $('<input name="mchtName" class="form-control" style="width: auto;" />');

                        $self.after($select);

                        buildUtil.buildSelect2($select, {
                            ajax: {
                                url: Ctx.url('groupMerchant.search.store')
                            },
                            params: {
                                id: 'name', // 获取参数标识
                                key: 'name',
                                onChange: function(e) {
                                    _clear(null, true);
                                    that.renderUsers(ui.userId, {
                                        mchtNo: e.val
                                    });
                                }
                            }
                        });
                        break;

                    // 通过分组选择
                    case "3":
                        _clear($self, false);

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

                        groupInfoEl.on('change', function() {
                            _clear(null, false);

                            // 生成门店列表
                            var groupId = groupInfoEl.find('option:selected').val();
                            var groupStore = buildUtil.buildAjaxSelect({
                                el: '<select name="mchtName" class="form-control form-control-inline" />',
                                convertField: {
                                    name: 'name',
                                    value: 'name'
                                },
                                ajax: {
                                    url: Ctx.url('groupMerchant.search.name'),
                                    data: {
                                        groupId: groupId
                                    }
                                }
                            });
                            var groupStoreEl = groupStore.$el;

                            groupInfoEl.next().remove();
                            groupInfoEl.after(groupStoreEl);
                            groupStoreEl.on('change', function() {
                                // 生成收银员列表
                                _clear(null, true);

                                var mchtNo = groupStoreEl.find('option:selected').attr('data-mchtNo');

                                that.renderUsers(ui.userId, {
                                    //groupId: groupId,
                                    mchtNo: mchtNo
                                });
                            });
                        });
                        break;
                    default:
                        break;
                }
            }).trigger('change');

            function _clear($self, flag) {
                $self && $self.siblings().remove();
                ui.userId.closest('.form-group').toggle(flag);
            }
        },

        // 收银员列表
        renderUsers: function($target, params) {
            //$target.show();

            var usersSel = buildUtil.buildAjaxSelect($target, {
                convertField: {
                    name: 'name',
                    value: 'id'
                },
                ajax: {
                    url: Ctx.url('groupMerchant.search.users'),
                    data: params || null,
                    success: function() {
                        usersSel.$el.prepend('<option value="0" selected="selected">全部收银员</option>');
                    }
                }
            });

            return usersSel;
        }
    })
});