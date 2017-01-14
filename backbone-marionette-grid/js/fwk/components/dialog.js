/**
 * 模态弹窗
 */
define([
    'tpl!fwk/components/templates/dialog.tpl'
], function(dialogTpl){
    //dialog默认配置项
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    var dWidth = winWidth>480?480:(winWidth*0.8);
    var dHeight = winHeight>600?600:(winHeight*0.8);
    var dialog_defaults = {
        width: dWidth,
        height: dHeight,
        title: "标题",
        submit: true,
        formView: null
    };

    return Marionette.ItemView.extend({
        template: dialogTpl,
        className: 'ibx-dialog',
        ui: {
            dlgMask: '.dlg-mask',
            dlgContainer: '.dlg-container',
            dlgBody: '.dlg-body'
        },
        events: {
            'click .dlg-header>i.icon-remove': 'dlgDestroy',
            'click .form-reset': 'formReset',
            'click .btn-submit': 'formSubmit'
        },
        dlgClose: function(){
            this.$el.hide();
        },
        dlgDestroy: function(){
            this.$el.remove();
        },
        formReset: function(){
            try{
                this.formView.reset();
            } catch(e){
                console.log("请实现formView里面的reset方法");
            }
        },
        formSubmit: function(){
            try{
                var isValid = this.formView.validate();
                if(!isValid) return;
                var formValues = this.formView.getValues();
                this.dlgDestroy();
                this.trigger('submit', formValues);
            } catch(e){
                console.log("请实现formView里面的validate或者getValues方法");
            }
        },
        initialize: function(options){
            this.dlgOptions = _.extend({}, dialog_defaults, options);
        },
        serializeData: function(){
            return {
                dlgOptions: this.dlgOptions
            }
        },
        onRender: function(){
            var me = this, ui = me.ui;
            var formView = me.formView = me.dlgOptions.formView.render();
            var formEl = formView.$el;

            ui.dlgBody.append(formEl);
            $('body').append(me.$el);
        }
    })

});
