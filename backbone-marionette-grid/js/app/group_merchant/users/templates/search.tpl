<form name="gridForm_search" class="form-horizontal">
    <!-- 员工姓名 -->
    <div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">员工姓名</label>
        <div class="col-sm-6 col-lg-4">
            <input name="userName" class="form-control">
        </div>
    </div>

    <!-- 手机号码 -->
    <div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">手机号码</label>
        <div class="col-sm-6 col-lg-4">
            <input name="userPhone" class="form-control">
        </div>
    </div>

    <% if(Ctx.isBrand()) { %>
    <!-- 交易门店 -->
    <div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">筛选门店</label>
        <div class="col-sm-10 col-lg-10">
            <select name="visibleRange" class="form-control form-control-inline"></select>
        </div>
    </div>
    <% } %>
</form>