<form name="gridForm_search" class="component-dialog-container form-horizontal">
    <!-- 筛选分组 -->
    <div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">筛选分组</label>
        <div class="col-sm-6 col-lg-4">
            <select name="groupId" class="form-control"></select>
        </div>
    </div>

    <!-- 交易门店 -->
    <div class="form-group">
        <label class="control-label col-sm-2 col-lg-2">门店地址</label>
        <div class="col-sm-10 col-lg-10">
            <div class="inline-block" data-type="provinceCityArea" name="areaNo"></div>

            <input name="address" class="form-control form-control-inline" placeholder="详细地址">
        </div>
    </div>
</form>