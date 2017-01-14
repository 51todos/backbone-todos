/**
 * 模块功能导航栏
 */
define(['tpl!app/view/templates/nav.tpl'], function (tpl) {

    var DATA_KEY = 'data.options';

    // 普通商户配置
    var config = [
        {name:    'txn', id:    'txn-pane', cls:'txn-tab', txt: '交易流水', deps:    'app/controller/Txn', trigger:'txn:show'},
        {name: 'record', id: 'record-pane', cls:'record-tab', txt: '结算记录', deps: 'app/controller/Record', trigger:'settle:show'},
        {name:   'bill', id:   'bill-pane', cls:'bill-tab', txt: '对账明细', deps:   'app/controller/Bill', trigger:'bill:show'}
    ];

    // 集团商户配置
    var groupMerchantConfig = [
        {name:    'txn', id:    'txn-pane', cls:'txn-tab', txt: '交易流水', deps:    'app/group_merchant/common/txn_ctrl'},
        {name: 'record', id: 'record-pane', cls:'record-tab', txt: '结算记录', deps: 'app/group_merchant/common/record_ctrl'},
        {name:   'bill', id:   'bill-pane', cls:'bill-tab', txt: '对账明细', deps:   'app/group_merchant/common/bill_ctrl'},
        {name:   'bill-download', id:   'bill-download-pane', cls:'bill-download-tab', txt: '账单下载', deps:   'app/group_merchant/common/bill_download_ctrl'}
    ];

    return Marionette.ItemView.extend({

        template: tpl, 

        //副用户不能显示 结算记录
        serializeData: function () {
            if(/^C/.test(App.getMchtModel().get('mchtKind'))) {
                config = groupMerchantConfig;
            }

            if (!App.isPrimaryUser) {
                config = _.filter(config, function(item){
                    return (item.name != 'record' && item.name != 'bill' && item.name != 'bill-download');
                });
            }

            return {config:config};
        },

        onRender: function () {

            console.log('Nav onRender');

            this.$el.appendTo($('#main-nav-header'));

            this._attachEvents();

             $(window).on('scroll.btnscrollup', function () {
                $('#btn-scroll-up')[$(window).scrollTop() > 10 ? 'fadeIn' : 'fadeOut']();
             }).triggerHandler('scroll.btnscrollup');
        },

        _attachEvents: function () {
            this.$el.find('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
                var $dataToggle = $(e.target).closest('[data-toggle]');
                var name = $dataToggle.attr('name');

                if(!$dataToggle.data(DATA_KEY)) {
                    $dataToggle.data(DATA_KEY, _.findWhere(config, {name:name}));
                }
                App.trigger('tab:show', $dataToggle.data(DATA_KEY));
            });
        },

        showDefaultTab: function () {
            console.log('show default tab');
            this.$el.find('.txn-tab').tab('show');   
        }

    });

});