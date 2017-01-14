/*
******************** toolbar config *******************
toolbar: [
    // 单个自定义
    {
        name: 'delAll',
        btnCls: 'danger',
        iconCls: 'glyphicon-erase',
        text: '批量删除',
        onClick: function() {
            alert("批量删除");
        }
    },

    // 自定义分组
    [
        {
            name: 'upload',
            btnCls: 'danger',
            iconCls: 'glyphicon-upload',
            text: '上传',
            onClick: function() {
                var dialogView = new DialogView({});
            }
        },
        {
            name: 'download',
            btnCls: 'danger',
            iconCls: 'glyphicon-download',
            text: '下载',
            onClick: function() {
                console.log("toolbar custom clicked", this);
            }
        }
    ]
]*/

define([
    'tpl!app/group_merchant/common/components/toolbar/templates/toolbar.tpl'
],function(toolbarTplFn){
    var $oldListTpl;

    return Marionette.ItemView.extend({
        template: toolbarTplFn,

        className: 'components-toolbar',

        events: {
            'click button.btn': 'cBtnEvt'
        },

        cBtnEvt: function(evt) {
            var that = this,
                toolbar = that.toolbarOpts,
                toolbarConf = that.toolbarConf;

            var $target = $(evt.target),
                name = $target.attr('name'),
                toolbarItem = _.findWhere(toolbar, {name: name});

            // 针对分裂按钮做判断
            if(/dropdown-toggle/ig.test($target.attr('class')) && toolbarItem.items) {
                var dropdownMenu = $target.siblings('.dropdown-menu');
                dropdownMenu.off().on('click', function(e) {
                    if($(e.target).is('a')) {
                        if(_.isFunction(toolbarItem.onClick)) {
                            toolbarItem.onClick.call(toolbarConf.context||this, $(e.target));
                        } else {
                            toolbarConf.context.triggerMethod(toolbarItem.onClick, toolbarConf.context, $(e.target));
                        }
                    }
                });

                var ajaxItem = _.filter(toolbarItem.items, function(item) {
                    return _.isObject(item.ajax);
                })||[];

                // 请求下拉列表数据
                if(_.isObject(ajaxItem[0])) {
                    var ajaxObj = ajaxItem[0];
                    var _ajax = ajaxObj.ajax;
                    var _convertField = ajaxObj.convertField||{};

                    dropdownMenu.parent().off().on('show.bs.dropdown', function () {
                        var listTpl = '' +
                            '<% _.each(items, function(_item){ %>' +
                                '<li><a href="javascript:void(0);" data-value="<%= _item[convertField.value||\"value\"]%>"><%= _item[convertField.name||"name"]%></a></li>' +
                            '<% }); %>'
                            ;
                        var ajaxOpts = _.extend({
                            success: function (resp) { //Opf.Function.createSequence(
                                $oldListTpl && $oldListTpl.remove();

                                var $listTpl = $oldListTpl = $(_.template(listTpl)({items:resp, convertField:_convertField}));

                                dropdownMenu.prepend($listTpl);
                            }
                        }, _ajax);

                        Opf.ajax(ajaxOpts);
                    })
                }

            } else if(toolbarItem) {
                if(_.isFunction(toolbarItem.onClick)) {
                    toolbarItem.onClick.call(toolbarConf.context||this, $target);
                } else {
                    toolbarConf.context.triggerMethod(toolbarItem.onClick, toolbarConf.context||this, $target);
                }
            } else {}
        },

        initialize: function(toolbarOpts, toolbarConf) {
            this.toolbarOpts = toolbarOpts;
            this.toolbarConf = toolbarConf;

            this.render();
        },

        serializeData: function() {
            return {
                tplFn: this.template,
                toolbar: this.toolbarOpts,
                toolbarConf: this.toolbarConf
            }
        },

        onRender: function(){

        }
    })

});
