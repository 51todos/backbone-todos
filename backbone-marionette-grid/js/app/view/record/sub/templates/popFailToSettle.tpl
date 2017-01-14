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
            <td>入账失败日期</td>
            <td><%=moment(''+item.inDate, 'YYYYMMDD').format('YYYY年MM月DD日') %></td>
        </tr>

        <tr>
            <td>清算金额</td>
            <td><%= Opf.currencyFormatter(item.settleAmt) %> 元</td>
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