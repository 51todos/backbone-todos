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
        buttonCls: 'danger',
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
    'app/group_merchant/common/components/page/view',
    'app/group_merchant/common/components/search/view',
    'tpl!app/group_merchant/users/templates/search.tpl'
], function(PageView, SearchView, searchTplFn) {
    // Utils
    var formatUtil = Opf.Util.Format;
    var buildUtil = Opf.Util.Build;

    // SearchView
    var _onRender = PageView.prototype.onRender;

    return PageView.extend({
        caption: '员工管理',

        searchTemplate: searchTplFn(),

        toolbar: [
            {
                name: 'addUser',
                btnCls: 'btn-success',
                iconCls: 'icon-plus-sign',
                text: '新增员工账号',
                onClick: 'add:user'
            }
        ],

        grid: {
            caption: '查询结果',

            defaultRenderGrid: false,

            url: Ctx.url('groupMerchant.users.list'), // 远程请求地址

            colNames: {
                mchtName: '门店名称',
                userName: '员工姓名',
                userLogin: '登录账号',
                pwd: '登录密码',
                userPrimary: '角色权限',
                userPhone: '手机号码',
                userStatus: '状态'
            },

            colModel: [
                {
                    name: 'mchtName',
                    hidden: Ctx.isStore(),
                    editable: Ctx.isBrand()
                },
                {
                    name: 'userName',
                    type: 'text',
                    searchable: true,
                    editable: false
                },
                {
                    name: 'pwd',
                    type: 'password',
                    hidden: true
                },
                {
                    name: 'userLogin',
                    type: 'text',
                    editable: false,
                    editOption: {
                        tips: '建议使用姓名拼音'
                    }
                },
                {
                    name: 'userPrimary',
                    type: 'select',
                    formatter: formatUtil.userPrimaryFormatter
                },
                {
                    name: 'userPhone',
                    type: 'text',
                    searchable: true,
                    editOption: {
                        tips: ''
                    }
                },
                {
                    name: 'userStatus',
                    type: 'select',
                    formatter: formatUtil.userStatusFormatter
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
                    text: '修改',
                    name: 'edit',
                    onClick: function(row, $target) {
                        var that = this, // listView
                            gridView = that.parent, // gridView
                            pageView = gridView.parent, // pageView
                            $pageEl = pageView.$el;

                        $pageEl.hide();

                        require(['app/group_merchant/users/edit_view'], function(EditView) {
                            var editView = new EditView({ data:row });

                            editView.render();
                            editView.on('close', function(flag) {
                                $pageEl.show();
                                flag===true && gridView.reloadGrid();
                            });

                            $pageEl.after(editView.$el);
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

                    if(name == "del" || name == "view") {
                        flag = false;
                    }

                    if(name == "edit") {
                        // 注销状态
                        if(rowData.userStatus == "2") {
                            flag = false;
                        } else {
                            if(rowData.userPrimary == "1" && rowData.userStatus == "1") {
                                flag = false;
                            }
                        }
                    }

                    return flag;
                }
            }
        },

        onRender: function() {
            // 自定义searchView
            var searchView = this.searchView = new SearchView(
                {searchTemplate: this.searchTemplate},
                {context:this}
            );

            _onRender.call(this, arguments);

            // 扩展UI
            this.ui.visibleRange = searchView.$el.find('select[name="visibleRange"]');

            // 初始化“交易门店”组件
            this.renderVisibleRange(this.ui.visibleRange);
        },

        renderVisibleRange: function($target) {
            var that = this, ui = that.ui;

            buildUtil.buildSelect($target, 'visibleMap4user');

            $target.on('change', function() {
                var $self = $(this);

                switch($self.val()) {
                    // 不筛选
                    case "0":
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
        },

        /**
         * triggerMethod: add:user
         */
        onAddUser: function() {
            var that = this,
                $pageEl = that.$el;

            $pageEl.hide();

            require(['app/group_merchant/users/add_view'], function(AddView) {
                var addView = new AddView();

                addView.render();
                addView.on('close', function(flag) {
                    $pageEl.show();
                    flag===true && that.gridView.reloadGrid();
                });

                $pageEl.after(addView.$el);
            });
        }

        /*,
        searchUserFn: function() {
            var self = this,
                searchView = self.searchView;

            var postData = searchView.confView.getValues();

            self.gridView.reloadGrid(postData);
        }*/
    })
});