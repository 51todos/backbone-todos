// 
/**
 * 返回一个对象，每一个属性对应一个功能的开关，对象的属性会拷贝到全局 Context 中
 */
define([
], function() {
    
    return {
        enableDownloadBill: Opf.Bowser.ios ? false : true//自助：看浏览器脸色，一站式：关闭
        ,enableForceChangeInitPsw: true//自助：打开，一站式：关闭
        ,enableChangePsw: true//自助：打开， 一站式：关闭
        ,enableLogout: true//自助：打开， 一站式:关闭
        ,enableService: true//自助：打开， 一站式:关闭
        ,enableShowErrorStringInVoucher: false //自助：关闭， 一站式:打开 在签购单中显示真正的错误原因
        ,enableGetUUID: true//自助：打开， 一站式:关闭
        ,loginRedirectUrl: 'login.html'
    };
});