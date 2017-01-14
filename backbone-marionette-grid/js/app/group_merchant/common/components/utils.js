/**
 * Created by hefeng on 2016/3/2.
 */
define([
    'fwk/components/ajax-select',
    'select2'
], function(AjaxSelect) {

    // 翻译字段
    var mapUtil = {
        // 直辖市
        specialCityMap: {
            '11' : {label:'北京市'},
            '31' : {label:'上海市'},
            '12' : {label:'天津市'},
            '50' : {label:'重庆市'}
        },

        // 交易类型
        txTypeSearchMap: {
            "200": "所有",
            "201": "刷卡",
            "202": "微信支付",
            "203": "支付宝"
        },

        // 交易类型
        txTypeMap: {
            "200": "所有",
            "201": "刷卡",
            "202": "微信支付",
            "203": "支付宝",
            "0": "其它"
        },

        // 交易状态
        // 所有状态-5，成功0，失败1，已撤销2，已冲正3，余额查询4
        stateSearchMap: {
            "0": "成功",
            "1": "失败",
            "2": "已撤销",
            "3": "已冲正",
            "4": "余额查询",
            "5": "所有状态"
        },

        // 交易状态(0-成功应答 1-请求 2-已冲正 3-已撤销 4-已确认失败 5-部分退货 6-全额退货 7-交易异常(收到冲正交易))
        stateMap: {
            "0": "成功",
            "1": "请求",
            "2": "已冲正",
            "3": "已撤销",
            "4": "已确认失败",
            "5": "部分退货",
            "6": "全额退货",
            "7": "交易异常(收到冲正交易)"
        },

        // 结算周期
        cycleMap: {
            "0": "T+0",
            "1": "T+1",
            "2": "S+0",
            "3": "所有结算周期"
        },

        // 异常原因
        // 1-对账不平
        // 2-风控拦截延迟清算
        // 3-手工延迟清算
        // 4-商户不正常延迟清算
        // 5-商户信息不全
        errReasonMap: {
            "1": "对账不平",
            "2": "风控拦截延迟清算",
            "3": "手工延迟清算",
            "4": "商户不正常延迟清算",
            "5": "商户信息不全"
        },

        // 处理结果
        // 9、未处理
        // 8、交易取消
        // 7、退单
        // 6、补帐处理
        // 5、手动退货
        // 4、手工处理挂账
        // 3、手工处理请款
        // 2、手工处理退货
        // 1、处理后参加清算
        // 0、参入清算后并已清分
        nextDoMap: {
            "0": "参入清算后并已清分",
            "1": "处理后参加清算",
            "2": "手工处理退货",
            "3": "手工处理请款",
            "4": "手工处理挂账",
            "5": "手动退货",
            "6": "补帐处理",
            "7": "退单",
            "8": "交易取消",
            "9": "未处理"
        },

        // 门店搜索
        // 交易门店（1-本门店 2-搜索门店 3-通过分组选择）
        visibleRangeMap: {
            //"1": "本门店",
            "2": "搜索门店",
            "3": "通过分组选择"
        },

        // 门店可见度
        // 1-看所有门店 2-仅查看本门店 3-所有下属门店 4-指定分组 5-指定门店
        visibleMap: {
            "1": "所有门店",
            //"2": "仅查看本门店",
            //"3": "所有下属门店",
            "4": "指定分组",
            "5": "指定门店"
        },

        visibleMap4download: {
            "4": "指定分组",
            "5": "指定门店"
        },

        // 筛选门店
        visibleMap4user: {
            "0": "不筛选",
            "4": "指定分组",
            "5": "指定门店"
        },

        // 用户状态
        userStatusMap: {
            "0": "正常",
            "1": "停用",
            "2": "注销"
        },

        // 门店状态
        mchtStatusMap: {
            "0": "正常",
            "1": "商户新增保存",
            "2": "提交待审核",
            "3": "商户停用",
            "4": "商户注销",
            "5": "拒绝待修改"
        },

        // 0是店长 1是收银员  2是财务
        // 现在只做店长和收银员
        userPrimaryMap: {
            "1": "管理员",
            "0": "收银员"
        },

        // 分组信息
        groupInfoMap: {
            "0": "不筛选",
            "1": "按组筛选"
        }
    };

    // 格式化
    var formatUtil = {
        // 日期格式化
        dateFormatter: function(val, row) {
            return val? moment(val, 'YYYYMMDD').formatYMD():"&nbsp;";
        },

        // 交易类型
        txTypeFormatter: function(val, row) {
            return mapUtil.txTypeMap[val]||"&nbsp;";
        },

        // 结算周期
        cycleFormatter: function(val, row) {
            return mapUtil.cycleMap[val]||"&nbsp;";
        },

        // 交易状态
        "0": "成功",
        "1": "请求",
        "2": "已冲正",
        "3": "已撤销",
        "4": "已确认失败",
        "5": "部分退货",
        "6": "全额退货",
        "7": "交易异常(收到冲正交易)",
        stateFormatter: function(val, row) {
            var stateStr = "",
                stateVal = mapUtil.stateMap[val]||"&nbsp;";


            if(val == "3") {
                stateStr += '<span class="label label-default">'+stateVal+'</span>';

            } else if(val == "4") {
                stateStr += '<span class="label label-danger">'+stateVal+'</span>';

            /*} else if(val == "7") {
                stateStr += '<span class="label label-warning">'+stateVal+'</span>';*/

            } else {
                stateStr += stateVal;
            }

            return stateStr;
        },

        // 角色权限
        userPrimaryFormatter: function(val, row) {
            var userStr = "",
                userVal = mapUtil.userPrimaryMap[val]||"";

            if(val == "1") {
                userStr += '<i class="icon-user text-primary"></i>&nbsp;<span>'+userVal+'</span>';
            } else {
                userStr += userVal;
            }

            return userStr
        },

        // 用户状态
        userStatusFormatter: function(val, row) {
            var statusStr = "",
                statusVal = mapUtil.userStatusMap[val]||"";

            if(val == "0") {
                statusStr += statusVal;
            } else if(val == "1") {
                statusStr += '<span class="label label-default">'+statusVal+'</span>';
            } else if(val == "2") {
                statusStr += '<span class="label label-danger">'+statusVal+'</span>';
            }

            return statusStr;
        },

        // 门店状态
        mchtStatusFormatter: function(val, row) {
            var statusStr = "",
                statusVal = mapUtil.mchtStatusMap[val]||"";

            if(val == "3") {
                statusStr += '<span class="label label-default">'+statusVal+'</span>';
            } else if(val == "4") {
                statusStr += '<span class="label label-danger">'+statusVal+'</span>';
            } else {
                statusStr += statusVal;
            }

            return statusStr;
        },

        // 异常原因
        errReasonFormatter: function(val, row) {
            return val? mapUtil.errReasonMap[val]:"";
        },

        // 处理结果
        nextDoFormatter: function(val, row) {
            return val? mapUtil.nextDoMap[val]:"";
        },

        // 交易金额
        amtFormatter: function(val, row) {
            return val&&val>0? Opf.Number.currency(val,2,'¥','','.',false):val||"0";
        },

        // 交易金额(+)
        incomeFormatter: function(val, row) {
            return val&&val>0? "+ "+Opf.Number.currency(val,2,'¥','','.',false):val||"0";
        },

        // 交易金额(-)
        outlayFormatter: function(val, row) {
            return val&&val>0? "- "+Opf.Number.currency(val,2,'¥','','.',false):val||"0";
        }
    };

    // build
    var buildUtil = {
        // 生成下拉框选项
        buildSelect: function($target, map, defaultValue) {
            var selectTpl = '' +
                '<% _.each(items, function(v, k) { %>' +
                    '<option value="<%= k%>"><%= v%></option>' +
                '<% }) %>'
                ;
            var selectStr = _.template(selectTpl)({items:mapUtil[map]});
            var $select = $(selectStr);

            if(defaultValue) {
                $select.filter('[value="'+defaultValue+'"]').attr('selected', true);
            } else {
                $select.eq(0).attr('selected', true);
            }

            $target && ($target.append($select));

            return $select;
        },

        // 生成ajax下拉框选项
        buildAjaxSelect: function(el, options) {
            if(_.isUndefined(options)) {
                options = _.clone(el);
                el = options.el;
            }

            return new AjaxSelect(el, _.extend({}, {
                selected: false,
                placeholder: '- 请选择 -',
                value: options.defaultValue,
                convertField: null,
                ajax : {
                    url: options.url
                }
            }, options));
        },

        // 生成select2
        buildSelect2: function(el, options) {
            var $el = $(el),
                ajax = options.ajax,
                params = _.extend({ id:"_id", key:"_key", onChange:null }, options.params);

            var ajaxOptions = {
                type: "get",
                url: '',
                dataType: 'json',
                data: function (text) {
                    var _data = {};

                    _data[params.key] = encodeURIComponent(text);

                    return _data;
                },
                results: function (data, page) {
                    //console.log(data);
                    //console.log(page);
                    return {
                        results: data
                    };
                }
            };

            var select2Options = {
                placeholder: '请选择关键词进行搜索',
                minimumInputLength: 1,
                cache: true,
                multiple: false,
                ajax: _.extend({}, ajaxOptions, ajax),
                id: function(item) {
                    console.log("select item", item);
                    return item[params.id];
                },
                formatResult: function(data, container, query, escapeMarkup){
                    return data[params.key];
                },
                formatSelection: function(data, container, escapeMarkup){
                    return data[params.key];
                }
            };

            if(_.isFunction(params.onChange)) {
                $el.on('change', params.onChange);
            }

            $el.attr('data-id', params.id);
            $el.attr('data-key', params.key);

            return $el.select2(select2Options);
        }
    };

    return {
        MAP: mapUtil,
        Format: formatUtil,
        Build: buildUtil
    }
});
