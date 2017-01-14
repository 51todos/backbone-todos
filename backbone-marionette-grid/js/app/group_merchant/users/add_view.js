/**
 * User hefeng
 * Date 2016/5/9
 */
define([
    'app/group_merchant/common/components/page/view',
    'app/group_merchant/common/components/config/view',
    'tpl!app/group_merchant/users/templates/add.tpl',
    'tpl!app/group_merchant/users/templates/conf.tpl'
], function(PageView, ConfView, addTplFn, confTplFn) {
    var _onRender = PageView.prototype.onRender;
    var _ui = PageView.prototype.ui;

    var buildUtil = Opf.Util.Build;

    return PageView.extend({

        template: addTplFn,

        caption: '新增员工账号',

        ui: _.extend({},  _ui, {
            pageBodyEl: '.region-pagebody',
            btnAddUser: '#addUserOk',
            btnCancelUser: '#addUserCancel'
        }),

        events: {
            'click @ui.btnAddUser': 'addUserFn',
            'click @ui.btnCancelUser': 'cancelUserFn'
        },

        toolbar: [
            {
                name: 'reply',
                btnCls: 'btn-primary',
                iconCls: 'icon-reply',
                text: '返回',
                onClick: 'record:reply'
            }
        ],

        validation: {
            errorElement: "span",
            errorClass: "help-error",
            rules: {
                mchtNo: {
                    required: true
                },
                userName: {
                    required: true,
                    wordlength: 12
                },
                userLogin: {
                    required: true,
                    wordlength: 20
                },
                userPhone: {
                    mobile: true
                },
                pwd: {
                    required: true, /*function(ele) {
                        var $form = $(ele).closest('form[name^="gridForm"]');
                        var nameVal = $form.attr('name');
                        return /add$/i.test(nameVal);
                    },*/
                    rangelength: [6, 16]
                }
            },
            highlight: function(element) {
                // 这里element是DOM对象
                $(element).closest('.form-group').addClass('has-error');
            },
            success: function(element) {
                //console.log('validate success', element);
                element.closest('.form-group').removeClass('has-error');
                element.remove();
            },
            errorPlacement: function(error, element) {
                var $parent = element.closest('div[class^="col"]');
                var $error = error.addClass('help-block');

                $parent.append($error);
            }
        },

        // 获取登录账号前缀
        getPrefix: function(val) {
            var arr = val? val.split('@'):[];

            return arr[0]||"prefix";
        },

        // 获取登录账号后缀
        getSuffix: function(val) {
            var arr = val? val.split('@'):[];

            return arr[1]||"suffix";
        },

        onRender: function() {
            _onRender.apply(this, arguments);

            var loginName = this.data? this.data.userLogin:App.getMchtModel().get('loginName');
            var confOptions = {
                showType: 'add',
                validation: this.validation,
                contentConf: confTplFn({
                    rowData: this.data||{},
                    suffix: this.getSuffix(loginName)
                })
            };
            var confView = this.confView = new ConfView(confOptions);

            this.ui.pageBodyEl.append(confView.$el);

            // 扩展UI
            var formEl = this.ui.formEl = confView.$el.find('form[name^="gridForm"]'),
                mchtNo = this.ui.mchtNo = confView.$el.find('[name="mchtNo"]'),
                userPrimary = this.ui.userPrimary = confView.$el.find('[name="userPrimary"]'),
                userLogin = this.ui.userLogin = confView.$el.find('[data-type="loginName"]'),
                userStatus = this.ui.userStatus =  confView.$el.find('[name="userStatus"]');

            // 初始化组件
            this.renderMchtName(mchtNo);
            this.renderUserPrimary(userPrimary);
            this.renderUserStatus(userStatus);

            // 删除状态
            //userStatus.closest('.form-group').hide();
        },

        renderUserPrimary: function($target) {
            buildUtil.buildSelect($target, 'userPrimaryMap');

            // 默认禁止管理员
            if(_.isEmpty(this.data)) {
                $target.find('option[value="1"]').attr('disabled', true);
            }

            /*$target.on('change', function() {
                var $self = $(this),
                    rowData = that.data,
                    loginName = rowData? rowData.userLogin:that.loginName||App.getMchtModel().get('loginName'),
                    loginNameArr = (loginName && loginName.split('@'))||[],
                    prefix = loginNameArr[0]||"prefix",
                    suffix = loginNameArr[1]||"suffix";

                ui.userLogin.trigger('loginName:switch', {
                    val: $self.val(),
                    prefix: prefix,
                    suffix: suffix
                });

            }).trigger('change');*/
        },

        renderUserStatus: function($target) {
            buildUtil.buildSelect($target, 'userStatusMap');
        },

        renderMchtName: function($target) {
            var that = this,
                ui = that.ui;

            buildUtil.buildSelect2($target, {
                ajax: {
                    url: Ctx.url('groupMerchant.search.store')
                },
                params: {
                    id: 'mchtNo', // 参数字段
                    key: 'name',  // 显示字段
                    onChange: function(e) {
                        ui.formEl.validate().element($(this));

                        if(_.isEmpty(this.data)){
                            Opf.ajax({
                                type: 'GET',
                                url: Ctx.url('groupMerchant.search.store.admin'),
                                data: { mchtNo:e.val },
                                success: function(resp) {
                                    // 没有管理员则必须先添加管理员账号
                                    if(_.isEmpty(resp)) {
                                        var $option = ui.userPrimary.find('option[value="1"]');
                                        $option.prop('disabled', false);
                                        $option.prop('selected', true);

                                        // 没有管理员的情况下禁止新增收银员
                                        ui.userPrimary.find('option[value="0"]').prop('disabled', true);
                                    }
                                }
                            })
                        }
                    }
                }
            });
        },

        addUserFn: function(evt) {
            if(!this.confView.triggerMethod('before:submit')) {
                return;
            }

            var that = this;
            var submitData = this.confView.getValues();
            var ajaxType = 'POST',
                ajaxUrl = Ctx.url('groupMerchant.users.list');

            if(this.data && this.data.id) {
                ajaxType = 'PUT';
                ajaxUrl += '/'+this.data.id;
            }

            Opf.UI.busyText($(evt.target), true);
            Opf.ajax({
                type: ajaxType,
                url: ajaxUrl,
                jsonData: submitData,
                success: function() {
                    that.onRecordReply(true);
                },
                complete: function() {
                    Opf.UI.busyText($(evt.target), false);
                }
            })
        },

        cancelUserFn: function() {
            this.onRecordReply(false);
        },

        onRecordReply: function(flag) {
            this.close(flag); // true:刷新grid, false:正常返回
        }

    })
});