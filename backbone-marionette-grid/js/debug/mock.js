(function() {

    var config = { 
        include: [],//need to mock,  prior to exclude
        exclude: [ ],//not mock 不需要模拟
        redirect: [
            {
                xsrc: /settle-bill\/settle-summary\?filters/,
                to: 'settle-bill/settle-summary/one'
            },{
                src: /mcht-bill\/search/,
                to: 'mcht-bill/mcht-bill/search'
            }
            ,{
                src: /mcht-settle-info\/20140603/,
                to: 'record/mcht-settle-info'
            },{
                src: /algo-details\/42015012200000995/,
                to: 'record/algo-details'
            },{
                src: /settle-txn-record/,
                to: 'settle-bill/record'
            }
        ]
    };
 
    // config.exclude.push(/.*/); 
    
    // config.include.push(/.*/);
    // config.include.push(/current/);
    //config.include.push(/algo-details/);
    //config.include.push(/mcht-bill/);
    //config.include.push(/mcht-settle-info\/20140603/);
    //config.include.push(/algo-details\/42015012200000995/);
    //config.include.push(/settle-txn-record/);


    require(['mockajax'], function() {
        $.mockjax(function(options) {
            if (!needMock(options)) {
                return;
            }
            var match = options.url.match(/(^.*api\/open-user\/)(.*)/);
            var urlPrefix = match[1];
            var url = match[2];
            var redirect = _.find(config.redirect, function (item) {
                return item.src && item.src.test(url);
            });
            
            if(redirect) {
                url = redirect.to;
            }

            var newUrl = 'data/' + url.replace(/\?.+/, '') + '/' + (options.type.toLowerCase()) + '.json';
            var txt = readFileSync(newUrl);

            var ret = {};
            ret.responseText = txt;

            return ret;
        });
    });


    //不要mock
    function needMock(opt) {

        var url = trimSlash(opt.url);

        var urlIncluded = _.some(config.include || [], function(reg) {
            return reg.test(url);
        });


        var excluded = _.some(config.exclude || [], function(reg) {
            return reg.test(url);
        });

        //优先要模拟
        if(urlIncluded) {
            return true;
        }

        //如果不模拟
        if(excluded) {
            return false;
        }

        return false;
    }

    function trimSlash(str) {
        return str.replace(/(^\s+\/|\/+\s*$)/g, '');
    }

    function readFileSync(url, callback) {
        var ret = '';
        var xmlHttp = $.ajaxSettings.xhr();

        function stateChange() {
            if (4 == xmlHttp.readyState) {

                if (200 == xmlHttp.status || xmlHttp.responseText) {

                    ret = $.trim(xmlHttp.responseText || '');

                } else {
                    //alert( 'XML request error: ' + xmlHttp.statusText + ' (' + xmlHttp.status + ')' ) ;
                }
            }
        }

        xmlHttp.onreadystatechange = function() {
            stateChange();
        }; // do not work in ff when sync

        xmlHttp.open('GET', url, false);
        xmlHttp.send(null);

        return ret;
    }


})();