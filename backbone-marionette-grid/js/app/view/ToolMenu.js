define([
    'tpl!app/view/templates/toolMenu.tpl'
], function(tplFn) {

    var config = {items:[
        {text:'基本信息', icon: 'icon-info-sign', id: 'btn-mcht'}
        /*,{text:'我的服务', icon: 'icon-info-sign', id: 'btn-service'}*/
        ,{text:'额度信息', icon: 'icon-money', id: 'btn-quota'}
        ,'-'
        ,{text:'注销', icon: 'icon-off', id: 'btn-entry-logout'}
    ]};

    //2015.03.31 因为没有数据，所以把 我的服务 注释掉
    /*if (!Ctx.enableService) {
        config.items.splice(1,1);
    }*/

    /*function menuItemTpl (item) {
        var htmlStr = "";

        if(item === "-") {
            htmlStr = '<li role="separator" class="divider"></li>';
        } else {
            htmlStr = [
                '<li>',
                    '<a href="#" id="' + item.id + '">',
                        '<i class="' + item.icon + '"></i>',
                        item.text,
                    '</a>',
                '</li>'
            ].join('');
        }

        return htmlStr;
    }

    function menuTpl () {
        return _.map(config, function (item) {
            return menuItemTpl(item);
        });
    }*/

    return Backbone.View.extend({

        id: 'user-nav',
        className: "nav",

        events: {
            'click #btn-mcht': function (e) {
                e.preventDefault();
                require(['app/entry/Mcht'], function () {
                    App.trigger('show:mcht');
                });
            },
            'click #btn-quota': function (e) {
                e.preventDefault();
                require(['app/entry/Quota'], function () {
                    App.trigger('show:quota');
                });
            },
            'click #btn-service': function(e) {
                e.preventDefault();
                require(['app/entry/Service'], function () {
                    App.trigger('show:service');
                });
            },

            'click #btn-manage-store': function(e) {
                e.preventDefault();
                require(['app/group_merchant/common/store_ctrl'], function () {
                    App.trigger('show:store');
                });
            },
            'click #btn-manage-users': function(e) {
                e.preventDefault();
                require(['app/group_merchant/common/users_ctrl'], function () {
                    App.trigger('show:users');
                });
            },

            'click #btn-repair-password': function (e) {
                e.preventDefault();
                require(['app/entry/repair-password'], function () {
                    App.trigger('toChangePsw');
                });
            },
            'click #btn-entry-logout': 'onLogoutClick'
        },

        initialize: function () {
            this.render();
            this.attachEvents();
        },

        updateUsername: function (username) {
            this.$el.find('.username').text(username);
        },

        onLogoutClick: function () {
            $.ajax({
                cache: false,
                url: 'api/entry/logout',
                type: 'GET',
                success: function(resp) {
                    console.log(resp);
                    if(resp.success) {
                        window.location = 'login.html';
                    }
                }
            });
        },

        render: function () {
            // 是否允许修改密码
            if(Ctx.enableChangePsw) {
                var changePswItem = {text:'修改密码', icon: 'icon-cog', id: 'btn-repair-password'};
                config.items.splice(-1, 0, changePswItem);
            }

            // 如果是一站式查询则不需要注销
            if (!Ctx.enableLogout) {
                config.items.splice(-1,1);
            }

            // 如果是集团商户需要显示门店/员工管理菜单
            // /^C/.test(App.getMchtModel().get('mchtKind'))
            var groupMerchantConfig = ['-'];

            // 集团商户：品牌
            if(Ctx.isBrand()) {
                groupMerchantConfig.push(
                    {text:'门店管理', icon: 'icon-sitemap', id: 'btn-manage-store'}
                    ,{text:'员工管理', icon: 'icon-group', id: 'btn-manage-users'}
                );
                config.items.splice(2, 0, groupMerchantConfig[0]);
                config.items.splice(3, 0, groupMerchantConfig[1]);
                config.items.splice(4, 0, groupMerchantConfig[2]);
            }

            // 集团商户：门店
            if(Ctx.isStore() && App.isPrimaryUser) {
                groupMerchantConfig.push(
                    {text:'员工管理', icon: 'icon-group', id: 'btn-manage-users'}
                );
                config.items.splice(2, 0, groupMerchantConfig[0]);
                config.items.splice(3, 0, groupMerchantConfig[1]);
            }

            this.$el.append(tplFn(config));

            $('#tool-menu').append(this.$el);
        }, 

        tplMenuItem: function () {

        },

        attachEvents: function () {

        },

        deleteInfoBy: function(isPrimaryUser) {
            if (!isPrimaryUser) {
                this.$('#btn-mcht').remove();
            }
        }
    });

    // return (new Menu());
});