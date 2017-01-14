/**
 * Created by hefeng on 2016/2/27.
 */
define([
    'app/group_merchant/common/components/config/view',
    'tpl!app/group_merchant/common/components/dialog/templates/dialog.tpl'
], function(ConfView, dialogTplFn) {

    return Marionette.ItemView.extend({
        template: dialogTplFn,

        className: 'modal fade',

        ui: {
            modalBody: '.modal-body',
            btnFormSubmit: 'button[name="formSubmit"]'
        },

        events: {
            'click @ui.btnFormSubmit': 'formSubmitFn'
        },

        formSubmitFn: function(evt) {
            var that = this,
                ui = that.ui,
                options = that.options,
                gridOptions = options.contentConf,
                dialogConf = options.dialogConf,
                type = dialogConf.type,
                values = this.confView.getValues();

            console.log("submit data:", values);

            var ajaxOptions = {
                url: gridOptions.url,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: _.isObject(values)? JSON.stringify(values):values,
                beforeSend: function() {
                    ui.btnFormSubmit.prop('disabled', true);
                },
                complete: function() {
                    ui.btnFormSubmit.prop('disabled', false);
                },
                success: function() {
                    that.$el.modal('hide');
                    that.callback && that.callback();
                }
            };

            switch(type) {
                case 'add':
                    if(that.confView.triggerMethod('before:submit')) {
                        $.ajax(_.extend({}, ajaxOptions, {
                            type: 'POST'
                        }));
                    }
                    break;
                case 'edit':
                    if(that.confView.triggerMethod('before:submit')) {
                        $.ajax(_.extend({}, ajaxOptions, {
                            type: 'PUT'
                        }));
                    }
                    break;
                case 'del':
                    this.trigger('grid:del', {$target: ui.btnFormSubmit});
                    break;
                case 'search': //精准搜索
                    if(that.confView.triggerMethod('before:submit')) {
                        var postData = _.isObject(values)? values:JSON.parse(values);
                        this.triggerMethod('grid:search', postData);
                    }
                    break;
                case 'custom':
                case 'default':
                    if(that.confView.triggerMethod('before:submit')) {
                        var customOption = dialogConf.customOption;
                        $.ajax(_.extend({}, ajaxOptions, customOption));
                    }
                    break;
            }

            return false; // 阻止浏览器的默认行为

            //this.trigger('grid:add', {$target: $target, values: values});
            //this.trigger('grid:edit', {$target: $target, values: values});
            //this.trigger('grid:search', {$target: $target, values: values});
        },

        initialize: function(options, callback) {
            this.options = options;
            this.dialogConf = options.dialogConf||{};
            this.parent = options.dialogConf && options.dialogConf.context;
            this.callback = callback;
            this.render();
        },

        serializeData: function() {
            return {
                dialogConf: this.options.dialogConf
            }
        },

        onRender: function() {
            // 初始化dialog
            var dialogConf = _.extend({}, this.options.dialogConf||{});
            var $dialog = this.dialog = this.$el.appendTo('body').modal(dialogConf);

            // 关闭对话框即销毁
            $dialog.on('hidden.bs.modal', function() {
                $(this).remove();
            });

            console.log("this.options.initData", this.options.initData);

            // 填充配置项
            var confView = this.confView = new ConfView({
                showType: dialogConf.type||"edit",
                contentConf: this.options.contentConf,
                initData: this.options.initData
            });
            this.ui.modalBody.append(confView.$el);
        },

        onFormSubmit: function() {
            console.log("onFormSubmit.");
        },

        onGridSearch: function(postData) {
            var that = this,
                parent = that.parent;

            that.dialog.on('hidden.bs.modal', function() {
                parent.gridView.reloadGrid(postData);
            });

            that.dialog.modal('hide');
        }
    })
});
