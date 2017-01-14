/**
 * User hefeng
 * Date 2016/5/9
 */
define([
    'app/group_merchant/users/add_view'
], function(AddView) {
    var _onRender = AddView.prototype.onRender;

    return AddView.extend({
        initialize: function(options) {
            this.data = _.extend({}, options.data);
        },

        caption: '编辑员工信息',

        onRender: function() {
            _onRender.apply(this, arguments);

            // 显示状态
            //this.ui.userStatus.closest('.form-group').show();

            // 去掉密码校验
            var pwd = this.ui.pwd = this.confView.$el.find('[name="pwd"]');

            pwd.rules('remove', 'required');

            // 禁止修改门店
            this.ui.mchtNo.select2('disable', true);

            // 禁止修改用户角色
            this.ui.userPrimary.prop('disabled', true);

            // 数据修复
            // 修复商户名
            if(this.data.mchtName) {
                this.data.name = this.data.mchtName;
            }

            // 过滤登录账号的后缀
            if(this.data.userLogin) {
                this.data.userLogin = this.getPrefix(this.data.userLogin);
            }

            this.confView.initFormData(this.data, this.ui.formEl);
        }
    })
});