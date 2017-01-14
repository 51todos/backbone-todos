<%
    var DISC_CYCLE_MAP = {
        "0": "T+0",
        "1": "T+1",
        "s0": "S+0"
    };

    var formattedTime = moment(time,"HHmmss").format("HH:mm:ss");
%>

<!-- 交易日期 -->
<td><%= formattedTime %></td>

<!-- 凭证号 -->
<td class="trace-no-col text-left"><%= traceNo %></td>

<!-- 支付方式 -->
<td class="paymentMethod-col text-left"><%= paymentMethod%></td>

<!-- 结算周期 -->
<td class="discCycle-col text-left"><%= DISC_CYCLE_MAP[discCycle]||"" %></td>

<!-- 交易本金 -->
<td class="text-color-green">
    + <%= Opf.Number.currency(txAmt,2,'¥','','.',false) %>
</td>

<!-- 手续费 -->
<td class="text-color-brown">
    - <%= Opf.Number.currency(feeAmt,2,'¥','','.',false) %>
</td>

<!-- 减免金额 -->
<td class="text-color-blue">
    - <%= Opf.Number.currency(freeAmt,2,'¥','','.',false) %>
</td>

<!-- 结算金额 -->
<td class="settleamt-col text-right">
    <%= Opf.Number.currency(settleAmt,2,'¥','','.',false) %>
</td>