<form name="gridForm_search" class="form-horizontal">
    <!-- 交易日期 -->
    <div class="form-group">
        <label for="rangedate" class="control-label col-sm-2 col-lg-2">交易时间</label>
        <div class="col-sm-6 col-lg-4">
            <input id="rangedate" class="form-control components_daterangepicker" type="text" name="rangedate" data-type="daterangepicker">
            <i class="glyphicon glyphicon-calendar fa fa-calendar img-datepicker"></i>
        </div>
        <div class="col-sm-4 col-lg-6">
            <div class="control-label" style="text-align: left;">
                <i class="glyphicon glyphicon-info-sign text-color-brown"></i>
                <span class="text-grey">查询日期范围不能超过31天</span>
            </div>
        </div>
    </div>

    <% if(Ctx.isBrand()) { %>
    <!-- 交易门店 -->
    <div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">交易门店</label>
        <div class="col-sm-10 col-lg-10">
            <select name="visibleRange" class="form-control form-control-inline"></select>
        </div>
    </div>
    <% } %>

    <!-- 收银员：所有收银员，显示门店下收银员名称 -->
    <div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">收银员</label>
        <div class="col-sm-6 col-lg-4">
            <select name="userId" class="form-control"></select>
        </div>
    </div>

    <!-- 终端编号 -->
    <div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">终端编号</label>
        <div class="col-sm-6 col-lg-4">
            <input name="terminal" class="form-control">
        </div>
    </div>

    <!-- 友情提示 -->
    <div class="form-group">
        <div class="col-lg-offset-2 col-lg-4">
            <i class="icon-exclamation-sign"></i>
            <span class="text-grey">温馨提示：晚上23:00之后的交易将计入第二个交易日。如需打包下载请访问<em class="text-primary">账单下载</em></span>
        </div>
    </div>

</form>