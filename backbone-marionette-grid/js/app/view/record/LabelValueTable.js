define([
], function() {

    function Table (options) {
        this.options = options;

        this.render();
    }

    Table.prototype = {
        render: function () {
            var opt = this.options;
            var $table = this.$el = $('<table class="opf-table ' + opt.cls + '"></table>');

            var $caption = $(['<caption>',
                            opt.caption,
                            '</caption>'
                          ].join(''));
            var $tbody = $('<tbody></tbody>');
            var $tfoot = $(['<tfoot>',
                            '<tr>',
                                '<td colspan = "2">',
                                    '<div>',
                                        opt.sumup,
                                    '</div>',
                                '</td>',
                            '</tr>',
                            '</tfoot>'
                        ].join(''));
            var MAP = {
                'txAmt': '交易本金',
                'feeAmt': '商户手续费',
                'freeAmt': '优惠金额',
                'currentAmt': '当日应结金额',
                'errAmt': '差错交易金额',
                'repairAmt': '资金截留',
                'unrepairAmt': '归还截留',
                'unErrAmt': '差错交易处理后清算',
                'uperrAmt': '结算失败后再次转账'
            };

            _.each(opt.content, function(val, key){
                $tr = generateTr(val, key);
                if ($tr) {
                    attachLink($tr,val, key);
                    applyStyle($tr, val, key);
                    applyOperator($tr, val, key);
                    $tbody.append($tr);
                }
            });

            $tfoot.find('div').prepend('&yen;');
            $table.append($caption).append($tbody).append($tfoot);

            function isObject(val){
                return Object.prototype.toString.call(val).slice(8,-1) === "Object";
            }
            function attachLink($target,val,key){
                if (opt.detail[key]) {
                    $target.attr('detail','true').attr('name',opt.detail[key]);
                }
                //结算失败后再次转账时 val为object
                if (isObject(val)) {
                    $target.attr('detail','true').attr('id',val['id']).attr('name', opt.detail['upSettleError']);
                }
            }

            function applyStyle($target, val, key){
                var STYLE_MAP = {
                    'uperrAmt' : 'hascaret increase',
                    'unErrAmt' : 'hascaret increase',
                    'unrepairAmt': 'hascaret increase',
                    'errAmt' : 'hascaret decrease',
                    'repairAmt': 'hascaret decrease'
                    };
                    
                if (opt.detail[key]) {
                        $target.addClass(STYLE_MAP[opt.detail[key]]);
                }
                if (isObject(val)) {
                    $target.addClass('hascaret increase');
                }
                if($target.hasClass("hascaret")){
                    var hascaretHtml = [
                                '<i class="icon-caret-right">',
                                '</i>'
                                ].join('');
                    $target.children("td:first").prepend($(hascaretHtml));
                }
            }

            function applyOperator($target, val, key){
                var MAP = {
                    'txAmt': '+',//交易本金
                    'feeAmt': '-',//商户手续费
                    'freeAmt': '+',//优惠金额
                    'currentAmt': '+',//当日应结金额
                    'errAmt': '-',//差错交易金额
                    'repairAmt': '-',//资金截留
                    'unrepairAmt': '+',//归还截留
                    'unErrAmt': '+',//差错交易处理后参与清算
                    'uperrAmt': '+'//结算失败后再次转账
                },
                operator = isObject(val) ? '+' : MAP[key],
                $td = $target.children('td:last'),
                preText = $td.text();

                $td.text(operator+preText);

            }

            function generateTr(val, key){
                var $tr = null;

                if (isNotZeroNorNull(val)) {
                    $tr = $(['<tr>',
                                '<td>',
                                    isObject(val) ? val.inDate : MAP[key],
                                '</td>',
                                '<td class="text-right">',
                                    (isObject(val) ? val.settleAmt : val),
                                '</td>',
                            '</tr>'
                        ].join(''));
                    $tr.find('td:last-child').prepend('&yen;');
                }
                return $tr;
            }

            function isNotZeroNorNull(val){
                var value = (isObject(val) ? val.settleAmt : val);
                return value !== "0.00" && value != null;
            }
        }
    };

    return Table;
    
});