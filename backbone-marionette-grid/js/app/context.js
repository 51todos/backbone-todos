define(['app/feature-cofnig'], function(FeatureCofingMap) {


    var Context = {
        /**
         * 全局参数，一站式中每个请求都会带上这个对象的key:value作为参数
         * @type {Map}
         */
        _contextAjaxParam: null,
        _contextParams: null
    };

    var _id = null;//一个上下文随机id，后台传过来
    var _uuidPool = [];
    var UUID_POOL_INIT_SIZE = 10;

    $.extend(Context, FeatureCofingMap);

    $.extend(Context, {
        // 集团商户 - 品牌
        isBrand: function() {
            return App.getMchtModel().get('mchtKind') == 'C4';
        },

        // 集团商户 - 门店
        isStore: function() {
            return App.getMchtModel().get('mchtKind') == 'C1';
        },

        getMchtInfo: function() {
            return App.getMchtModel().toJSON();
        },

        getContextAjaxParam: function (key) {
            return key && this._contextAjaxParam ? this._contextAjaxParam[key] : this._contextAjaxParam;
        },

        getContextParam: function (key) {
            return key && this._contextParams ? this._contextParams[key] : this._contextParams;
        },

        load: function (callback) {
            var me = this;

            var urlConfigDeferral = requireUrlConfig();

            var idDeferral = getIdDefer();
            
            //when all async work done, invoke callback
            $.when(urlConfigDeferral).done(function () {

                callback.apply(null, arguments);

            });//.fail(function () {});

            idDeferral.done(function (resp) {
                _id = resp.shift();
                _uuidPool = resp;
            });
        },
        getId: function () {
            return _id;
        },
        getUUID: function () {
            var ret;

            if(_uuidPool.length > 0) {
                ret = _uuidPool.shift();
            }

            if(_uuidPool.length === 0) {
                Opf.ajax({
                    async: false,
                    url: 'api/system/utils/uuid/' + (UUID_POOL_INIT_SIZE+1),
                    dataType: 'json',
                    success: function (resp) {
                        _uuidPool = resp;
                    }
                });
            }

            return ret;
        }
    });

    function requireUrlConfig() {
        var deferr = $.Deferred();

        try {
            require(['app/url'], function(getUrl) {
                deferr.resolve();
                Ctx.url = getUrl;
            });
        } catch (e) {
            deferr.reject();
        }
        return deferr.promise();
    }

    //直接抄业管的
    function getIdDefer () {
        if(Context.enableGetUUID){
            return Opf.ajax({
                url: 'api/system/utils/uuid/' + (UUID_POOL_INIT_SIZE+1),
                dataType: 'json'
            });
        }
        return $.Deferred().reject();
    }

    //TODO 临时放这里
    if (Context.getContextParam('mchtName')) {
        document.title = Context.getContextParam('mchtName');
    }

    return Context;
});