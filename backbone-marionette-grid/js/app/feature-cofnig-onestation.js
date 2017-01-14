// 
/**
 * 返回一个对象，每一个属性对应一个功能的开关，对象的属性会拷贝到全局 Context 中
 *
 * url中参数对应
 * _u   用户id（全局请求参数）
 * _m   商户号（全局请求参数）
 * _n   商户名称
 */
define([
], function() {

    var URL_PARAM_NAME_MAP = { '_u': 'userId', '_m': 'mchtNo', '_n': 'mchtName'};//<url参数名, ajax的参数名>
    var CONTEXT_AJAX_PARAMS = ['userId', 'mchtNo'];

    var _contextParams = parseUrlParams();
    var _contextAjaxParam = _.pick(_contextParams, CONTEXT_AJAX_PARAMS);

    function parseUrlParams () {
        var ret = {};
        var urlParam = Opf.String.parseParams(window.location.search.replace(/^\?/, ''));
        for(var k in urlParam) {
            if(urlParam.hasOwnProperty(k) && URL_PARAM_NAME_MAP[k]) {
                ret[URL_PARAM_NAME_MAP[k]] = urlParam[k];
            }
        }
        return ret;
    }


    return {
        _contextAjaxParam: _contextAjaxParam
        ,_contextParams: _contextParams
        
        ,enableDownloadBill: false//自助：看浏览器脸色，一站式：关闭
        ,enableForceChangeInitPsw: false//自助：打开，一站式：关闭
        ,enableChangePsw: false//自助：打开， 一站式：关闭
        ,enableLogout: false//自助：打开， 一站式:关闭
        ,enableService: false //自助：打开，一站式：关闭
        ,enableShowErrorStringInVoucher: true //自助：关闭， 一站式:打开 在签购单中显示真正的错误原因
        ,enableGetUUID: false//自助：打开， 一站式:关闭
        ,loginRedirectUrl: '../login.html'
    };
});