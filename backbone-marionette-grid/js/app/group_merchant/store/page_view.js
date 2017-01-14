/**
 * User hefeng
 * Date 2016/5/9
 */

/**
 * gridOptions <Object>
 * caption: '查询结果', // 表格title
 * url: Ctx.url('groupMerchant.users.list'), // 远程请求地址
 * toolbar <Array> 格式支持[], {}  //toolbar支持的配置项格式
 * toolbar - item
 * {
        type: 'custom',
        name: 'delAll',
        btnCls: 'danger',
        iconCls: 'glyphicon-erase',
        text: '批量删除',
        onClick: function() {
            alert("批量删除");
        }
    }
 * colNames <Object>
 * colModel <Object>
 */

define([
    //'app/group_merchant/store/search_view',
    'tpl!app/group_merchant/store/templates/tab.tpl',
    'app/group_merchant/common/components/page/view',
    'app/group_merchant/common/components/search/view',
    'tpl!app/group_merchant/store/templates/search.tpl'
], function(tabTplFn, PageView, SearchView, searchTplFn) {
    // Utils
    var formatUtil = Opf.Util.Format;
    var buildUtil = Opf.Util.Build;
    var CommonUI = Opf.Util.CommonUI;

    // 原型方法
    var _onRender = PageView.prototype.onRender;

    var storePageView = PageView.extend({
        // 页面标题
        //caption: '门店管理',

        searchTemplate: searchTplFn(),

        grid: {
            caption: '查询结果',

            defaultRenderGrid: false,

            url: Ctx.url('groupMerchant.store.list'), // 远程请求地址

            colNames: {
                loginName: '管理员',
                groupName: '门店分组',
                mchtName: '门店名称',
                mchtStatus: '状态'
            },

            colModel: [
                { name: 'loginName' },
                { name: 'groupName' },
                { name: 'mchtName' },
                {
                    name: 'mchtStatus',
                    formatter: formatUtil.mchtStatusFormatter
                }
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
                    text: '修改管理员密码',
                    name: 'changeAdminPwd',
                    onClick: function(rowData, $el) {
                        require(['app/group_merchant/common/components/dialog/view'], function(DialogView) {
                            var dlgTpl = '';

                            /*用户账号*/
                            dlgTpl += '<form name="gridForm_edit" class="component-dialog-container form-horizontal" novalidate="novalidate">';
                            dlgTpl += '<div class="form-group">';
                            dlgTpl += '<label class="control-label col-sm-2 col-lg-2">账号</label>';
                            dlgTpl += '<div class="col-sm-6 col-lg-6"> ';
                            dlgTpl += '<p class="form-control-static"><%= loginName%></p>';
                            dlgTpl += '</div>';
                            dlgTpl += '</div>';

                            /*修改密码*/
                            dlgTpl += '<div class="form-group">';
                            dlgTpl += '<label for="pwd" class="control-label col-sm-2 col-lg-2">密码</label>';
                            dlgTpl += '<div class="col-sm-6 col-lg-6"> ';
                            dlgTpl += '<input id="pwd" class="form-control components_password" type="text" name="pwd" data-type="password">';
                            dlgTpl += '<i class="icon-lock img-datepicker"></i>';
                            dlgTpl += '</div>';
                            dlgTpl += '</div>';
                            dlgTpl += '</form>';

                            var dlgView = new DialogView({
                                dialogConf: {
                                    title: '修改管理员密码',
                                    modalType: 'md',
                                    type: 'custom',
                                    customOption: {
                                        type: 'PUT',
                                        url: Ctx.url('groupMerchant.store.list', {id:rowData.userId})
                                    }
                                },
                                contentConf: _.template(dlgTpl)(rowData)
                            });
                        })
                    }
                }
            ],

            /**
             * edit/del/view 值为false则不显示该按钮
             * canRender: function(name){ <this> 行数据 } 可以根据行数据判断name="changeState"的按钮是否显示
             */
            colActionConf: {
                canRender: function(name, rowData) {
                    var flag = true;

                    if(name == "del" || name == "view" || name == "edit") {
                        flag = false;
                    }

                    if(name == "changeAdminPwd" &&
                        rowData.userStatus != "0" ||
                        rowData.mchtStatus != "0"
                    ) {
                        flag = false;
                    }

                    return flag;
                }
            }
        },

        onRender: function() {
            // 自定义searchView
            this.searchView = new SearchView(
                {searchTemplate: this.searchTemplate},
                {context:this}
            );
            _onRender.apply(this, arguments);

            // 扩展UI
            var groupId = this.ui.groupId = this.$el.find('select[name="groupId"]');
            var address = this.ui.address = this.$el.find('select[name="address"]');

            // 渲染组件
            this.renderGroupInfo(groupId);
        },

        renderGroupInfo: function($target) {
            var groupInfoSel = buildUtil.buildAjaxSelect($target, {
                convertField: {
                    name: 'groupName',
                    value: 'groupId'
                },
                ajax: {
                    url: Ctx.url('groupMerchant.search.groups'),
                    success: function() {
                        groupInfoSel.$el.prepend('<option value="0" selected="selected">不筛选</option>');
                    }
                }
            });

            return groupInfoSel;
        }
    });

    var groupPageView = PageView.extend({
        // 页面标题
        //caption: '门店管理',

        searchTemplate: searchTplFn(),

        grid: {
            caption: '查询结果',

            defaultRenderGrid: false,

            url: Ctx.url('groupMerchant.storeGroup.list'), // 远程请求地址

            toolbar: [
                {
                    name: 'groupBy',
                    btnCls: 'btn-primary',
                    iconCls: 'icon-level-down',
                    text: '分组到',
                    items: [
                        {
                            ajax: {
                                url: Ctx.url('groupMerchant.search.groups')
                            },
                            convertField: {
                                name: 'groupName',
                                value: 'groupId'
                            }
                        },
                        "-",
                        { name: '<i class="icon-plus text-primary"></i> 新增分组' }
                    ],
                    onClick: function($target) {
                        var that = this, // gridView
                            parent = that.parent; // pageView

                        if($.trim($target.text()) == "新增分组") {
                            require(['app/group_merchant/common/components/dialog/view'], function(DialogView) {
                                var dlgTpl = '';

                                /*用户账号*/
                                dlgTpl += '<form name="gridForm_edit" class="component-dialog-container form-horizontal" novalidate="novalidate">';
                                dlgTpl += '<div class="form-group">';
                                dlgTpl += '<label class="control-label col-sm-3 col-lg-3">分组名称</label>';
                                dlgTpl += '<div class="col-sm-6 col-lg-6"> ';
                                dlgTpl += '<input name="groupName" class="form-control">';
                                dlgTpl += '</div>';
                                dlgTpl += '</div>';

                                /*修改密码*/
                                dlgTpl += '<div class="form-group">';
                                dlgTpl += '<label class="control-label col-sm-3 col-lg-3">分组描述</label>';
                                dlgTpl += '<div class="col-sm-6 col-lg-6"> ';
                                dlgTpl += '<textarea class="form-control" name="remark" rows="5"></textarea>';
                                dlgTpl += '</div>';
                                dlgTpl += '</div>';
                                dlgTpl += '</form>';

                                var dlgView = new DialogView({
                                    dialogConf: {
                                        title: '新增分组',
                                        modalType: 'md',
                                        type: 'custom',
                                        customOption: {
                                            type: 'POST',
                                            url: Ctx.url('groupMerchant.store.list')
                                        }
                                    },
                                    contentConf: dlgTpl
                                }, function() {
                                    var ui = parent.ui;

                                    parent.renderGroupInfo(ui.groupId);
                                });

                                dlgView.$el.find("form").validate({
                                    rules: {
                                        groupName: {
                                            required: true
                                        }
                                    }
                                });
                            })

                        } else {
                            // 开始分组
                            var mchtNoList = [],
                                checkedRows = this.getChecked()||[];

                            if(checkedRows.length<1) {
                                Opf.alert("请先勾选待分组门店");
                                return;
                            }

                            _.each(checkedRows, function(row) {
                                mchtNoList.push(row.mchtNo);
                            });

                            Opf.UI.setLoading(that.toolbarView.$el, true);
                            Opf.ajax({
                                type: 'POST',
                                url: Ctx.url('groupMerchant.store.groups'),
                                jsonData: { groupId:$target.attr('data-value'), mchtNo:mchtNoList.join(',') },
                                success: function(resp) {
                                    that.reloadGrid();
                                },
                                complete: function() {
                                    Opf.UI.setLoading(that.toolbarView.$el, false);
                                }
                            });
                        }

                    }
                },{
                    name: 'moveTo',
                    btnCls: 'btn-default',
                    iconCls: 'icon-level-up',
                    text: '移出分组',
                    onClick: function($target) {
                        // 开始分组
                        var that = this,
                            mchtIdList = [],
                            checkedRows = this.getChecked()||[];

                        if(checkedRows.length<1) {
                            Opf.alert("请先勾选待分组门店");
                            return;
                        }

                        _.each(checkedRows, function(row) {
                            mchtIdList.push(row.id);
                        });

                        Opf.UI.setLoading(that.toolbarView.$el, true);
                        Opf.ajax({
                            type: 'DELETE',
                            url: Ctx.url('groupMerchant.store.list', {id:mchtIdList.join(',')}),
                            success: function(resp) {
                                that.reloadGrid();
                            },
                            complete: function() {
                                Opf.UI.setLoading(that.toolbarView.$el, false);
                            }
                        });
                    }
                }
            ],

            colNames: {
                mchtName: '门店名称',
                groupName: '门店分组'
            },

            colModel: [
                {
                    checkable: true
                    /*onClick: function(row, $target) {
                        //this.gridView.getChecked();
                    }*/
                },
                { name: 'mchtName' },
                { name: 'groupName' }
            ],

            /**
             * [{
                 *  text: '更改状态',
                 *  name: 'changeState',
                 *  onClick: function() {} //回调
                 * }]
             */
            colAction: false,

            /**
             * edit/del/view 值为false则不显示该按钮
             * canRender: function(name){ <this> 行数据 } 可以根据行数据判断name="changeState"的按钮是否显示
             */
            colActionConf: {
                canRender: function(name, rowData) {
                    return !(name == "del" || name == "view" || name == "edit");
                }
            }
        },

        onRender: function() {
            // 自定义searchView
            this.searchView = new SearchView(
                {searchTemplate: this.searchTemplate},
                {context:this}
            );
            _onRender.apply(this, arguments);

            // 扩展UI
            var groupId = this.ui.groupId = this.$el.find('select[name="groupId"]');

            // 渲染组件
            this.renderGroupInfo(groupId);
        },

        renderGroupInfo: function($target) {
            var groupInfoSel = buildUtil.buildAjaxSelect($target, {
                convertField: {
                    name: 'groupName',
                    value: 'groupId'
                },
                ajax: {
                    url: Ctx.url('groupMerchant.search.groups'),
                    success: function() {
                        groupInfoSel.$el.prepend('<option value="0" selected="selected">不筛选</option>');
                    }
                }
            });

            return groupInfoSel;
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
            storeListRegion: "#storeList",
            storeGroupsRegion: "#storeGroups"
        },

        onRender: function() {
            this.storeListRegion.show(new storePageView);
            this.storeGroupsRegion.show(new groupPageView);
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