<%
    var settleDtlMap = resp.settleDtlMap||[];
    var repairInfoMap = resp.repairInfoMap||{};
    var listerr = resp.listerr||[];

    var settleDtlConf = detailsConf.settleDtlConf;

    var formatUtil = Opf.Util.Format;
%>

<div class="region-pagebar">
    <div class="row">
        <div class="col-xs-8">
            <h3 style="margin-bottom: 0;">
                <%= caption||""%><%= row.settleDate? "("+ formatUtil.dateFormatter(row.settleDate) +")：":""%>
                <span class="text-color-blue"><%= row.mchtName%></span>
            </h3>
        </div>
        <div class="col-xs-4" style="text-align: right;">
            <div class="region-toolbar"></div>
        </div>
    </div>
</div>

<hr>

<!-- 结算详情 -->
<dl class="dl-horizontal" style="font-family: 'Microsoft Yahei';">
<%
    var settleDtlData = settleDtlMap[0];
    _.each(settleDtlConf, function(itemConf) {
%>
        <dt class="text-muted" style="font-size: 0.9em;"><%= itemConf.label%></dt>
        <dd style="width: 50%; padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid #EEE;"><%= itemConf.formatter? itemConf.formatter(settleDtlData[itemConf.key]):settleDtlData[itemConf.key]%></dd>
<%
    });
%>
</dl>

<% if(!_.isEmpty(listerr)) { %>
<!-- 异常交易 -->
<div class="panel panel-warning">
    <div class="panel-heading">
        <h4>异常交易</h4>
    </div>
    <div class="panel-body table-responsive">
        <table class="table table-condensed table-hover">
            <thead>
                <tr>
                    <th>交易时间</th>
                    <th>交易类型</th>
                    <th>结算周期</th>
                    <th>参考号</th>
                    <th>交易卡号</th>
                    <th>异常原因</th>
                    <th>处理结果</th>
                    <th>交易金额</th>
                </tr>
            </thead>
            <tbody>
            <%
                _.each(listerr, function(item){
            %>
                <tr>
                    <td><%= item.txTime%></td>
                    <td><%= formatUtil.txTypeFormatter(item.txType)%></td>
                    <td><%= formatUtil.cycleFormatter(item.cycle)%></td>
                    <td><%= item.vocheNo%></td>
                    <td><%= item.acNo%></td>
                    <td><%= formatUtil.errReasonFormatter(item.errReason)%></td>
                    <td><%= formatUtil.nextDoFormatter(item.nextDo)%></td>
                    <td><%= formatUtil.amtFormatter(item.txAmt)%></td>
                </tr>
            <% }) %>
            </tbody>
        </table>
    </div>
</div>
<% } %>

<% if(!_.isEmpty(repairInfoMap)) { %>
<!-- 资金截留 -->
<div class="panel panel-danger">
    <div class="panel-heading">
        <h4>资金截留</h4>
    </div>
    <div class="panel-body table-responsive">
        <table class="table table-condensed table-hover">
            <thead>
            <tr>
                <th>截留总金额</th>
                <th>待截留金额</th>
                <th>已截留金额</th>
                <th>本次截留金额</th>
                <th>本次解冻金额</th>
                <th>已解冻金额</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><%= formatUtil.amtFormatter(repairInfoMap.repairAmt)%></td>
                <td><%= formatUtil.amtFormatter(repairInfoMap.unRepairAmt)%></td>
                <td><%= formatUtil.amtFormatter(repairInfoMap.repairdeAmt)%></td>
                <td><%= formatUtil.amtFormatter(repairInfoMap.repairingAmt)%></td>
                <td><%= formatUtil.amtFormatter(repairInfoMap.unFreezeingAmt)%></td>
                <td><%= formatUtil.amtFormatter(repairInfoMap.unFreezeSum)%></td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
<% } %>
