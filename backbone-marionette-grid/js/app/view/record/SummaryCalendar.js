define([
    'tpl!app/view/record/templates/summaryCalendar.tpl',
    'fwk/components/downloadTask',
    'moment'
], function (tpl, downloadTask, moment) {
    var STATUS_MAP = {
        '0': '已结算',
        '1': '结算失败',
        '2': '结算中',
        '3': '结算失败',
        '' : '无结算记录'
    };

    var STYLE_MAP = {
        '已结算' : 'already-setttle',
        '结算中' : 'settleing',
        '无结算记录' : 'no-data'
        // '结算失败' : 'settle-fail', //归并到其他情况
    };

    var busy = Opf.UI.setLoading;

    var calendarView = Marionette.ItemView.extend({
        tagName: "div",
        className: "settle-wrap",
        template: tpl,

        events: {
            'click .calData-wrap': 'choiceCalDate',
            'click .back2now': 'back2now'
        },

        ui: {
            complexDownload: '.complex-download'
        },

        onRender: function(){
            var me = this,
                yearMonth = moment().format("YYYY-MM");

            me.datepickerBtn = this.initDateButton(yearMonth);
            this.initCalender();
            this.initDownloadTask();
        },

        reDrawCalendar: function(yearMonth){
            var me = this;
            me.renderCalendar({
                renderTo: me.$el.find('.cal-body.other-month'),
                year_month: yearMonth
            });
        },

        /**
         * [renderCalendar description]
         * @param  {[obj]} options [有两个属性：renderTo,表示渲染到哪个对象中。year_month,格式为"YYYY-MM"。]
         * @return {[undefied]}
         */
        renderCalendar: function(options){
            console.log('renderCalendar');
            var me = this,
                $calBody = options.renderTo,
                year_month = options.year_month || moment().format("YYYY-MM"),
                startDate = moment(year_month,"YYYY-MM").startOf('month').day(0).format("YYYYMMDD"), //处在日历左上角的第一天，是当月第一天的周日
                endDate = moment(year_month,"YYYY-MM").endOf('month').day(6).format("YYYYMMDD"),//处在日历右下角的最后一天，是当月最后一天的周六
                year = year_month.split('-')[0],
                month = year_month.split('-')[1];

            me.startDate = startDate;
            me.endDate = endDate;

            busy($('.summary-list-wrap'));

            Opf.ajax({
                type: 'GET',
                url: Ctx.url('bill.has.settle.dates', {start: startDate, end: endDate}),
                success: function(data){
                    var $calendar = createCalendarBy(year_month);
                    me.setDataInCalendar($calendar, data);
                    me.setCalendarStyle($calendar, year_month, data);
                    me.$el.find('.cal-body').hide();
                    $calBody.empty().append($calendar).show();
                    if (year_month === moment().format("YYYY-MM")) {
                        $calendar.find('.calData-wrap[date='+ moment().format("YYYYMMDD") +']').trigger('click');
                    }

                },
                complete: function(){
                    busy($('.summary-list-wrap'), false);
                }
            });
        },

        setDataInCalendar: function(calendar, data){
            var $calendar = $(calendar),
                $days = $calendar.find('.calData-wrap');
            $days.each(function(){
                $(this).children('.cal-status').text('无结算记录');
            });
            _.each(data, function(item){
                var $calDateWrap = $calendar.find('.calData-wrap[date="'+ item.settleDate +'"]'),
                    status = item.settleFailNum ? (item.settleFailNum + '笔' + STATUS_MAP[item.resultStatus]) : STATUS_MAP[item.resultStatus];
                if($calDateWrap.length){
                    if (Number(item.reSettleNum)) {
                        $calDateWrap.find('.cal-re-settle').text(item.reSettleNum + "笔重新结算");
                    }
                    $calDateWrap.find('.cal-amt').text(formatSettleAmt(item.settleAmt)).prepend("&yen;");
                    $calDateWrap.find('.cal-status').text(status);
                }
            });

            //若 settleAmt 大于 1百万
            //则格式化为 xx.xx万
            function formatSettleAmt(settleAmt) {
                if (settleAmt >= 1000000) {
                    return parseFloat(settleAmt / 10000).toFixed(2) + '万';
                }
                return settleAmt;
            }
        },

        choiceCalDate: function(e){
            var me = this,
                $table = $(e.target).closest('table'),
                date = $(e.target).closest('.calData-wrap').attr('date');

            me.makeDayActive(date,$table);

            me.fetchDayData(date);

        },

        back2now: function(){
            var me = this,
                today = moment().format("YYYYMMDD"),
                year_month = moment().format("YYYY-MM"),
                $crtMonthTable = me.$el.find('.cal-body.current-month'),
                $otherMonthTable = me.$el.find('.cal-body.other-month'),
                $selectDateWrap = me.$el.find('.select-date-wrap'),
                $dateButton = $selectDateWrap.find('button.target'),
                formattedYMD;

            //TODO 打包这三行成一个函数，用作更新日期按钮以及datepicker插件
            me.setButtonDate($dateButton, year_month);
            formattedYMD = moment(year_month,"YYYY-MM").format("YYYY-MM-DD");
            me.datepickerBtn.datepicker('update',formattedYMD); //更新一下小日历当前选中的月份,格式要是'YYYY-MM-DD'


            $crtMonthTable.show();
            $otherMonthTable.hide();
            
            me.makeDayActive(today,$crtMonthTable);
            me.fetchDayData(today);

        },

        initCalender: function(){
            var me = this,
                today = moment().format("YYYYMMDD"),
                year_month = moment().format("YYYY-MM"),
                $crtMonthTable = me.$el.find('.cal-body.current-month'),
                $otherMonthTable = me.$el.find('.cal-body.other-month'),
                $button = me.$el.find('.select-date-wrap button.target');

            me.renderCalendar({
                renderTo: $crtMonthTable,
                year_month: year_month
            });
            me.makeDayActive(today, $crtMonthTable);
            me.fetchDayData(today);
        },

        initDownloadTask: function(){
            var me = this, ui = me.ui;
            var downloadTaskOpts = {
                caption: '日结对账单',
                targetView: me,
                type: ''
            };
            var downloadTaskView = downloadTask.init(downloadTaskOpts).render();
            ui.complexDownload.empty().append(downloadTaskView.$el);
        },

        //YearMonth格式为 YYYY-MM
        initDateButton: function(YearMonth){
            var me = this,
                $selectDateWrap = me.$el.find('.select-date-wrap'),
                $dateButton = $selectDateWrap.find('button.target'),
                $prevMonthBtn = $selectDateWrap.find('button.prev-btn'),
                $nextMonthBtn = $selectDateWrap.find('button.next-btn'),
                datepickerBtn = $dateButton.datepicker({
                    startView: 1,
                    minViewMode: 1,
                    language: "zh-CN",
                    autoclose: true
                }),
                formattedYearMonth,currentMonth,prevMonth,nextMonth,formattedYMD;
            //TODO 打包以下三行，成一个函数
            me.setButtonDate($dateButton, YearMonth);
            formattedYMD = moment(YearMonth,"YYYY-MM").format("YYYY-MM-DD");
            datepickerBtn.datepicker('update',formattedYMD);


            datepickerBtn.on("changeMonth", function(e,yearMonth){
                var formattedYMD;

                // 修复datepicker bug，再次点击已选中日期时会触发chageMonth，且 e.date 为 undefined
                if (!(e.date || yearMonth)) {
                    return;
                }
                // 以上，修复datepicker bug

                if (yearMonth === undefined) {
                    formattedYearMonth = moment(e.date).format("YYYY-MM");
                } else {
                    formattedYearMonth = yearMonth;
                }
                me.setButtonDate($dateButton, formattedYearMonth);
                formattedYMD = moment(formattedYearMonth,"YYYY-MM").format("YYYY-MM-DD");
                //，如果点击了快速选择月份按钮，则更新一下小日历当前选中的月份,格式要是'YYYY-MM-DD'
                yearMonth && datepickerBtn.datepicker('update',formattedYMD); 
                //如果不作此判断就更新小日历，会出现小日历当前月份没有高亮显示的BUG
                me.reDrawCalendar(formattedYearMonth);
            });
            $prevMonthBtn.on('click', function(){
                currentMonth = $dateButton.find('.date').val(),
                prevMonth = moment(currentMonth, "YYYY-MM").subtract(1, 'month').format("YYYY-MM");
                datepickerBtn.trigger('changeMonth', prevMonth);
            });
            $nextMonthBtn.on('click', function(){
                currentMonth = $dateButton.find('.date').val(),
                nextMonth = moment(currentMonth, "YYYY-MM").add(1, 'month').format("YYYY-MM");
                datepickerBtn.trigger('changeMonth', nextMonth);
            });

            return datepickerBtn;
        },

        fetchDayData: function(date){
            var me = this,
                $target = me.$el.find('.calData-wrap[date='+ date +']');
                options = {
                    settleDate : date,
                    shouldFetchData : true
                };
            if ($target.children('.cal-amt').text() === "") {
                //如果当日无结算信息，不向后台请求数据
                options.shouldFetchData = false;
            }
            this.trigger("itemview:render", options);

        },
        makeDayActive: function(today, $MonthTable){
            var me = this,
                $target = $MonthTable.find('.calData-wrap[date='+ today +']');
            $MonthTable.find('.calData-wrap.active').removeClass('active');
            $target.addClass('active');
        },

        setButtonDate: function($button, yearMonth){
            formatedYearMonth = yearMonth.replace(/(\w{4})-(\w{2})/,"$1年$2月");
            $button.find(".date").text(formatedYearMonth).val(yearMonth);
        },


        setCalendarStyle: function($calendar, year_month, data){
            var currentMonth = moment(year_month,"YYYY-MM").format("MM"),
                $days = $calendar.find(".calData-wrap");
            $days.each(function(){
                $(this).addClass($(this).attr('date').substring(4,6) === currentMonth ? 'inMonth' : 'outMonth');
                $(this).addClass(STYLE_MAP[$(this).children('.cal-status').text()] || 'settle-fail');
                if($(this).find('.cal-re-settle').text() === ""){
                    $(this).find('.cal-amt').addClass('ocupyTwoRows');
                }
            });
        }
    });

    function createCalendarBy(year_month){
        // IE8 不支持用 moment("YYYY-MM")生成moment实例
        // 但支持用 moment("YYYY-MM-DD")
        // 也支持用 moment("2014-08","YYYY-MM")
        var firstDay = moment(year_month,"YYYY-MM").startOf('month').day(0),
            lastDay = moment(year_month,"YYYY-MM").endOf('month').day(6),
            calDatesSum = lastDay.diff(firstDay,'days') + 1,
            calHtml = [],
            calDate = firstDay;

        for(var i = 0, l = calDatesSum/7; i < l; i++){
            var trHtml = '<tr>';
            for(var j = 0; j < 7; j++){
                trHtml += [
                    '<td>',
                        '<div date= "'+ calDate.format("YYYYMMDD") +'" class="calData-wrap ">',
                            '<div class="cal-date">',
                                '<span>'+ calDate.get('date') +'</span>',
                            '</div>',
                            '<div class="cal-amt"></div>',
                            '<div class="cal-status"></div>',
                            '<div class="cal-re-settle"></div>',
                        '</div>',
                    '</td>'
                ].join('');
                calDate.add('day',1);
            }

            trHtml += '</tr>';
            calHtml.push(trHtml);
        }

        return $(calHtml.join(''));
    }

    return calendarView;

});