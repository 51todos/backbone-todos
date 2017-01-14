define(function() {


    var PURE_YMD_REG = /(\d{4})(\d{2})(\d{2})/;
    var PURE_TIME_REG = /(\d{2})(\d{2})(\d{2})/;
    var PURE_FULL_DATE = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    var REPLACE_REG = {
        YYYY: /YYYY/g, MM: /MM/g, M: /M/g, DD: /DD/g, D: /D/g,
        HH: /HH/g, H: /H/g, mm: /mm/g, m: /m/g, ss: /ss/g, s: /s/g
    };
    var Methods = {
        
        parseParams: function(query) {
            var re = /([^&=]+)=?([^&]*)/g;
            var decodeRE = /\+/g; // Regex for replacing addition symbol with a space
            var decode = function(str) {
                return decodeURIComponent(str.replace(decodeRE, " "));
            };
            var params = {},
                e;
            while (e = re.exec(query)) {
                var k = decode(e[1]),
                    v = decode(e[2]);
                if (k.substring(k.length - 2) === '[]') {
                    k = k.substring(0, k.length - 2);
                    (params[k] || (params[k] = [])).push(v);
                } else params[k] = v;
            }
            return params;
        },

        substitute: function(str, object, regexp){
            return String(str).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
                if (match.charAt(0) == '\\') return match.slice(1);
                return (object[name] != null) ? object[name] : '';
            });
        },

        /**
         * _.format("hello {0}, {1}", "peter", "huxiang1")
         * //return "hello peter, huxiagn1"
         */
        format : function(format){ //jqgformat
            var args = $.makeArray(arguments).slice(1);
            if(format==void 0) { format = ""; }
            return format.replace(/\{(\d+)\}/g, function(m, i){
                return args[i];
            });
        },

        getLastChar: function (str) {
            var ret = '';
            if(str && str.length > 1) {
                ret = str.charAt(str.length - 1);
            }
            return ret;
        },

        confirmFullStop: function (str) {
            var trimStr = $.trim(str), lastChar;
            if(trimStr) {
                lastChar = this.getLastChar(trimStr);
                if(lastChar === '.' || lastChar === '。') {
                    return trimStr;
                }else {
                    return trimStr + '。';
                }
            }
            return trimStr;
        },

        /**
         * Opf.String.replaceYMD('20150602', '$1年$2月$3日');//2015年06月02日
         * Opf.String.replaceYMD('20150602', 'YYYY年MM月DD日');//2015年06月02日
         * Opf.String.replaceYMD('20150602', 'YYYY年M月D日');//2015年6月2日
         */
        replaceYMD: function (input, strWith) {
            var output = '';
            if(/\$\d/.test(strWith)) {
                output = input.replace(PURE_YMD_REG, strWith);

            }else if(/[YMD]/.test(strWith)){

                var fullY, fullM, fullD;
                var result = PURE_YMD_REG.exec(input);

                if(result) {
                    fullY = result[1];   
                    fullM = result[2];   
                    fullD = result[3];   

                    output = strWith.replace(REPLACE_REG.YYYY, fullY)//
                            .replace(REPLACE_REG.MM, fullM)//
                            .replace(REPLACE_REG.DD, fullD)//

                            .replace(REPLACE_REG.M, parseInt(fullM, 10))//
                            .replace(REPLACE_REG.D, parseInt(fullD, 10));
                }

            }
            return output;
        },

        /**
         * Opf.String.replaceHms('150602', '$1时$2分$3秒');//15时06分02秒
         * Opf.String.replaceHms('150602', 'HH时mm分dd秒');//15时06分02秒
         * Opf.String.replaceHms('150602', 'HH时m分d秒');//15时6分2秒
         */
        replaceHms: function (input, strWith) {
            var output = '';
            if(/\$\d/.test(strWith)) {
                output = input.replace(PURE_TIME_REG, strWith);

            }else if(/[Hms]/.test(strWith)){

                var fullH, fullMin, fullSec;
                var result = PURE_TIME_REG.exec(input);

                if(result) {
                    fullH = result[1]; fullMin = result[2]; fullSec = result[3];   

                    output = strWith.replace(REPLACE_REG.HH, fullH)//
                            .replace(REPLACE_REG.mm, fullMin)//
                            .replace(REPLACE_REG.ss, fullSec)//
                            .replace(REPLACE_REG.m, parseInt(fullMin, 10))//
                            .replace(REPLACE_REG.s, parseInt(fullSec, 10));
                }
            }
            return output;
        },

        beautyWithSeparator: function (input, separator, everyN){
            if(!input){
                return '';
            }
            var _everyN, _input, reg, output;

            _everyN = everyN ? everyN : 4;
            _input = input.toString();
            reg = new RegExp('(.{'+ _everyN +'})','g');
            output = _input.replace(reg,'$1'+ separator);

            if(_input.length % _everyN == 0){
                return output.slice(0,output.length-1);
            }else{
                return output;
            }
        },

        beautyIdNo : function (input,separator) {
            if(!input){
                return '';
            }
            var _input = input.toString();
            return _input.replace(/(\d{6})(\d{4})(\d{4})/,'$1'+separator+'$2'+separator+'$3'+separator);
        },

        beautyBankCardNo : function (input, separator) {
            return this.beautyWithSeparator(input, separator);
        },

        /**
         *
         * Opf.String.replaceFullDate('20150612130102', '$1年$2月$3日$4时$5分$6秒');//2015年06月12日13时01分02秒
         * 其他类似上面两个方法
         * 
         */
        replaceFullDate: function (input, strWith) {
            var output = '';
            if(/\$\d/.test(strWith)) {
                output = input.replace(PURE_FULL_DATE, strWith);

            }else if(/[YMDHms]/.test(strWith)){

                var fullY, fullMon, fullD, fullH, fullMin, fullSec;
                var result = PURE_FULL_DATE.exec(input);

                if(result) {
                    fullY = result[1];   
                    fullMon = result[2];   
                    fullD = result[3]; 
                    fullH = result[4];   
                    fullMin = result[5];   
                    fullSec = result[6];     
                    
                    output = strWith.replace(REPLACE_REG.YYYY, fullY)//
                            .replace(REPLACE_REG.MM, fullMon)//
                            .replace(REPLACE_REG.DD, fullD)//

                            .replace(REPLACE_REG.M, parseInt(fullMon, 10))//
                            .replace(REPLACE_REG.D, parseInt(fullD, 10))//

                            .replace(REPLACE_REG.HH, fullH)//
                            .replace(REPLACE_REG.mm, fullMin)//
                            .replace(REPLACE_REG.ss, fullSec)//

                            .replace(REPLACE_REG.m, parseInt(fullMin, 10))//
                            .replace(REPLACE_REG.s, parseInt(fullSec, 10));
                }

            }
            return output;
        }
    };

    return Methods;

});