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

</form>