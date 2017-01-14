<div class="row">
    <div class="col-sm-12 col-lg-7">
        <form name="gridForm_custom" class="form-horizontal">
            <% if(Ctx.isBrand()){ %>
            <!-- 门店名称 -->
            <div class="form-group">
                <label class="control-label col-sm-3 col-lg-3">门店名称</label>
                <div class="col-sm-6 col-lg-6">
                    <input name="mchtNo" class="form-control" style="width: auto;">
                </div>
            </div>
            <% } %>

            <!-- 员工姓名 -->
            <div class="form-group">
                <label class="control-label col-sm-3 col-lg-3">员工姓名</label>
                <div class="col-sm-6 col-lg-6">
                    <input name="userName" class="form-control">
                </div>
            </div>

            <!-- 角色权限 -->
            <div class="form-group">
                <label class="control-label col-sm-3 col-lg-3">角色权限</label>
                <div class="col-sm-9 col-lg-6">
                    <select name="userPrimary" class="form-control"></select>
                </div>
            </div>

            <!-- 品牌登录账号 -->
            <div class="form-group">
                <label class="control-label col-sm-3 col-lg-3">登录账号</label>
                <div class="col-sm-6 col-lg-6">
                    <div class="input-group">
                        <input name="userLogin" class="form-control" data-with-suffix="userLogin">
                        <span class="input-group-addon">@<%= suffix%></span>
                    </div>
                </div>
                <div class="col-sm-3 col-lg-3">
                    <div class="control-label" style="text-align: left;">
                        <i class="glyphicon glyphicon-info-sign text-color-brown"></i>
                        <span class="text-grey">建议使用姓名拼音</span>
                    </div>
                </div>
            </div>

            <!-- 登录密码 -->
            <div class="form-group">
                <label class="control-label col-sm-3 col-lg-3">密码</label>
                <div class="col-sm-6 col-lg-6">
                    <input type="text" name="pwd" class="form-control" data-type="password">
                    <i class="icon-lock img-datepicker"></i>
                </div>
            </div>

            <!-- 手机号码 -->
            <div class="form-group">
                <label class="control-label col-sm-3 col-lg-3">手机号码</label>
                <div class="col-sm-9 col-lg-9">
                    <input name="userPhone" class="form-control form-control-inline">
                    <label class="help-label text-grey">(选填)</label>
                </div>
            </div>

            <% if(_.isString(rowData.userLogin) && rowData.userLogin !== App.getMchtModel().get('loginName')){ %>
            <!-- 状态 -->
            <div class="form-group">
                <label class="control-label col-sm-3 col-lg-3">状态</label>
                <div class="col-sm-6 col-lg-6">
                    <select name="userStatus" class="form-control"></select>
                    <% if(rowData.userPrimary == "1"){ %>
                    <p class="help-block">
                        <i class="icon-exclamation-sign"></i>
                        <span class="text-grey">温馨提示：管理员账户停用或注销都不能被再次启用，请谨慎操作。</span>
                    </p>
                    <% } else { %>
                    <p class="help-block">
                        <i class="icon-exclamation-sign"></i>
                        <span class="text-grey">温馨提示：收银员账户注销不能被再次启用，收银员账户停用可被再次启用。</span>
                    </p>
                    <% } %>
                </div>
            </div>
            <% } %>

            <hr>

            <!-- 提交 -->
            <div class="row">
                <div class="col-sm-offset-3 col-sm-9">
                    <button type="button" class="btn btn-primary" id="addUserOk">
                        <i class="icon-ok"></i>&nbsp;确定
                    </button>
                    <button type="button" class="btn btn-default" id="addUserCancel">
                        <i class="icon-remove"></i>&nbsp;取消
                    </button>
                </div>
            </div>
        </form>
    </div>
    <div class="col-sm-12 col-lg-5">
        <div class="ui-tips">
            <h4 class="ui-tips-title">权限说明</h4>
            <ul class="ui-tips-body">
                <li>
                    <h5><b>管理员</b></h5>
                    <p>具备店铺所有“财务查询”，“交易流水”的操作权限。</p>
                </li>
                <li>
                    <h5><b>收银员</b></h5>
                    <p>具备店铺所有“交易流水”，“消费”操作权限。</p>
                </li>
            </ul>
        </div>
    </div>
</div>
