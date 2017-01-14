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
            <td>计划截留金额</td>
            <td><%= Opf.currencyFormatter(item.repairAmt) %> 元</td>
        </tr>
        <tr>
            <td>目前已截留金额</td>
            <td><%= Opf.currencyFormatter(item.nowAmt) %> 元</td>
        </tr>
        <% 
            if(item.settleDate){
        %>
        <tr>
            <td><%= Opf.String.replaceYMD(item.settleDate, '$2月$3日') %>截留金额</td>
            <td><%= Opf.currencyFormatter(item.curRepairAmt) %> 元</td>
        </tr>
        <% 
            }
        %>
        <tr class="pointer js-view-history" repairId=<%=item.id%>>
            <td class="blue-font">
                <i style="margin-right:4px;" class="icon icon-eye-open"></i>查看调账历史
            </td>
            <td></td>
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