<%
    var RESULT_FLAG_MAP = {
        '0' : '参入清算后已纳入清算',
        '1' : '处理后参加清算',
        '2' : '处理后挂账',
        '3' : '处理后用于退货',
        '7' : '补账完毕',
        '8' : '补账中',
        '9' : '未处理'
    }
%>
<div>
<%
_.each(data, function(item){
%>

<div class="stlm-repair-list">
    <div class="header">
        <div class="reason">
            <span>资金截留原因：</span>
            <%= Opf.String.replaceYMD(item.repairDate, 'M月D日') %>
            <%= item.repairDesc %>
        </div>
        <div class="result">
            <span>处理结果：</span>
            <%= RESULT_FLAG_MAP[item.resultFlag] %>
        </div>
    </div>
    <div class="body">
        <table class="opf-table">
        <tbody>
        <tr>
            <td>计划截留</td>
            <td><%= Opf.currencyFormatter(item.repairAmt) %> 元</td>
        </tr>
        <tr>
            <td>已经截留</td>
            <td><%= Opf.currencyFormatter(item.nowAmt) %> 元</td>
        </tr>
        <tr>
            <td><%= Opf.String.replaceYMD(item.settleDate, 'M月D日') %>截留</td>
            <td><%= Opf.currencyFormatter(item.curRepairAmt) %> 元</td>
        </tr>
        <% 
            if(item.repairTxns.length > 0){
        %>

        <table class="opf-table repair-history">
            <caption>截留历史</caption>
                <%
                _.each(item.repairTxns, function(txn){
                %>
                <tr>
                    <td><%= Opf.String.replaceFullDate(txn.time, '$1年$2月$3日$4时$5分$6秒') %>截留</td>
                    <td><%= Opf.currencyFormatter(txn.amt) %> 元</td>
                </tr>
                <%
                    });
                %>
        </table>
        <% 
            }
        %>
        </tbody>
        </table>

    </div>

</div>

<%
});
%>
</div>