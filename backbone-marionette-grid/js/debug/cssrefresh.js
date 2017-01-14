/**
 *  CSSAutoRefresh v1.0
 *
 *  Copyright (c) 2013 ZhenYong
 *  https://github.com/zhenyong
 *
 *  licensed under the MITlicenses.
 *  http://en.wikipedia.org/wiki/MIT_License
 *
 /

 /**
  * Usage
  * ==========================
  * - put this script to you page, it must under the css file since it check the loaded css files
  * before execute
  * - Script request the css file every @cfg:interval millseconds, if the response header
  * 'Last-Modified' change, then reload the css file
  */

define(function() {

    var DEFAULT_OPTIONS = {
        // auto: true,
        interval: 2000,
        trigger: null
    };

    var isAuto = false;

    function defaults (customOption) {
        var p, ret = {};
        for(p in DEFAULT_OPTIONS) {
            ret[p] = DEFAULT_OPTIONS[p];
        }
        for(p in customOption) {
            ret[p] = customOption[p];
        }
        return ret;
    }

    function CssRefreher(options) {
        var me = this;
        var opt = defaults((options || {}));
        this.opt = opt;
        var trigger;
        if (opt.auto) {
            this.startAuto(opt);
        }
    }

    /**
     * [startAuto description]
     * @param  {[type]} interval [description]
     * @param  {[type]} righnow  [description]
     * @return {[type]}          [description]
     */
    CssRefreher.prototype.startAuto = function(opt) {
        opt = opt || this.opt;
        isAuto = true;
        refreshFile(collectionLinkInfo(), opt.interval, opt.righnow);
    };

    CssRefreher.prototype.stop = function(opt) {
        isAuto = false;
    };

    CssRefreher.prototype.refresh = function(interval, righnow) {
        refreshFile(collectionLinkInfo(), 0, true);
    };

    CssRefreher.prototype.setTrigger = function(el) {
        if(!el.nodeName) {
            throw new Error('trigger must be browser raw html element');
        }
        if (el.addEventListener) {
            el.addEventListener("click", _refreh, false);
        } else {
            el.attachEvent("click", _refreh);
        }
        function _refreh () {
            refreshFile(collectionLinkInfo(), 0, true);
        }
    };

    var _counter = 0,
        cssHrefReg = /^.*\.css\??.*$/,
        cssRelReg = /^(?:|\s*stylesheet\s*)$/,
        seed = new Date().getTime();


    var getHttp = window.ActiveXObject ? function() {
            return new ActiveXObject('Microsoft.XMLHTTP');
        } : function() {
            return new XMLHttpRequest();
        };

    function getLastModified(url) {
        var headers = getHeaders(url);
        return (headers && headers['Last-Modified'] &&
            Date.parse(headers['Last-Modified']) / 1000) || false;
    }

    function getHeaders(url) {
        var req = getHttp();
        if (!req) {
            throw new Error('ajax not support ');
        }

        var tmp, ret = {}, pair, j = 0;

        try {
            req.open('HEAD', url, false);
            req.send(null);
            if (req.readyState === 4 && req.status === 200) {
                tmp = req.getAllResponseHeaders().split('\n');

                for (var i = 0, len = tmp.length; i < len; i++) {
                    if (tmp[i] !== '') {
                        pair = tmp[i].toString().split(':');
                        //when meet this header -> Date: Wed, 15 May 2013 08:55:41 GMT
                        //splice the first one as header name, rejoin the other with ':'
                        ret[pair.splice(0, 1)] = pair.join(':').substring(1);
                    }
                }

                return ret;
            }
        } catch (err) {
            return null;
        }
        return null;
    }

    function disableCacheLink(href) {
        return href + '?_x=' + seed + (_counter++);
    }

    function refreshFile(linkInfos, interval, righnow) {
        var me = this,
            selfFun = arguments.callee;
        for (var i = 0, l = linkInfos.length; i < l; i++) {
            var link = linkInfos[i],
                newTime = getLastModified(disableCacheLink(link.href));

            //  has been checked before
            if (link.oldTime && (link.oldTime != newTime) ||
                    righnow === true) {
                //  has been changed
                link.el.setAttribute('href', disableCacheLink(link.href));
            }
            link.oldTime = newTime;
        }

        (isAuto && interval && interval > 0) && setTimeout(function() {
            selfFun.call(me, linkInfos, interval, false);
        }, interval);
    }


    /**
     * [collectionLinkInfo description]
     * @return {Array<Object>} [{el:xx, href:xx, oldTime: null}]
     */
    function collectionLinkInfo() {
        var files = document.getElementsByTagName('link'),
            links = [];

        for (var i = 0, l = files.length; i < l; i++) {
            var el = files[i],
                rel = el.rel;
            if (isCssLink(el)) {
                links.push({
                    'el': el,
                    'href': getHref(el),
                    oldTime: null
                });
            }
        }
        return links;
    }

    function isCssLink(el) {
        return cssRelReg.test(el.rel) && cssHrefReg.test(el.href);
    }

    function getHref(el) {
        return el.getAttribute('href').split('?')[0];
    }

    return CssRefreher;

});