define([
    'tpl!app/group_merchant/common/components/grid/templates/view.tpl',
    'app/group_merchant/common/components/grid/stat/view',
    'app/group_merchant/common/components/grid/header',
    'app/group_merchant/common/components/grid/list',
    'app/group_merchant/common/components/grid/pager',
    'app/group_merchant/common/components/dialog/view',
    'app/group_merchant/common/components/toolbar/view'
],function(gridTplFn, GridStatView, GridHeaderView, GridListView, GridPagerView, DialogView, GridToolbarView){
    //对查询数据中文编码
    var jsonEncode = function(rule) {
        _.each(rule, function(v, k) {
            rule[k] = _.isString(v)? encodeURIComponent(v) : v;
        });

        return rule;
    };

    return Marionette.ItemView.extend({
        template: gridTplFn,

        className: 'grid-panel',

        ui: {
            table: 'table',
            thead: 'table>thead',
            tbody: 'table>tbody',
            tfoot: 'table>tfoot',

            gridStat: '.grid-stat'
        },

        initialize: function(options, viewConf) {
            var that = this;
            var colModel = options.colModel;

            viewConf = viewConf||{};

            // 重置默认值
            _.each(colModel, function(v) {
                // addable:true
                if(v.addable !== false) {
                    v.addable = true;
                }

                // editable:true
                if(v.editable !== false) {
                    v.editable = true;
                }

                // viewable:true
                if(v.viewable !== false) {
                    v.viewable = true;
                }
            });

            _.isUndefined(options.defaultRenderGrid) && (options.defaultRenderGrid = true);

            this.options = options;
            this.parent = viewConf.context;

            // toolbar 默认按钮
            /*this.TOOLBAR_DEFAULT_MAP = [
                {
                    name: 'add',
                    text: '新增',
                    onClick: function() {
                        // var that = this; // toolbar view
                        var dialogView = that.dialogView = new DialogView({
                            dialogConf: {
                                title: '新增记录',
                                type: 'add'
                            },
                            contentConf: that.options
                        });

                        dialogView.on('grid:add', function(options) {
                            var $target = options.$target;
                            var values = options.values;
                            var ajaxOptions = {
                                url: that.options.url,
                                type: 'POST',
                                dataType: 'json',
                                contentType: 'application/json',
                                data: _.isObject(values)? JSON.stringify(values):values,
                                beforeSend: function() {
                                    $target.prop('disabled', true);
                                },
                                complete: function() {
                                    $target.prop('disabled', false);
                                },
                                success: function() {
                                    dialogView.$el.modal('hide');
                                    that.reloadGrid();
                                }
                            };

                            $.ajax(ajaxOptions);
                        });
                    }
                },
                {
                    name: 'search',
                    text: '搜索',
                    onClick: function() {
                        var dialogView = that.dialogView = new DialogView({
                            dialogConf: {
                                title: '查询记录',
                                type: 'search'
                            },
                            contentConf: that.options
                        });

                        dialogView.on('grid:search', function(options) {
                            that.reloadGrid(options.values);
                        });
                    }
                },
                {
                    name: 'refresh',
                    text: '刷新',
                    onClick: function() {
                        that.reloadGrid({reset: true});
                    }
                }
            ];*/

            // 表格行默认按钮
            this.GRID_DEFAULT_MAP = [
                {
                    name: 'edit',
                    text: '修改',
                    onClick: function(rowData, $el) {
                        var dialogView = that.dialogView = new DialogView({
                            dialogConf: {
                                title: '修改信息',
                                type: 'edit'
                            },
                            contentConf: _.extend({}, that.options, {url: that.options.url + '/' + rowData.id}),
                            initData: rowData
                        }, _.bind(that.reloadGrid, that));
                    }
                },
                {
                    name: 'del',
                    text: '删除',
                    onClick: function(rowData, $el) {
                        var dialogView = that.dialogView = new DialogView({
                            dialogConf: {
                                title: '删除记录',
                                type: 'del',
                                modalType: 'sm'
                            },
                            contentConf: '<p>你确定要删除这条记录吗？</p>'
                        });

                        dialogView.on('grid:del', function(submitOpts) {
                            var $target = submitOpts.$target;
                            var url = that.options.url + '/' + rowData.id;

                            var ajaxOptions = {
                                url: url,
                                type: 'DELETE',
                                beforeSend: function() {
                                    $target.prop('disabled', true);
                                },
                                complete: function() {
                                    $target.prop('disabled', false);
                                },
                                success: function() {
                                    that.reloadGrid();
                                }
                            };

                            $.ajax(ajaxOptions);
                        });
                    }
                },
                {
                    name: 'view',
                    text: '详情',
                    onClick: function(rowData) {
                        var dialogView = new DialogView({
                            dialogConf: {
                                title: '查看详情',
                                type: 'view',
                                modalType: 'md'
                            },
                            contentConf: that.options,
                            initData: rowData
                        });
                    }
                }
            ];

            this.render();
        },

        serializeData: function() {
            return {
                gridOptions: this.options
            }
        },

        onRender: function(){
            var gridOptions = this.options || {};

            gridOptions.defaultRenderGrid && this.renderGrid(gridOptions);
        },

        renderGrid: function() {
            // 初始化视图
            this.doRender();
        },

        renderToolbar: function() {
            var that = this,
                opts = that.options;

            /*_.each(that.TOOLBAR_DEFAULT_MAP, function(item) {
                 var toolbar = _.flatten(opts.toolbar);
                 var toolbarItem = _.findWhere(toolbar, {name: item.name});

                if(toolbarItem && !_.isFunction(toolbarItem.onClick)) {
                    toolbarItem.onClick = item.onClick;
                }
            });*/

            var toolbarView = this.toolbarView = new GridToolbarView(opts.toolbar, {pageable:false, context:that});

            _.defer(function() {
                that.$el.find('.widget-header>div').append(toolbarView.$el);
            });
        },

        renderGridHeader: function() {
            var that = this,
                ui = that.ui,
                opts = that.options;

            //扩展action列
            if(opts.colAction !== false) {
                _.extend(opts.colNames, {
                    action: '操作'
                });
            }

            var headerView = that.headerView = new GridHeaderView(opts, {context:this});

            headerView.on('grid:checked', function() {
                that.listView.triggerMethod('check:all');
            });

            headerView.on('grid:unchecked', function() {
                that.listView.triggerMethod('uncheck:all');
            });

            ui.thead.empty().append(headerView.$el);
        },

        renderStatDataMap: function(statDataMap) {
            var that = this,
                ui = that.ui,
                statView;

            ui.gridStat.empty();

            if(!_.isEmpty(statDataMap)) {
                statView = new GridStatView({statDataMap: statDataMap});
                ui.gridStat.append(statView.$el);
            }
        },

        doRender: function(pages){
            var that = this,
                ui = that.ui,
                opts = that.options;

            var defaultParams = {
                number: 0,
                size: 10
            };

            var gridParams = ui.table.data('gridParams');

            var postData = _.extend({}, defaultParams, gridParams, pages);

            var ajaxOptions = {
                type: 'GET',
                dataType: 'json',
                url: opts.url,
                data: jsonEncode(postData), //pages||gridParams||null,
                beforeSend: function(){
                    Opf.UI.setLoading(that.$el, true);
                },
                success: function (rsp) {
                    // 添加数据拦截器
                    // 对不符合格式要求的数据进行转换
                    if(opts && _.isFunction(opts.gridComplete)) {
                        rsp = opts.gridComplete.call(that, rsp||{});
                    }

                    if(rsp && rsp.content){
                        var pageOptions = {
                            firstPage: rsp.firstPage,
                            lastPage: rsp.lastPage,
                            number: rsp.number,
                            numberOfElements: rsp.numberOfElements,
                            size: rsp.size,
                            totalElements: rsp.totalElements,
                            totalPages: rsp.totalPages
                        };
                        that.parseRecords(rsp.content);
                        that.parsePages(pageOptions);

                        // 缓存本次请求数据
                        that.data = {
                            pages: pageOptions,
                            content: rsp.content
                        };
                    }

                    // 生成汇总信息
                    if(rsp && rsp.statDataMap) {
                        that.renderStatDataMap(rsp.statDataMap);
                    }
                },
                complete: function(){
                    Opf.UI.setLoading(that.$el, false);
                    that.dialogView && that.dialogView.$el.modal('hide');
                }
            };

            $.ajax(ajaxOptions);

            // 生成表头
            this.renderGridHeader();

            // 生成工具条
            opts.toolbar && !this.toolbarView && this.renderToolbar();

        },

        parseRecords: function(data){
            var that = this,
                opts = that.options,
                colAction = opts.colAction||[];

            if(opts.colAction !== false) {
                _.each(that.GRID_DEFAULT_MAP, function(item) {
                    var _colActionItem = _.findWhere(colAction, {name: item.name});

                    if(_colActionItem) {
                        if(!_.isFunction(_colActionItem.onClick)) {
                            _colActionItem.onClick = item.onClick;
                        }
                    } else {
                        colAction.push(item);
                    }
                });
            }

            var listView = that.listView = new GridListView(_.extend({}, opts, {
                data: data,
                colAction: colAction
            }), {context:that});

            this.$el.find('tbody').remove();
            this.$el.find('thead').after(listView.$el);
        },

        parsePages: function(data){
            var me = this;
            var view = new GridPagerView({data:data});
            var pageContext = this.$el.find("tfoot").empty().append(view.doRender());

            $("a.btn", pageContext).on('click', function(){
                if(!$(this).hasClass('disabled')) {
                    me.doRender({number:$(this).attr("data-number")});
                }
            });
        },

        /**
         * 获取当前页的数据记录
         */
        getRecords: function() {
            var that = this;

            //var records = $el.find('table>tbody').data('records');

            return that.data.content;
        },

        /**
         * 获取当前页选取的数据
         */
        getChecked: function() {
            return this.listView.getChecked();
        },

        /**
         * 刷新表格
         */
        reloadGrid: function(params, options) {
            var that = this,
                ui = that.ui,
                $table = ui.table;

            // reload表格前重置上一次的查询条件
            if(_.isObject(options)) {
                if(options.reset) {
                    $table.removeData('gridParams');
                }
            }

            var gridParams = $table.data('gridParams');

            // 给表格设置查询条件并记住
            if(gridParams) {
                _.extend(gridParams, params);
            } else {
                ui.table.data('gridParams', params);
            }

            this.doRender();
        }
    })

});
