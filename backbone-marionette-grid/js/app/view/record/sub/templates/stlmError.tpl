<%
_.each(data, function(item){
%>

<div class="opf-info-block">
    <div class="header">
        <%=helpers.getHead(item)%>
    </div>
    <div class="body">
        <table class="list hfa">
        <tbody>
        <tr>
            <td>交易时间</td>
            <td><%=moment(''+item.txDate+item.txTime, 'YYYYMMDDHHmmss').format('YYYY年MM日DD月 HH:mm') %></td>
        </tr>
        <tr>
            <td>消费卡号</td>
            <td><%=item.acNo%></td>
        </tr>
        <tr>
            <td>平台流水</td>
            <td><%=item.traceNo%></td>
        </tr>
        <tr>
            <td>交易金额</td>
            <td><%= Opf.currencyFormatter(item.txAmt) %> 元</td>
        </tr>
        </tbody>
        </table>
    </div>
    <div class="inner">
        <div class="separator"></div>
    </div>
    <div class="foot">
        <%=helpers.getFoot(item)%>
    </div>
</div>

<%
});
%>