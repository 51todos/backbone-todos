(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory); // AMD
    } else {
        window.VTP = VTP || {};
        factory(window.VTP); // Browser global
    }
})(function(ns) {

    setTimeout(function () {
        $(window).on('keyup.recorder', function(e) {
            //w:87  s:83
            if (e.keyCode === 87 && e.shiftKey) {
                Recorder && Recorder.serialize();
            }

            if (e.keyCode === 83 && e.shiftKey) {
                Recorder && Recorder.download();
            }
        });
    });

    var QUERY_REG = /\?.*$/;

    var Recorder = ns.Recorder = function(options) {
        this.map = {};

        this.file = new VTP.File(this.outPath);

        this.outPath = options.outPath || 'data.bin';

        this.inPath = options.inPath || 'debug/data.bin';
        //'browser'/'file'
        this.sourceType = options.sourceType || 'file';

        this.init();
    };

    $.extend(Recorder, {


    });

    Recorder.prototype = {

        init: function() {
            var me = this;
            this.unSerialize();

        },

        unSerialize: function() {
            if (this.sourceType === 'browser') {
                this.unSerializeFromBrowserFs();
            } else if (this.sourceType === 'file') {
                this.unSerializeFromFile();
            }
        },

        unSerializeFromFile: function() {
            var me = this;
            var xhr = new window.XMLHttpRequest();
            xhr.open('GET', me.inPath, true);
            xhr.onreadystatechange = function() {
                var oldMap;
                if (xhr.status === 200 && xhr.readyState === 4) {
                    try {
                        oldMap = JSON.parse(xhr.responseText);
                        console.info('get data from file');
                        console.info(oldMap);
                    } catch (e) {}
                    if (oldMap) {
                        me.map = Ext.apply({}, oldMap, me.map);
                    }
                }
            };
            xhr.send();
        },

        unSerializeFromBrowserFs: function() {
            var me = this;
            me.file.read(function(data) {
                var oldMap;
                try {
                    oldMap = data ? JSON.parse(data) : {};
                } catch (e) {}

                console.info(oldMap);
                if (oldMap) {
                    me.map = Ext.apply({}, oldMap, me.map);
                }
            });

        },

        record: function(request) {
            var opt = request.options;
            this.map[this._optHash(opt)] = this._getXhrInfo(request.xhr, opt);
        },

        hasData: function(options) {
            return !!this.map[this._optHash(options)];
        },

        getData: function(options) {
            return this.map[this._optHash(options)];
        },

        serialize: function() {
            console.info(this.map);
            this.file.empty().write(JSON.stringify(this.map || {}));
        },

        download: function() {
            this.file && this.file.download();
        },

        _getXhrInfo: function(xhr, options) {
            return {
                readyState: xhr.readyState,
                response: xhr.response,
                responseText: xhr.responseText,
                responseXML: xhr.responseXML,
                status: xhr.status,
                statusText: xhr.statusText,
                _headers: xhr.getAllResponseHeaders()
            };
        },

        _optHash: function(opt) {
            return Ext.String.format(

                '<{0}><{1}><{2}><{3}>',

                opt.action || '',
                opt.method || 'GET',
                this._tidyUrl(opt.url),
                this._unSerializeParams(opt.params)
            );
        },

        _tidyUrl: function(str) {
            return str.replace(QUERY_REG, '');
        },

        _unSerializeParams: function(params) {
            if (!params) {
                return '';
            }

            var _keys = _.keys(params).sort();
            var ln = _keys.length;
            var ret = '';

            if (ln === 0) {
                return '';
            }

            while (ln--) {
                ret += _keys[ln];
                ret += ':';
                ret += params[_keys[ln]];

                (ln !== 0) && (ret += ',');
            }
            return ret;
        }
    };

});



Ext.override(Ext.data.Connection, {

    onComplete: function(request) {
        var me = this,
            options = request.options,
            result,
            success,
            response;

        try {
            result = me.parseStatus(request.xhr.status);
        } catch (e) {
            // in some browsers we can't access the status if the readyState is not 4, so the request has failed
            result = {
                success: false,
                isException: false
            };
        }
        success = result.success;

        if (success) {


            //>>>override

            VTP.Recorder && VTP.Recorder.record(request);
            //<<<override

            response = me.createResponse(request);
            me.fireEvent('requestcomplete', me, response, options);
            Ext.callback(options.success, options.scope, [response, options]);
        } else {
            if (result.isException || request.aborted || request.timedout) {
                response = me.createException(request);
            } else {
                response = me.createResponse(request);
            }
            me.fireEvent('requestexception', me, response, options);
            Ext.callback(options.failure, options.scope, [response, options]);
        }
        Ext.callback(options.callback, options.scope, [options, success, response]);
        delete me.requests[request.id];
        return response;
    },

    request: function(options) {
        options = options || {};
        var me = this,
            scope = options.scope || window,
            username = options.username || me.username,
            password = options.password || me.password || '',
            async,
            requestOptions,
            request,
            headers,
            xhr;

        if (me.fireEvent('beforerequest', me, options) !== false) {

            requestOptions = me.setOptions(options, scope);

            if (me.isFormUpload(options)) {
                me.upload(options.form, requestOptions.url, requestOptions.data, options);
                return null;
            }

            // if autoabort is set, cancel the current transactions
            if (options.autoAbort || me.autoAbort) {
                me.abort();
            }

            // create a connection object
            async = options.async !== false ? (options.async || me.async) : false;
            xhr = me.openRequest(options, requestOptions, async, username, password);

            headers = me.setupHeaders(xhr, options, requestOptions.data, requestOptions.params);

            // create the transaction object
            request = {
                id: ++Ext.data.Connection.requestId,
                xhr: xhr,
                headers: headers,
                options: options,
                async: async,
                timeout: setTimeout(function() {
                    request.timedout = true;
                    me.abort(request);
                }, options.timeout || me.timeout)
            };
            me.requests[request.id] = request;
            me.latestId = request.id;
            // bind our statechange listener
            if (async) {
                xhr.onreadystatechange = Ext.Function.bind(me.onStateChange, me, [request]);
            }

            //>>>override
            if (VTP.AJAX_MOCK) {

                var mockData = VTP.Recorder && VTP.Recorder.getData(options);

                if (mockData) {
                    console.log('mock : ' + VTP.Recorder._optHash(options));

                    request.xhr = Ext.apply({}, mockData);
                    request.xhr.getAllResponseHeaders = function() {
                        return this._headers;
                    };

                    this.clearTimeout(request);
                    this.onComplete(request);
                    this.cleanup(request);

                    return request; //<---return

                } else {
                    console.log('no mock data : ' + VTP.Recorder._optHash(options));
                }

            }
            //override<<<<

            // start the request!
            xhr.send(requestOptions.data);

            if (!async) {
                return me.onComplete(request);
            }

            return request;
        } else {
            Ext.callback(options.callback, options.scope, [options, undefined, undefined]);
            return null;
        }
    }

});