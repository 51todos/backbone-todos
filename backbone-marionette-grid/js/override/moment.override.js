define(['underscore'],function(){

    moment.lang('zh-cn');

    var FORMAT = {
        PURE_YMD: 'YYYYMMDD',
        YMD: 'YYYY/MM/DD',
        CnYMD:'YYYY年MM月DD日',
        CN_YM:'MM月DD日'
    };


    /**
     * [_moment description]
     * @param  {[type]} date [description]
     * @param  {String} fmt  如果date是字符串，则fmt则是该字符串对应的日期格式
     * @return {Moment}      [description]
     */
    function _moment (date, fmt) {
        if(moment.isMoment (date)) {
            return date;
        }else if (date instanceof Date){
            return moment(date);
        }else {
            return moment(date, fmt);//TODO? give default format
        }

    }

    var formatUtils = {
        /**
         * formatXxxx
         * @param  {String/Moment/Date} date [description]
         * @param  {String} fmt 如果date是字符串，则fmt则是该字符串对应的日期格式
         * @return {[type]}      [description]
         */
        formatYMD: function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.YMD);
        },

        formatCnFull:function (date, fmt) {
            return _moment(date, fmt).format('lll');
        },

        formatCnYM:function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.CN_YM);
        },

        formatPureYMD: function (date, fmt) {
            return _moment(date, fmt).format(FORMAT.PURE_YMD);
        }
    };

    moment.utils = {};
    
    _.extend(moment.utils, formatUtils);

    _.each(formatUtils, function (func, name) {
        moment.fn[name] = function () {
            return formatUtils[name].call(null, this);
        };
    });

    // _.defaults(moment.fn, {

    // });

});