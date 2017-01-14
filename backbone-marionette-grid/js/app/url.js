define(function (global) {


  var url = {};//global.url || (global.url = {});

  var map = {
    'null': 'xxxx',

    'mcht.info': 'api/open-user/mcht-bill/mcht-info',

    'bill.summary.last':             'api/open-user/settle-bill/last-settle-summary/(:num)',
    'bill.summary':                  'api/open-user/settle-bill/settle-summary',
    'bill.summary.onedate':          'api/open-user/settle-bill/settle-summary/(:date)',
    'bill.algo.date.details':          'api/open-user/settle-bill/algo-details/(:id)',

    // 'bill.algo.details':             'api/open-user/settle-bill/algo-details',
    'bill.algo.details':             'api/open-user/settle-bill/settle-txn-record',
    'bill.algo.details.terminal':    'api/open-user/settle-bill/algo-details-terminal/(:num)',
    'bill.algo.details.terminal.no': 'api/open-user/settle-bill/algo-details-terminal-no',
    'bill.algo.details.date': 'api/open-user/settle-bill/algo-details-date',
    'bill.has.settle.dates': 'api/open-user/settle-bill/has-settle-dates/(:start)/(:end)',



    'bill.algo.tno':                 'api/open-user/settle-bill/algo-details/(:date)/(:tno)',
    'bill.gen.report':               'api/open-user/settle-bill/algo-details-report-gen/(:startDate)/(:endDate)',


    'mcht.settle.info':          'api/open-user/settle-bill/mcht-settle-info/(:settleDate)',//获取时间节点和ID
    'bill.date.stlmerror':       'api/open-user/settle-bill/stlm-error-infos/(:id)',//差错交易
    'bill.date.stlmerror.next':  'api/open-user/settle-bill/stlm-error-next-del/(:id)',//异常交易已确认无误
    'bill.date.stlmrepair':      'api/open-user/settle-bill/stlm-repair-infos/(:mchtNo)',//资金截留
    'bill.date.stlmrepair.next': 'api/open-user/settle-bill/stlm-repair-next-del/(:id)',//调帐后参与清算
    'bill.date.settleerror':     'api/open-user/settle-bill/settle-error-next-del/(:id)',//入账失败参与清算
    'bill.date.repair.history':  'api/open-user/settle-bill/repair-txns/(:repairId)',//资金截留的调账历史
    'txn.flow':                  'api/open-user/mcht-bill/current',//TODO跟后台协定改为txnFlow
    'txn.flow.search':           'api/open-user/mcht-bill/search',

    'service.list':    'api/open-user/service/mcht-service/(:mchtNo)', //商户服务列表
    'request.service': 'api/open-user/service/request-service',//申请服务
    'stop.service':    'api/open-user/service/stop-service', //暂停服务

    'quota.list':    'api/open-user/mcht-bill/quota', //额度信息查询

    'sign.purchase.order.download':    'api/open-user/mcht-bill/downloadSignPurchaseOrder/(:txId)', //签购单下载

    /**
     * 省市区
     */
    'options.province'     : 'api/system/options',
    'options.city'         : 'api/system/options/(:province)',
    'options.country'      : 'api/system/options/city/(:city)',

    /**
     * 集团商户
     */
    'groupMerchant.txn.list': 'api/open-user/mcht-bill/searchTredeWater',
    'groupMerchant.txn.precise': 'api/open-user/mcht-bill/search-water-acNo',
    'groupMerchant.txn.download': 'api/open-user/mcht-bill/download_trede_water', //下载交易流水
    'groupMerchant.record.list': 'api/open-user/settle-bill/settle-detail',
    'groupMerchant.record.details': 'api/open-user/settle-bill/settle-detail-info',
    'groupMerchant.record.download': 'api/open-user/settle-bill/downLoand-settle-details',
    'groupMerchant.bill.list': 'api/open-user/settle-bill/algo-details',
    'groupMerchant.bill.algoDownload': 'api/open-user/settle-bill/downLoand-algo',
    'groupMerchant.bill.download': 'api/open-user/settle-bill/downLoand-algo',
    'groupMerchant.users.list': 'api/open-user/user-manage',
    'groupMerchant.store.list': 'api/open-user/group-info/(:id)',
    'groupMerchant.storeGroup.list': 'api/open-user/group-info/group_mcht',
    'groupMerchant.store.groups': 'api/open-user/group-info/save-group',

    'groupMerchant.search.store': 'api/open-user/base-manage', //搜索门店
    'groupMerchant.search.store.admin': 'api/open-user/user-manage/search-userPrimary', //搜索门店下管理员
    'groupMerchant.search.groups': 'api/open-user/group-info/current-group', //搜索分组
    'groupMerchant.search.name': 'api/open-user/mcht-bill/search_name', //根据分组搜索门店
    'groupMerchant.search.users': 'api/open-user/user-manage/search-username' // 搜索门店下收银员

  };

  /**
   * 假设`map`配置为
   * map = {
   *   a: 'api/person/(:id)',
   *   b: 'api/role'
   * }
   *
   * 取key为a的url为  url._('a', {id:23})
   * 取key为b的url为 url._('b')
   * 取key为a但是不要参数部分 url._('a')
   * 
   */
  var arg_exp = /\(:([\s\S]+?)\)/g;
  var replace_arg_exp = /\/?\(:([\s\S]+?)\)/g;

  url._ = function (key, data) {
    var strUrl = map[key];

    if(!strUrl) {
      console.error('url: 找不到key为', key, '的url配置');
      return null;
    }

    if(data) {
      return _.template(strUrl, data, {
        interpolate : arg_exp
      });
    }else {
      return strUrl.replace(replace_arg_exp, '');
    }
  };

  return url._;

});