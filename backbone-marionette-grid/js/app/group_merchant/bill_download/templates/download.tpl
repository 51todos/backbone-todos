<form name="gridForm_search" class="form-horizontal">
    <!-- 起止日期 -->
    <div class="form-group">
        <label for="rangedate" class="control-label col-sm-2 col-lg-2">对账日期</label>
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

    <!-- 终端编号 -->
    <div class="form-group">
        <label for="terminal" class="control-label col-sm-2 col-lg-2">终端编号</label>
        <div class="col-sm-6 col-lg-4">
            <input id="terminal" class="form-control" type="text" name="terminal">
        </div>
    </div>

    <!-- 支付方式 (刷卡-201，微信支付-202，支付宝-203) -->
    <!--<div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">支付方式</label>
        <div class="col-sm-6 col-lg-6">
            <label class="checkbox-inline">
                <input type="checkbox" name="paymentMethod" value="201"> 刷卡
            </label>
            <label class="checkbox-inline">
                <input type="checkbox" name="paymentMethod" value="202"> 微信支付
            </label>
            <label class="checkbox-inline">
                <input type="checkbox" name="paymentMethod" value="203"> 支付宝
            </label>
        </div>
    </div>-->

    <div class="row">
        <div class="col-sm-offset-2 col-sm-10 col-lg-10">
            <!-- 钱盒账单打包下载 -->
            <button class="btn btn-primary btn-lg" type="button" id="billDownloadIBX">
                <i class="icon-download"></i>&nbsp;钱盒账单下载
            </button>
            <!-- 钱盒账单打包下载 -->
            <button class="btn btn-success btn-lg" type="button" id="billDownloadWX">
                <i class="icon-download"></i>&nbsp;微信支付账单下载
            </button>

            <!-- 钱盒账单打包下载 -->
            <button class="btn btn-info btn-lg" type="button" id="billDownloadZFB">
                <i class="icon-download"></i>&nbsp;支付宝账单下载
            </button>
        </div>
    </div>
</form>