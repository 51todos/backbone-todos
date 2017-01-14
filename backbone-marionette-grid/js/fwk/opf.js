define(['underscore'], function() {
    //global namespace
    Opf = {};

    var global = this;

    Opf.global = this;

    Opf.ns = function(root, packagePath) {
        var o, d;
        _.each(Array.prototype.slice.call(arguments, 1), function(v) {
            d = v.split(".");
            o = root[d[0]] = root[d[0]] || {};
            _.each(d.slice(1), function(v2) {
                o = o[v2] = o[v2] || {};
            });
        });
        return o;
    };

    
    Opf.get = function(source, parts) {
        if (typeof source === 'undefined') {
            return null;
        }
        if (arguments.length === 1) {
            return arguments.callee(Opf.global, source);
        } else {
            if (typeof parts === 'string') {
                parts = parts.split('.');
            }
            if (parts.length === 0) {
                return source;
            }
            for (var i = 0, l = parts.length; i < l; i++) {
                if (_.has(source, parts[i])) {
                    source = source[parts[i]];
                } else {
                    return null;
                }
            }
            return source;
        }
    };

    Opf.getImgAddress = function(imgs, name) {
        var imgAddress = null;

        _.each(imgs, function(img) {
            if(img.name === name) {
                imgAddress = img.value;
            }
        });

        return imgAddress;
    };

    Opf.Number = {
        /**
         * // Example usage:
                currency(54321); // ￥54,321
                currency(12345, 0, "£ "); // £ 12,345
                currency(12345,2,'¥',',','.',false) // ¥12,345.00
                currency(12345,2,'¥','','.',false) // ¥12345.00
                currency(12345,2,'¥','','.',true) // ¥12345
         */
        currency : function (number, places, symbol, thousand, decimal, smartDecimal) {
            var source = number;
            number = number || 0;
            
            places = !isNaN(places = Math.abs(places)) ? places : 2;
            
            symbol = symbol !== undefined ? symbol : "￥";
            thousand = thousand || ",";
            decimal = decimal || ".";
            var negative = number < 0 ? "-" : "",
                i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            var intPart = symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand);
            var dPart = Math.abs(number - i);
            var e = source - i;
            if(smartDecimal === true){
                return e > 0 ? intPart + (places ? decimal + dPart.toFixed(places).slice(2) : "") : intPart;
            }
            return intPart + (places ? decimal + dPart.toFixed(places).slice(2) : "");
        }   
    };
    
    Opf.currencyFormatter = function(val, options, obj){
        var value = val < 0 ? val.toString().replace('-','') : val;
        var symbol = val < 0 ? '-' : '';
        return symbol + Opf.Number.currency(value, 2, '', ',', '.', true);
    };

    Opf.roate90 = function (el, degree) {
        degree = parseInt(degree);

        var $el = $(el);
        var curCls = $el.attr('class');

        var oldDegree = 0, 
            newDegree,
            roatingRegReplace = /rotating-(\w)/;

        var matchRet = curCls.match(roatingRegReplace);
        if(matchRet) {//原来已经加上了旋转样式
            //取出当前的旋转级数，叠加上degree
            oldDegree = parseInt(matchRet[1], 10);
            newDegree = (oldDegree + degree + 4) % 4 ;
            newCls = curCls.replace(matchRet[0], '') + ('rotating-'+newDegree);//改成设置元素的class属性
            $el.attr('class',newCls);

        }else {//原来没加上旋转样式
            newDegree = (degree + 4) % 4 ;
            $el.addClass('rotating-' + newDegree);
        }
    };


    return Opf;
});