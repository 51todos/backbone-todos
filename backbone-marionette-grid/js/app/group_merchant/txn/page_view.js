/**
 * User hefeng
 * Date 2016/5/9
 */
define([
    'app/group_merchant/common/components/page/view',
    'app/group_merchant/common/components/search/view',
    'tpl!app/group_merchant/txn/templates/tab.tpl',
    'tpl!app/group_merchant/txn/templates/search.tpl',
    'tpl!app/group_merchant/txn/templates/precise.tpl'
], function(PageView, SearchView, tabTplFn, searchTplFn, preciseTplFn) {
    // Utils
    var formatUtil = Opf.Util.Format;
    var buildUtil = Opf.Util.Build;

    // SearchView
    var _onRender = PageView.prototype.onRender;

    var SearchPageView = PageView.extend({

        //caption: '交易流水',

        searchTemplate: searchTplFn(),

        /*toolbar: [{
            name: 'searchPrecise',
            btnCls: 'btn-success',
            iconCls: 'icon-search',
            text: '精准搜索',
            onClick: 'search:precise:txn'
        }],*/

        grid: {
            caption: '查询结果',

            defaultRenderGrid: false,

            url: Ctx.url('groupMerchant.txn.list'), // 远程请求地址

            toolbar: [
                {
                    name: 'downloadTxn',
                    btnCls: 'btn-link',
                    iconCls: 'icon-download',
                    text: '下载交易流水',
                    onClick: 'download:txn'
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
                    "lastPage": true,
                    "firstPage": true,
                    "totalPages": 0,
                    "totalElements": 0,
                    "numberOfElements": 0
                };

                var toolbarView = this.toolbarView;
                var $downloadTxnBtn = toolbarView.$el.find('button[name="downloadTxn"]');

                if(!_.isEmpty(resp)) {
                    // 设置汇总信息
                    var statDataMap = formatData.statDataMap;
                    statDataMap.total = resp.total||"";
                    statDataMap.totalAmt = resp.totalAmt||"";

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
                    $downloadTxnBtn.prop('disabled', false);
                } else {
                    $downloadTxnBtn.prop('disabled', true);
                }

                return formatData;
            },

            colNames: {
                txTime: '交易时间',
                traceNo: '流水号',
                type: '交易类型',
                state: '交易状态',
                acNo: '消费卡号',
                cycle: '结算周期',
                txAmt: '交易金额',
                mchtName: '商户名',
                snNo: '终端编号',
                fd37: '参考号'
            },

            colModel: [
                {
                    name: 'mchtName',
                    hidden: true,
                    viewable: true
                },
                {
                    name: 'snNo',
                    hidden: true,
                    viewable: true
                },
                {
                    name: 'txTime',
                    type: 'daterangepicker'
                    /*searchable: false,
                    searchOption: {
                        tips: "查询日期范围不能超过31天"
                    }*/
                },
                {
                    name: 'traceNo'
                },
                {
                    name: 'type',
                    formatter: formatUtil.txTypeFormatter
                },

                {
                    name: 'state',
                    formatter: formatUtil.stateFormatter
                },
                {
                    name: 'acNo'
                },
                {
                    name: 'cycle',
                    viewable: false,
                    formatter: formatUtil.cycleFormatter
                },
                {
                    name: 'txAmt',
                    formatter: formatUtil.amtFormatter
                },
                {
                    name: 'fd37',
                    hidden: true,
                    viewable: true
                }
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

        onDownloadTxn: function(gridContext, $target) {
            var downloadOptions = {
                $el: $target,
                caption: "下载交易流水",
                url: Ctx.url('groupMerchant.txn.download'),
                ajaxData: gridContext.parent.searchView.confView.getValues()
            };

            Opf.Util.download(downloadOptions);
        },

        // 精准搜索
        /*onSearchPreciseTxn: function(p, $target) {
            var that = this; // pageView

            require([
                'app/group_merchant/common/components/dialog/view',
                'tpl!app/group_merchant/txn/templates/precise.tpl'
            ], function(DialogView, preciseTplFn) {
                var searchPreciseView = new DialogView({
                    dialogConf: {
                        title: '精准搜索',
                        type: 'search',
                        modalType: 'md',
                        context: that
                    },
                    contentConf: preciseTplFn()
                });
            });
        },*/

        onRender: function() {
            // 自定义searchView
            var searchView = this.searchView = new SearchView(
                {searchTemplate: this.searchTemplate},
                {context:this}
            );

            _onRender.call(this, arguments);

            // triggerMethod
            this.gridView.on('download:txn', this.onDownloadTxn);

            // 扩展UI
            this.ui.visibleRange = searchView.$el.find('select[name="visibleRange"]');
            this.ui.userId = searchView.$el.find('select[name="userId"]');
            this.ui.paymentMethod = searchView.$el.find('select[name="paymentMethod"]');
            this.ui.cycle = searchView.$el.find('select[name="selexDay"]');
            this.ui.tradStatus = searchView.$el.find('select[name="tradStatus"]');

            // 初始化“交易门店”组件
            this.renderVisibleRange(this.ui.visibleRange);
            this.renderUsers(this.ui.userId);
            this.renderPaymentMethod(this.ui.paymentMethod);
            this.renderCycle(this.ui.cycle);
            this.renderState(this.ui.tradStatus);
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
                        that.components.users = that.renderUsers(ui.userId);

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
                                key: 'name', // 查询关键词标识
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

        // 收款方式
        renderPaymentMethod: function($target) {
            buildUtil.buildSelect($target, 'txTypeSearchMap');
        },

        // 结算周期
        renderCycle: function($target) {
            buildUtil.buildSelect($target, 'cycleMap', '3');
        },

        // 交易状态
        renderState: function($target) {
            buildUtil.buildSelect($target, 'stateSearchMap', '5');
        },

        // 收银员列表
        renderUsers: function($target, params) {
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
    });

    var PrecisePageView = PageView.extend({

        //caption: '交易流水',

        searchTemplate: preciseTplFn(),

        grid: {
            caption: '查询结果',

            defaultRenderGrid: false,

            url: Ctx.url('groupMerchant.txn.precise'), // 远程请求地址

            toolbar: [
                {
                    name: 'downloadTxn',
                    btnCls: 'btn-link',
                    iconCls: 'icon-download',
                    text: '下载交易流水',
                    onClick: 'download:txn'
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
                    "lastPage": true,
                    "firstPage": true,
                    "totalPages": 0,
                    "totalElements": 0,
                    "numberOfElements": 0
                };

                var toolbarView = this.toolbarView;
                var $downloadTxnBtn = toolbarView.$el.find('button[name="downloadTxn"]');

                if(!_.isEmpty(resp)) {
                    // 设置汇总信息
                    var statDataMap = formatData.statDataMap;
                    statDataMap.total = resp.total||"";
                    statDataMap.totalAmt = resp.totalAmt||"";

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
                    $downloadTxnBtn.prop('disabled', false);
                } else {
                    $downloadTxnBtn.prop('disabled', true);
                }

                return formatData;
            },

            colNames: {
                txTime: '交易时间',
                traceNo: '流水号',
                type: '交易类型',
                state: '交易状态',
                acNo: '消费卡号',
                cycle: '结算周期',
                txAmt: '交易金额',
                mchtName: '商户名',
                snNo: '终端编号',
                fd37: '参考号'
            },

            colModel: [
                {
                    name: 'mchtName',
                    hidden: true,
                    viewable: true
                },
                {
                    name: 'snNo',
                    hidden: true,
                    viewable: true
                },
                {
                    name: 'txTime',
                    type: 'daterangepicker'
                    /*searchable: false,
                     searchOption: {
                     tips: "查询日期范围不能超过31天"
                     }*/
                },
                {
                    name: 'traceNo'
                },
                {
                    name: 'type',
                    formatter: formatUtil.txTypeFormatter
                },

                {
                    name: 'state',
                    formatter: formatUtil.stateFormatter
                },
                {
                    name: 'acNo'
                },
                {
                    name: 'cycle',
                    viewable: false,
                    formatter: formatUtil.cycleFormatter
                },
                {
                    name: 'txAmt',
                    formatter: formatUtil.amtFormatter
                },
                {
                    name: 'fd37',
                    hidden: true,
                    viewable: true
                }
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

        onDownloadTxn: function(gridContext, $target) {
            var downloadOptions = {
                $el: $target,
                caption: "下载交易流水",
                url: Ctx.url('groupMerchant.txn.download'),
                ajaxData: gridContext.parent.searchView.confView.getValues()
            };

            Opf.Util.download(downloadOptions);
        },

        onRender: function() {
            var _searchFn = SearchView.prototype.searchFn;
            var _events = SearchView.prototype.events;

            SearchView = SearchView.extend({
                events: _.extend({
                    'change input[name]': 'clearDanger',
                    'input input[name]': 'clearDanger'
                }, _events),

                clearDanger: function() {
                    this.$el.find('.bg-danger').remove();
                },

                searchFn: function() {
                    var errorElement = $('<div class="bg-danger" style="padding: 0.8em; margin: 0 15px 20px;"><span class="text-danger"><i class="icon-exclamation-sign"></i> 请至少输入一项搜索条件</span></div>');
                    var errorContainer = this.confView.$el.find('form');
                    var postData = this.confView.getValues();

                    if(_.isEmpty(_.values(postData).join(''))) {
                        errorContainer.find('.bg-danger').remove();
                        errorContainer.prepend(errorElement);
                    } else {
                        _searchFn.call(this, arguments);
                    }
                }
            });

            // 自定义searchView
            var searchView = this.searchView = new SearchView(
                {searchTemplate: this.searchTemplate},
                {context:this}
            );

            _onRender.call(this, arguments);

            // triggerMethod
            this.gridView.on('download:txn', this.onDownloadTxn);
        }
    });

    return Marionette.Layout.extend({
        className: 'container tab-view',

        template: tabTplFn,

        ui: {
            tabs: ".tabs a"
        },

        events: {
            'click @ui.tabs': 'doTabs'
        },

        regions: {
            searchListRegion: "#searchList",
            preciseListRegion: "#preciseList"
        },

        onRender: function() {
            this.searchListRegion.show(new SearchPageView);
            this.preciseListRegion.show(new PrecisePageView);
        },

        doTabs: function(e) {
            e.preventDefault();

            var $el = this.$el;
            var $target = $(e.currentTarget);
            var tabIdx = $target.closest('.tabs').children('li').index($target.parent());

            $target.parent().siblings('li').removeClass('active');
            $target.parent().addClass("active");

            $('.tab-panel', $el).removeClass('active');
            $('.tab-panel', $el).eq(tabIdx).addClass('active');
        }
    })
});