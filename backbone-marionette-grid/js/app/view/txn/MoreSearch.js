define([
    'tpl!app/view/txn/templates/moreSearch.tpl',
    'app/view/txn/RangeDatePicker',
    'jquery.validate'
], function(tpl, RangeDatePicker) {

    var View = Marionette.ItemView.extend({
        className: 'more-search',
        template: tpl,

        events: {
            //'click .btn-search': 'onSearchClick',
            'click .date-trigger': 'toggleDatePicker',
            'click .btn-link.reset': 'resetDiscCycle',
            'click .btn-link.reset.tradeType': 'resetTradeType'
        },

        ui: {
            traceNo: '[name="traceNo"]',
            iboxNo: '[name="iboxNo"]',
            acNoHead: '[name="acNoHead"]',
            acNoTail: '[name="acNoTail"]',
            date: '[name="date"]',
            tradeType: 'select[name="tradeType"]',
            discCycle: '[name="discCycle"]',
            paymentMethod: '[name="paymentMethod"]',
            datePickerSit: '.date-picker-sit'
        },

        initialize: function () {
            this.startDate = null;
            this.endDate = null;
        },

        /**
         * 重置表单
         */
        reset: function () {
            var $form = this.$el.find('form');
            $form.find('input').val('');
            $form.find('select[name="discCycle"]>option').eq(0).attr('selected', true);
            $form.find('select[name="paymentMethod"]>option').eq(0).attr('selected', true);
            this.validate(); //重置校验状态
        },

        resetDiscCycle: function(){
            var $form = this.$el.find('form');
            $form.find('select[name="discCycle"]>option').eq(0).attr('selected', true);
        },

        resetTradeType: function(){
            var $form = this.$el.find('form');
            $form.find('select[name="tradeType"]>option').eq(0).attr('selected', true);
        },

        /**
         * 表单校验
         */
        validate: function () {
            if(this.$el.find('.has-revise-error:visible').length) {
                return false;
            }
            return this.$el.find("form.search-form").valid();
        },

        /**
         * 获取表单值
         */
        getValues: function () {
            var obj = {};
            var ui = this.ui;

            //交易类型
            if(ui.tradeType.val()) {
                obj.tradeType = ui.tradeType.val();
            }

            //结算周期
            if(ui.discCycle.val()) {
                obj.discCycle = ui.discCycle.val();
            }

            //SN号
            if(ui.iboxNo.val()) {
                obj.iboxNo = ui.iboxNo.val();
            }

            //交易卡号前6位
            if(ui.acNoHead.val()) {
                obj.acNoHead = ui.acNoHead.val();
            }

            //交易卡号后4位
            if(ui.acNoTail.val()) {
                obj.acNoTail = ui.acNoTail.val();
            }

            //交易日期
            if(this.startDate && this.endDate && ui.date.val()) {
                obj.startDate = this.startDate;
                obj.endDate = this.endDate;
            }

            //支付方式
            if(ui.paymentMethod.val()) {
                obj.paymentMethod = ui.paymentMethod.val();
            }

            return obj;
        },

        renderDatePickerView: function () {
            var me = this;
            var datePickerView = this.datePickerView = new RangeDatePicker({limitDateRange:'rangemonth'}).render();

            datePickerView.on('submit', function (obj) {
                me.startDate = obj.startDate;
                me.endDate = obj.endDate;
                me.ui.date.val(me.startDate +'~' + me.endDate);

                me.ui.date.trigger('keyup'); //消除jquery validate 验证错误提示

                //让IE8 也能使用 preventDefault
                //IE8下，不阻止默认行为会导致页面刷新
                var e = $.event.fix(event);
                    e.preventDefault();
            });

            this.ui.datePickerSit.append(datePickerView.$el);
        },

        toggleDatePicker: function () {
            if(!this.datePickerView) {
                this.renderDatePickerView();
            }
            this.datePickerView.toggle();
            /*if(this.datePickerView.$el.is(':visible')){
               //$('body').append($('<div class="date-overlay"></div>'));
            }else{
                //$('.date-overlay').remove();
            }*/
            $(window).triggerHandler('resize.datePicker');
        },

        addRules4Info: function () {
            this.$el.find('form.search-form').validate({
                rules: {
                    date: {
                      required: true
                    },
                    traceNo:{
                        number:true
                    },
                    iboxNo:{
                        number:true
                    },
                    acNoHead:{
                        number:true,
                        minlength: 6
                    },
                    acNoTail:{
                        number:true,
                        minlength: 4
                    }
                },
                messages: {
                    date: {
                        required: '请选择日期'
                    },
                    traceNo: {
                        number:'请输入有效数字'
                    },
                    iboxNo: {
                        number:'请输入有效数字'
                    },
                    acNoHead: {
                        number:'请输入有效数字',
                        minlength: '请输入银行号前{0}位'
                    },
                    acNoTail: {
                        number:'请输入有效数字',
                        minlength: '请输入银行号后{0}位'
                    }
                }
            });
        },

        onRender: function () {
            this.addRules4Info();
        },

        hide: function () {
            this.$el.hide();
        },

        show: function () {
            this.$el.show();
        }
    });

    return View;

});