/**
 * Created by hefeng on 2016/1/26.
 * 公共下载组件
 */
define([
    'tpl!fwk/components/templates/downloadTask.tpl',
    'app/view/PollingTask'
], function(tpl, PollingTask){

    /**
     * 检测当前操作系统能否支持浏览器下载（ios不支持），并弹出提示信息
     * @return {Boolean} 能支持则返回true
     */
    var checkDownloadEvnAvailWithMsg = function () {
        if(Opf.Bowser.ios) {
            Opf.alert({title: '抱歉',
                message: '您使用的是苹果IOS系统，该系统未开放文件下载功能！'
            });
            return false;
        }
        return true;
    };

    var DownloadTaskView = Marionette.ItemView.extend({
        template: tpl,
        className: 'component-download-task',

        ui: {
            downloadBtn: 'button[name^=download-]'
        },

        events: {
            'click button.btn-download': 'onDownloadClickVendor'
        },

        onDownloadClickVendor: function (e) {
            if(!checkDownloadEvnAvailWithMsg()) {return;}
            var me = this,
                //$trigger = $(e.target),
                downloadType = me.options.type||'excel';

            /*if ($trigger.attr('id') === "txt-dl") {
                //me.popDateSelectDialog(options);
                Opf.alert("txt类型的下载正在开发中...");
            }*/

            me.trigger('download.'+downloadType, me.options);
        },

        popDateSelectDialog: function(options){

            var $tplHtml = $([
                    '<form calss="select-txt-download-date">',
                    '<div class="select-date-wraper">',
                    '<input type="text" class="txt-download-date" readonly>',
                    '<input type="reset" class="reset" value="重置">',
                    '<input type="submit" class="submit" value="提交">',
                    '</div>',
                    '</form>'
                ].join('')),
                $overlay = $('<div class="ui-widget-overlay xui-front"></div>'),
                me = this;
            $tplHtml.find('.txt-download-date').datepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                orientation: 'top auto',
                todayHighlight: true
            });

            $tplHtml.dialog({
                title: "请选择下载对账单的日期：",
                width: 360,
                autoOpen: true,
                // modal: true,  // IE9 IE8 下结合 bootstrap datepicker 使用会有BUG， 原因在于 datepicker 的选择日期控制 在 ui-dialog 之外
                draggable: false,
                resizable: false,
                create: function () {
                    var $dialog = $(this).closest('.ui-dialog').addClass('txt-download-date-dialog');
                    $dialog.find('.ui-dialog-titlebar-close').addClass('icon-remove');
                    $(this).on('submit', function(event){
                        var e = $.event.fix(event),
                            regExp = /^\d{4}-\d{2}-\d{2}$/g;
                        if (regExp.test($dialog.find('.txt-download-date').val())) {
                            options.startDate = options.endDate = $tplHtml.find('.txt-download-date').val().split('-').join('');
                            me.trigger('download.txt', options);
                            $(this).dialog('destroy');
                            $overlay.remove();
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    });
                },
                open: function(){

                    var $dialog = $(this).closest('.ui-dialog');
                    $dialog.before($overlay);
                    $dialog.outerWidth(_.min([$dialog.outerWidth(),$(window).width()]));
                },
                close: function(event, ui) {
                    $(this).dialog('destroy');
                    $overlay.remove();
                }
            });

        },

        initialize: function(options){
            this.options = options||{};
        },

        serializeData: function(){
            return {
                data: this.options
            }
        },

        onRender: function(){
            //TODO
        }
    });

    var download = {
        request: function(downloadTaskView){
            downloadTaskView.ui.downloadBtn.append('<span class="loading">...</span>').prop('disabled', true);
        },
        complete: function(downloadTaskView){
            downloadTaskView.ui.downloadBtn.find('span.loading').remove().prop('disabled', false);
        }
    };

    return {
        init: function(options){
            var downloadTaskView = new DownloadTaskView(options);

            /**
             * 下载Excel task
             * @url  Excel下载地址
             * @type task下载类型
             * @caption 任务名称
             */
            downloadTaskView.on('download.excel', function (params) {
                //获取ID，识别某次轮询
                var tid = Ctx.getUUID();
                Opf.ajax({
                    url: Ctx.url('bill.gen.report', {startDate: params.targetView.startDate, endDate: params.targetView.endDate}),
                    type: 'GET', data: { tid: tid, type: params.type },
                    beforeSend: function(){
                        download.request(downloadTaskView);
                    },
                    success: function (resp) {
                        //采用轮询方式重写 下载 excel的部分 zhuyimin
                        if(resp.success !== false){
                            var dlUrl = resp.data || resp.url;
                            //如果返回的数据中有下载url，则直接下载
                            if(dlUrl){
                                Opf.download(dlUrl);
                                download.complete(downloadTaskView);
                            }
                            //否则轮询
                            else {
                                var reportQueueTask = new PollingTask({
                                    name: params.caption //不要写死这个字段，还要加上筛选日期
                                });

                                App.TaskQueueMgr.addTask(reportQueueTask);

                                Opf.Polling.addCallback({
                                    tid: tid,
                                    fn: function(obj){
                                        reportQueueTask.updateByResponse(obj);
                                        if(obj.data){
                                            download.complete(downloadTaskView);
                                        }
                                    }
                                });
                            }
                        }
                    },
                    complete: function () {}
                });
            });

            /**
             * 下载TXT task
             * 开发中...
             */
            downloadTaskView.on('download.txt', function (options) {
                view.triggerMethod('download:request');
                Opf.ajax({
                    url: Ctx.url('bill.gen.report', {startDate: options.startDate, endDate: options.endDate}) + '?type=txt',
                    success: function (resp) {
                        Opf.download('api/open-user/settle-bill/' + resp.data);
                    },
                    complete: function () {
                        view.triggerMethod('download:request:complete');
                    }
                });
            });

            /*downloadTaskView.on('download.dateSettle', function (options) {
                //获取ID，识别某次轮询
                var tid = Ctx.getUUID();
                Opf.ajax({
                    url: Ctx.url('bill.gen.report', {startDate: options.startDate, endDate: options.endDate}),
                    data: {
                        type: '',
                        tid: tid
                    },
                    success: function (resp) {
                        //采用轮询方式重写 下载 excel的部分 zhuyimin
                        if(resp.success !== false){
                            var dlUrl = resp.data || resp.url;
                            //如果返回的数据中有下载url，则直接下载
                            if(dlUrl){
                                Opf.download(dlUrl);
                                view.triggerMethod('download:request:complete');
                            }
                            //否则轮询
                            else {
                                var reportQueueTask = new PollingTask({
                                    name: '日结对账单' //TODO 不要写死这个字段，还要加上筛选日期
                                });

                                App.TaskQueueMgr.addTask(reportQueueTask);

                                Opf.Polling.addCallback({
                                    tid: tid,
                                    fn: function(obj){
                                        reportQueueTask.updateByResponse(obj);
                                        if(obj.data){
                                            view.triggerMethod('download:request:complete');
                                        }
                                    }
                                });
                            }
                        }
                    },
                    complete: function () {
                    }
                });
            });*/

            return downloadTaskView;
        }
    }
});
