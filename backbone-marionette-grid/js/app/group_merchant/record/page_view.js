/**
 * User hefeng
 * Date 2016/5/9
 */
define([
    'app/group_merchant/common/components/page/view',
    'app/group_merchant/common/components/search/view',
    'tpl!app/group_merchant/record/templates/search.tpl'
], function(PageView, SearchView, searchTplFn) {
    // Utils
    var formatUtil = Opf.Util.Format;
    var buildUtil = Opf.Util.Build;

    // SearchView
    var _onRender = PageView.prototype.onRender;

    var settleDateFormatter = function(val) {
        return val? moment(val, 'YYYYMMDD').formatYMD():"";
    };

    var settleStateFormatter = function(val) {
        var stateStr = "";

        if(val == "已结算") {
            stateStr += '<span class="label label-success">'+val+'</span>';

        } else if(val == "未结算") {
            stateStr += '<span class="label label-danger">'+val+'</span>';

        } else if(val == "结算失败") {
            stateStr += '<span class="label label-warning">'+val+'</span>';

        } else {
            stateStr += val||"";
        }

        return stateStr;
    };

    return PageView.extend({
        caption: '结算记录',

        searchTemplate: searchTplFn(),

        grid: {
            caption: '查询结果',

            defaultRenderGrid: false,

            url: Ctx.url('groupMerchant.record.list'), // 远程请求地址

            toolbar: [
                {
                    name: 'downloadRecord',
                    btnCls: 'btn-link',
                    iconCls: 'icon-download',
                    text: '下载结算单',
                    onClick: 'download:record'
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
                var $downloadRecordBtn = toolbarView.$el.find('button[name="downloadRecord"]');

                if(!_.isEmpty(resp)) {

                    // 设置汇总信息
                    var statDataMap = formatData.statDataMap;
                    statDataMap.settleAmt = resp.settleAmt; // 交易金额
                    statDataMap.waitingSettleAmt = resp.waitingSettleAmt; // 交易手续费

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
                    $downloadRecordBtn.prop('disabled', false);
                } else {
                    $downloadRecordBtn.prop('disabled', true);
                }

                return formatData;
            },

            colNames: {
                mchtName: '商户名称',
                //mchtNo: '商户号',
                acNo: '收款账户',
                settleAmt: '结算金额',
                settleDate: '结算日期',
                settleState: '结算状态'
            },

            colModel: [
                { name: 'mchtName' },
                //{ name: 'mchtNo' },
                { name: 'acNo' },
                { name: 'settleAmt', formatter: formatUtil.amtFormatter },
                {
                    name: 'settleDate',
                    type: 'daterangepicker',
                    /*searchable: true,
                    searchOption: {
                        tips: "查询日期范围不能超过31天"
                    },*/
                    formatter: settleDateFormatter
                },
                { name: 'settleState', formatter: settleStateFormatter }
            ],

            /**
             * [{
                 *  text: '更改状态',
                 *  name: 'changeState',
                 *  onClick: function() {} //回调
                 * }]
             */
            colAction: [
                {
                    text: '结算详情',
                    name: 'settleDetails',
                    onClick: function(rowData, $el) {
                        //console.log("查看详情", this.parent, rowData, $el);

                        var gridView = this.parent;
                        var pageView = gridView.parent;
                        var $pageEl = pageView.$el;

                        var ajaxOptions = {
                            type: 'GET',
                            dataType: 'json',
                            url: Ctx.url('groupMerchant.record.details'),
                            data: {settleDate:rowData.settleDate, mchtNo:rowData.mchtNo},
                            beforeSend: function() {
                                Opf.UI.setLoading($pageEl, true);
                            },
                            success: function(resp) {
                                // 隐藏页面
                                $pageEl.hide();

                                require(['app/group_merchant/record/details_view'], function(DetailView) {
                                    var detailView = new DetailView({resp: resp, row: rowData});

                                    detailView.on('close', function() { $pageEl.show(); });

                                    $pageEl.after(detailView.$el);
                                })
                            },
                            complete: function() {
                                Opf.UI.setLoading($pageEl, false);
                            }
                        };

                        $.ajax(ajaxOptions);
                    }
                }
            ],

            /**
             * edit/del/view 值为false则不显示该按钮
             * canRender: function(name){ <this> 行数据 } 可以根据行数据判断name="changeState"的按钮是否显示
             */
            colActionConf: {
                canRender: function(name, rowData) {
                    return !(name == 'del' || name == 'edit' || name == 'view');
                }
            }
        },

        onDownloadRecord: function(gridContext, $target) {
            var downloadOptions = {
                $el: $target,
                caption: "下载结算单",
                url: Ctx.url('groupMerchant.record.download'),
                ajaxData: gridContext.parent.searchView.confView.getValues()
            };

            Opf.Util.download(downloadOptions);
        },

        onRender: function() {
            this.searchView = new SearchView(
                {searchTemplate: this.searchTemplate},
                {context:this}
            );

            _onRender.call(this, arguments);

            // triggerMethod
            this.gridView.on('download:record', this.onDownloadRecord);

            // 扩展UI
            this.ui.visibleRange = this.$el.find('select[name="visibleRange"]');

            // 初始化“交易门店”组件
            this.renderVisibleRange(this.ui.visibleRange);
        },

        renderVisibleRange: function($target) {
            var that = this, ui = that.ui;

            buildUtil.buildSelect($target, 'visibleMap');

            $target.on('change', function() {
                var $self = $(this);

                switch($self.val()) {
                    // 所有门店
                    case "1":
                    // 本门店
                    case "2":
                    // 下属门店
                    case "3":
                        _clear($self);
                        break;

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
                        /*var subGroupInfoEl = [
                            '<div class="form-control-inline">',
                                '<label class="checkbox">',
                                    '<input name="visibleBelowMcht" type="checkbox" data-type="radio" checked> 及其下属门店',
                                '</label>',
                            '</div>'
                        ].join('');*/

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

            function _clear($self) {
                $self && $self.siblings().remove();
            }
        }
    })
});