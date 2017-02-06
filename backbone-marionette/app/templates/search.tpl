<form onsubmit="return false;" class="form-inline">
    <h1>backbone marionette</h1>

    <hr class="clearfix">

    <!-- name -->
    <div class="form-group">
        <div class="input-group">
            <div class="input-group-addon">Name</div>
            <input type="text" class="form-control" name="name">
        </div>
    </div>

    <!-- sex -->
    <div class="form-group">
        <div class="input-group">
            <div class="input-group-addon">Sex</div>
            <input type="text" class="form-control" name="sex">
        </div>
    </div>

    <!-- Email -->
    <div class="form-group">
        <div class="input-group">
            <div class="input-group-addon">Email</div>
            <input class="form-control" type="email" name="email">
        </div>
    </div>

    <hr class="clearfix">

    <button type="button" class="btn btn-primary" id="J_add-item">
        <i class="glyphicon-plus"></i> 新增
    </button>
</form>

<hr class="clearfix">

<div class="radio">
    <label>
        <input type="checkbox" id="J_checkedAll" name="checkedAll"> 全选
    </label>
    <label>
        <input type="checkbox" id="J_checkedSome" name="checkedSome"> 反选
    </label>
</div>
