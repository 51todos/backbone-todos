/**
 * Created by hefeng on 2016/3/2.
 */
define([
    'fwk/components/ajax-select',
    'app/view/PollingTask',
    'app/group_merchant/common/components/utils',
    'underscore', 'marionette'
], function(AjaxSelect, PollingTask, groupMerchantUtils) {
    var MAP = groupMerchantUtils.MAP;

    return _.extend({
        // 对Date的扩展，将 Date 转化为指定格式的String
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
        // 例子：
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
        dateFormat: function (val, fmt) {
            // 如果val无效则返回空字符串
            if(!val) {
                return "";
            }

            var date = new Date(val);

            var o = {
                "M+": date.getMonth() + 1,                 //月份
                "d+": date.getDate(),                    //日
                "h+": date.getHours(),                   //小时
                "m+": date.getMinutes(),                 //分
                "s+": date.getSeconds(),                 //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds()             //毫秒
            };

            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

            return fmt;
        },

        // 下载
        download: function(downloadOptions) {
            var tid = Ctx.getUUID();
            var $target = downloadOptions.$el;
            var caption = downloadOptions.caption; //this.confView.getValues()
            var ajaxUrl = downloadOptions.url; //this.confView.getValues()
            var ajaxData = downloadOptions.ajaxData; //this.confView.getValues()

            var downloadAjaxOpts = {
                type: 'GET', dataType: 'json',
                url: ajaxUrl, //Ctx.url('groupMerchant.bill.download'),
                data: _.extend({tid:tid}, ajaxData),
                beforeSend: function() {
                    Opf.UI.busyText($target, true, '正在下载...');
                },
                success: function(resp) {

                    if(resp.success !== false) {
                        var dlUrl = resp.data || resp.url;
                        //如果返回的数据中有下载url，则直接下载
                        if (dlUrl) {
                            Opf.download(dlUrl);
                            Opf.UI.busyText($target, false);
                        }
                        //否则轮询
                        else {
                            var billDownloadQueueTask = new PollingTask({
                                name: caption //params.caption //不要写死这个字段，还要加上筛选日期
                            });

                            App.TaskQueueMgr.addTask(billDownloadQueueTask);

                            Opf.Polling.addCallback({
                                tid: tid,
                                fn: function(obj){
                                    billDownloadQueueTask.updateByResponse(obj);
                                    if(obj.data){
                                        Opf.UI.busyText($target, false);
                                        Opf.Toast.success("下载完成");
                                    }
                                }
                            });
                        }
                    }
                },
                complete: function() {}
            };

            $.ajax(downloadAjaxOpts);
        },

        CommonUI: {
            /**
             * 后三个参数适合修订录入信息的时候使用
             */
            address: function (provinceEl, cityEl, countryEl,
                               defaultProvinceVal, defaultCityVal, defaultCountryVal) {

                var commonCitySelect = new AjaxSelect(cityEl, {
                    placeholder: '- 选择市 -',
                    value: defaultCityVal,
                    onDefaultValue: onCityChange
                });

                var commonDistricSelect = new AjaxSelect(countryEl, {
                    placeholder: '- 选择区 -',
                    value: defaultCountryVal
                });

                new AjaxSelect(provinceEl, {
                    value: defaultProvinceVal,
                    placeholder: '- 选择省 -',
                    ajax: {
                        url: Ctx.url('options.province')
                    },
                    onDefaultValue: onProvinceChange
                });

                $(provinceEl).change(onProvinceChange);
                function onProvinceChange () {
                    commonCitySelect.clear();
                    commonDistricSelect.clear();
                    $(this).attr('title',$(this).find('option:checked').text());
                    var provinceId = $(this).val(), duchy;
                    if(!provinceId) return;

                    //如果是直辖市，就直接添加到“市”选项，并且选中
                    if(duchy = MAP.specialCityMap[provinceId]) {
                        commonCitySelect.updateOptions([{value:provinceId, name:duchy.label}], provinceId);
                    }
                    else {
                        commonCitySelect.fetch({
                            url: Ctx.url('options.city', {province : provinceId})
                        });
                    }
                }

                $(cityEl).change(onCityChange);
                function onCityChange () {
                    commonDistricSelect.clear();
                    $(this).attr('title',$(this).find('option:checked').text());
                    var cityId = $(this).val();
                    if(!cityId) return;

                    commonDistricSelect.fetch({
                        url: Ctx.url('options.country', {city : cityId})
                    });

                }

                $(countryEl).change(function(){
                    $(this).attr('title',$(this).find('option:checked').text());
                });

            }
        }
    }, groupMerchantUtils);

});
