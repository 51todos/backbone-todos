<div class="bill-container">
  <div class="bill-header clearfix">

        <button type="button" class="btn btn-default date-select btn-opf">选择对账日期</button>

        <!-- <select hidden class="terminal-select local-selection invisible-in-xs"><option value="all">全部终端</option></select> -->

        <div hidden class="terminal-select dropdown">
            <button type="button" class="btn btn-default btn-opf" data-toggle= "dropdown">
            <span class="selected-terminal">所有终端</span>
            <span class="icon-caret-down"></span>
            </button>
            <ul class="dropdown-menu" style="text-align: left;">
              <li><a href="javascript:void(0);" value= 'all' >所有终端</a></li>
            </ul>
        </div>

        <div hidden class="pull-left clearfix remote-tn-sel-sitter">
            
        </div>


        <span class="bill-title invisible-in-sm">对账信息</span>
        <div hidden class="pull-right complex-download">
            <!--<button type="button" class="btn  btn-download btn-sm pull-right" data-toggle= "dropdown" id="vendor-download">
            <i class="icon icon-download"></i><span class="text">下载<span class="invisible-in-xs">完整对账单</span></span>
            </button>
            <ul class="dropdown-menu download-menu list-download">
              <li>
                <a id="excel-dl" href="#">交易流水对账单(Excel)</a> 
              </li>
                <li>
                  <a id="txt-dl" href="#">交易流水对账单(txt)</a>
                </li>
              <li>
                <a id="dateSettle-dl" href="#">日结对账单(Excel)</a>
              </li>
            </ul>-->
        </div>
        <div class="clearfix"></div>
        <div class="date-picker-sit"></div>
  </div>
  <div class="unit-inner summary clearfix">
      <div class="row" style="padding: 0;">
          <div class="col-xs-3 border-color-blue">
              <div class="tx-count text-color-blue"></div>
              <div class="tx-count-text">交易数</div>
          </div>
          <div class="col-xs-3 border-color-green">
              <div class="total-amt text-color-green"></div>
              <div class="total-amt-text">交易金额</div>
          </div>
          <div class="col-xs-3 border-color-brown">
              <div class="total-feeamt text-color-brown"></div>
              <div class="total-feeamt-text">手续费</div>
          </div>
          <div class="col-xs-3 border-color-blue">
              <div class="total-freeAmt text-color-blue"></div>
              <div class="total-freeAmt-text">减免金额</div>
          </div>
      </div>
  </div>
    <div class="days-bill">
        <!-- 数据列表 -->
    </div>
    <div class="bill-no-data">
        <span class="opf-icon-search"></span>
        <div class="info-container">
            <span class="main-info">无对账信息</span>
            <span class="suggest-info">对账信息在交易发生后的第二个工作日即可看见</span>
        </div>
    </div>
    <div class="foot">
        <ul class="opf-pager pager out-pager">
            <li class="previous disabled">
                <a href="#">上一页</a>
            </li>
            <li class="page-info">
                <span class="text"></span>
            </li>
            <li class="next disabled">
                <a href="#">下一页</a>
            </li>
        </ul>
    </div>
</div>
