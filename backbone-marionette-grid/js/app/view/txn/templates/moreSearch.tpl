<!-- more search -->
<form class="search-form" onsubmit="return false;">
    <div class="ibx-container">
        <div class="row">
            <div class="col-xs-3">
                <label for="date" class="form-label">交易日期：</label>
            </div>
            <div class="col-xs-7">
                <input class="date-trigger form-control" id="date" name="date" readonly="readonly" />
                <div class="date-picker-sit"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-3">
                <label for="tradeType" class="form-label">交易类型：</label>
            </div>
            <div class="col-xs-7">
                <select type="text" id="tradeType" name="tradeType" class="form-control">
                    <option style="display:none;" class="placeholder" selected disabled>请选择交易类型</option>
                    <option value="0">消费-成功</option>
                    <option value="1">消费-失败</option>
                    <option value="2">消费-已撤消</option>
                    <option value="3">消费-已冲正</option>
                    <option value="4">余额查询</option>
                </select>
            </div>
            <div class="col-xs-2">
                <a href="javascript:void(0);" class="btn btn-link reset tradeType" style="margin-left:-20px;">重置</a>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-3">
                <label for="discCycle" class="form-label">结算周期：</label>
            </div>
            <div class="col-xs-7">
                <select type="text" id="discCycle" name="discCycle" class="form-control">
                    <option style="display:none;" class="placeholder" selected disabled>请选择结算周期</option>
                    <option value="0">T+0</option>
                    <option value="1">T+1</option>
                    <option value="s0">S+0</option>
                </select>
            </div>
            <div class="col-xs-2">
                <a href="javascript:void(0);" class="btn btn-link reset" style="margin-left:-20px;">重置</a>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-3">
                <label for="iboxNo" class="form-label">SN号：</label>
            </div>
            <div class="col-xs-7">
                <input id="iboxNo" name="iboxNo" maxlength="15" class="form-control">
            </div>
        </div>
        <div class="row">
            <div class="col-xs-3">
                <label class="form-label">交易卡号：</label>
            </div>
            <div class="col-xs-7">
                <div class="row">
                    <div class="col-xs-5"><input class="head form-control" name="acNoHead" maxlength="6" placeholder="前6位"></div>
                    <div class="col-xs-2" style="padding:0;line-height: 34px;"><span class="dot" style="display: block;text-align: center;">****</span></div>
                    <div class="col-xs-5"><input class="tail form-control" name="acNoTail" maxlength="4" placeholder="后4位"/></div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-3">
                <label for="paymentMethod" class="form-label">支付方式：</label>
            </div>
            <div class="col-xs-7">
                <select id="paymentMethod" name="paymentMethod" class="form-control">
                    <option value="200">所有</option>
                    <option value="201">刷卡支付</option>
                    <option value="202">微信支付</option>
                    <option value="203">支付宝支付</option>
                </select>
            </div>
        </div>
    </div>
</form>