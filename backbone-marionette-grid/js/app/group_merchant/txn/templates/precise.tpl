<form name="gridForm_search" class="form-horizontal">

        <!-- 流水号 -->
        <div class="form-group">
            <label class="control-label col-sm-2 col-lg-2">流水号</label>
            <div class="col-sm-6 col-lg-4">
                <input name="traceNo" class="form-control">
            </div>
        </div>

        <!-- 交易卡号 -->
        <div class="form-group">
            <label class="control-label col-sm-2 col-lg-2">交易卡号</label>
            <div class="col-sm-6 col-lg-4">
                <div class="row">
                    <div class="col-xs-6"><input class="head form-control" name="acNoHead" maxlength="6" placeholder="前6位"></div>
                    <div class="col-xs-1" style="padding:0;line-height: 34px;"><span class="dot" style="display: block;text-align: center;">****</span></div>
                    <div class="col-xs-5"><input class="tail form-control" name="acNoTail" maxlength="4" placeholder="后4位"/></div>
                </div>
            </div>
        </div>

</form>