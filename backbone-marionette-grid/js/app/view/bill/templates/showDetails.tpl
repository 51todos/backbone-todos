<div class="bill-details-container">
    <div class="header">
        <table class="opf-table">
            <tbody>
                <tr>
                    <td>交易金额</td>
                    <td>RMB <%= Opf.currencyFormatter(txAmt) %> </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="body">
        <table class="opf-table">
            <tbody>
                <tr>
                    <td>清算金额</td>
                    <td><%= settleAmt  %></td>
                </tr>
                <tr>
                    <td>手续费</td>
                    <td><%= feeAmt %></td>
                </tr>
                <tr>
                    <td>终端号</td>
                    <td><%= terminalNo %></td>
                </tr>
                <tr>
                    <td>消费卡号</td>
                    <td><%= acNo %></td>
                </tr>
                <tr>
                    <td>凭证号</td>
                    <td><%= traceNo %></td>
                </tr>
                <tr>
                    <td>日期/时间</td>
                    <td><%=moment(''+date+time, 'YYYYMMDDHHmmss').format('YYYY/MM/DD HH:mm:ss') %></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>