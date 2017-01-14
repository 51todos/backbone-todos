<%
    var STAT_DATA_MAP = {
        total: {
            bg: 'bg-info',
            color: 'text-color-blue',
            text: '成功交易笔数'
        },
        totalAmt: {
            bg: 'bg-success',
            color: 'text-color-green',
            text: '成功交易金额'
        },
        totalFeeAmt: {
            bg: 'bg-info',
            color: 'text-color-blue',
            text: '手续费'
        },
        totalFreeFeeAmt: {
            bg: 'bg-danger',
            color: 'text-color-brown',
            text: '手续费减免'
        },
        totalSettleAmt: {
            bg: 'bg-success',
            color: 'text-color-green',
            text: '应结总额'
        },
        settleAmt: {
            bg: 'bg-info',
            color: 'text-color-blue',
            text: '结算金额'
        },
        waitingSettleAmt: {
            bg: 'bg-danger',
            color: 'text-color-brown',
            text: '待结算金额'
        }
    };
    var statDataMap = statData.statDataMap;
    var statDataArr = _.keys(statDataMap);
    var cols = 12/statDataArr.length;
%>
<div class="statDataMap clearfix">
    <% _.each(statDataMap, function(v, k) {
        var item = STAT_DATA_MAP[k];
    %>
        <div class="col-xs-<%=cols%> <%= item.bg%>">
            <h3 class="<%= item.color%>">
                <%
                    var value;
                    if(/.*(Amt)$/.test(k)) {
                        value = Opf.Util.Format.amtFormatter(v);
                    } else {
                        value = v;
                    }
                %>
                <%= value? value:"0"%>
            </h3>
            <h5 class="text-color"><%= item.text%></h5>
        </div>
    <% }) %>
</div>
