define([
    'tpl!app/view/txn/templates/daterange.tpl'
], function(tpl) {

    var HINT_TPL = '<span class="hint" style="color:#E87878;font-size:12px;">提醒：只能选择同一个月内的日期</span>';

    var View = Marionette.ItemView.extend({

        initialize: function(options){
            this.options = options || {};
            this.limitDateRange = this.options.limitDateRange;
        },
        
        className: 'date-range-form none-select',

        template: tpl,

        ui: {
            startY: '.start-y',
            startM: '.start-m',
            startD: '.start-d', 
            endY: '.end-y',
            endM: '.end-m',
            endD: '.end-d',
            error: '.error',
            dateRangeWrap: '.date-range'
        },

        events: {
            'click .btn.cancel': 'close',
            'click .btn.ok': 'submit',
            'click .btn-today': 'onTodayClick',
            'click .btn-this-week': 'onThisWeekClick',
            'click .btn-this-month': 'onThisMonthClick'
        },

        onTodayClick: function () {
            this.today();
            this.submit();
        },

        onThisWeekClick: function () {
            this.thisWeek();
            this.submit();
        },

        onThisMonthClick: function () {
            this.thisMonth();
            this.submit();
        },

        today: function () {
            var day = moment();
            this.setStartValue(day);
            this.setEndValue(day);
        },

        thisWeek: function () {
            var day = moment().startOf('week');
            this.setStartValue(day);
            this.setEndValue(day.endOf('week'));
        },

        thisMonth: function () {
            var day = moment().startOf('month');
            this.setStartValue(day);
            this.setEndValue(day.endOf('month'));
        },

        setRangeDefaultValue: function(date){
            var startDate = moment(date, 'YYYYMMDD');
            var endDate = moment(date, 'YYYYMMDD').add('month', 1);

            this.setStartValue(startDate);
            this.setEndValue(endDate);
        },

        setDefaultValue: function () {
            //TODO 当天日期使用后台给的日期
            var today = moment();
            var yesDay = moment().subtract('day', 1);

            this.setStartValue(yesDay);
            this.setEndValue(today);
        },

        //别重构这两个setXXValue
        setStartValue: function (y, m, d) {
            if(moment.isMoment(y)) {
                m = y.get('month') + 1; 
                d = y.get('date');
                y = y.get('year');
            }
            this.ui.startY.val(y);
            this.ui.startM.val(twoDigit(m));
            this.ui.startM.triggerHandler('change.updateDays');
            this.ui.startD.val(twoDigit(d));
        },

        setEndValue: function (y, m, d) {
            this.limitDateRange=="rangemonth" && this.setEnable();

            if(moment.isMoment(y)) {
                m = y.get('month') + 1; 
                d = y.get('date');
                y = y.get('year');
            }
            this.ui.endY.val(y);
            this.ui.endM.val(twoDigit(m));
            this.ui.endM.triggerHandler('change.updateDays');
            this.ui.endD.val(twoDigit(d));

            this.limitDateRange=="rangemonth" && this.setDisable();
        },

        setEnable: function(){
            var $endY = this.ui.endY,
                $endM = this.ui.endM,
                $endD = this.ui.endD;

            $endY.find('option').prop("disabled", false);
            $endM.find('option').prop("disabled", false);
            $endD.find('option').prop("disabled", false);
        },

        setDisable: function(){
            var $endY = this.ui.endY,
                $endM = this.ui.endM,
                $endD = this.ui.endD;

            var options = $endD.find('option');
            var days = options.index(options.filter(':checked'));

            $endY.find('option:not(:checked)').prop("disabled", true);
            $endM.find('option:not(:checked)').prop("disabled", true);
            $endD.find('option:gt('+(days)+')').prop("disabled", true);
        },

        validate: function (strStart, strEnd) {
            if(strStart && strEnd && strStart > strEnd) {
                this.ui.error.text('起始日期 不能超过 结束日期').show();
                return false;
            }
            this.ui.error.text('').hide();
            return true;
        },

        submit: function () {
            var ui = this.ui;

            var strStart = _.invoke([ui.startY, ui.startM, ui.startD], 'val').join('');
            var strEnd = _.invoke([ui.endY, ui.endM, ui.endD], 'val').join('');

            if(!this.validate(strStart, strEnd)) {
                return;
            }

            this.trigger('submit', {
                startDate: strStart,
                endDate: strEnd
            });
            
            this.close();
            $('body').find('.date-overlay').remove();
        },

        close: function () {
            $(document).off('keydown.closeOnEscape');
            this.$el.hide();
            $('body').find('.date-overlay').remove();
        },

        onRender: function () {
            var ui = this.ui;

            select(ui.startY, ui.startM, ui.startD);
            select(ui.endY, ui.endM, ui.endD);

            this.$el.hide();

            this.limitDateRange && this.setLimitDateRange();
        },

        setLimitDateRange: function () {
            var me = this;
            var limitDateRange = this.options.limitDateRange;
            switch(limitDateRange){
                case 'month': me.limitInMonth(); break;
                case 'rangemonth': me.limitInRangeMonth(); break;
                case 'weekly':
                case 'quarter':
                default: 
                    break;
            }
        },

        limitInRangeMonth: function(){
            var $startY = this.ui.startY;
            var $startM = this.ui.startM;
            var $startD = this.ui.startD;

            //起止时间为一个月，可跨月份选择
            var that = this;
            $([$startY, $startM, $startD]).each(function(){
                $(this).on('change.selectYMD', function(){
                    that.setRangeDefaultValue(getYMD($startY, $startM, $startD));
                });
            });

            this.setRangeDefaultValue(moment().format('YYYYMMDD'));
            this.ui.dateRangeWrap.append(HINT_TPL);
        },

        limitInMonth: function () {
            var $startY = this.ui.startY;
            var $endY = this.ui.endY;
            var $startM = this.ui.startM;
            var $endM = this.ui.endM;

            //限制为同一个月内，因此年改变时为同一年，月改变时为同一月
            $startY.on('change.startY', function(){
                $endY.val($startY.val()).triggerHandler('change.updateDays');
            });
            $endY.on('change.endY', function(){
                $startY.val($endY.val()).triggerHandler('change.updateDays');
            });

            $startM.on('change.startM', function(){
                $endM.val($startM.val()).triggerHandler('change.updateDays');
            });
            $endM.on('change.endM', function(){
                $startM.val($endM.val()).triggerHandler('change.updateDays');
            });

            this.setDefaultValue();
            this.ui.dateRangeWrap.append(HINT_TPL);
        },

        toggle: function () {
            this.$el.toggle();
            this.handleKeydown();
        },

        handleKeydown: function(){
            var me = this;
            if (this.$el.is(':visible')) {
                $(document).on('keydown.closeOnEscape', function(e){
                    if (e.keyCode === $.ui.keyCode.ESCAPE) {
                        me.close();
                    }
                });
            } else {
                $(document).off('keydown.closeOnEscape');
            }
        }

    });

    var DAYS_OF_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function getMaxDay (year, month) {
        return  month == 2 ? //是二月吗2
            (isLeapYear(year) ? 29 : 28) :
            DAYS_OF_MONTH[parseInt(month, 10)-1];
    }

    var FROM_YEAR = 2010;

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    var _cacheDaysOptions = {};
    function select ($y, $m, $d) {
        genDefaultYearOptions();
        genDefaultMonthOptions();

        $y.add($m).each(function() {
            $(this).on('change.updateDays', function() {
                var maxDays = getMaxDay($y.val(), $m.val());
                var oldDay = $d.val();
                $d.html(genDayOptionsByMax(maxDays));
                if (oldDay && parseInt(oldDay, 10) <= maxDays) {
                    $d.val(oldDay);
                }
            });
        });

        $m.triggerHandler('change.updateDays');

        function genDayOptionsByMax (maxDay) {
            if(_cacheDaysOptions[maxDay]) {
               return _cacheDaysOptions[maxDay]; 
            }
            var arr = [], ret, day;
            for(var i = 1; i <= maxDay; i++){
                day = twoDigit(i);
                arr.push('<option value="' + day + '">' + day + '</option>');
            }
            ret =  arr.join('');
            _cacheDaysOptions[maxDay] = ret;
            return ret;
        }

        function genDefaultYearOptions () {
            var momToday = moment();
            var todayYear = momToday.get('year');
            var arr = [], val;
            for(var i = FROM_YEAR; i <= todayYear; i++) {
                val = twoDigit(i);
                arr.push('<option value="' + val + '">' + val + '</option>');
            }
            $y.html(arr.join(''));
        }

        function genDefaultMonthOptions () {
            var arr = [], val;
            for(var i = 1; i <= 12; i++) {
                val = twoDigit(i);
                arr.push('<option value="' + val + '">' + val + '</option>');
            }
            $m.html(arr.join(''));
        }
    }

    function twoDigit (str) {
        var tmp = parseInt(str, 10);
        return tmp < 10 ? ('0' + tmp) : tmp;
    }

    function getYMD($Y, $M, $D){
        return ""+$Y.val()+$M.val()+$D.val();
    }

    return View;
});