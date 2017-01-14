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

<div class="unrepair-amt">
    <div class="header">
        <div class="reason">
            <span>补账描述：</span>
            <%= item.repairDesc %>
        </div>
        <div class="result">
            <span>处理结果：</span>
            <%= RESULT_FLAG_MAP[item.resultFlag] %>
        </div>
        <div class="discription">
            <span>处理描述：</span>
            <%= item.nextDo %>
        </div>
    </div>
    <div class="body">
        <table class="opf-table">
        <tbody>
        <tr>
            <td><%= Opf.String.replaceYMD(item.repairDate, '$2月$3日') %>补账</td>
            <td><%= Opf.currencyFormatter(item.repairAmt) %> 元</td>
        </tr>
        <tr>
            <td>已补金额</td>
            <td><%= Opf.currencyFormatter(item.nowAmt) %> 元</td>
        </tr>
        </tbody>
        </table>

    </div>

</div>

<%
});
%>
</div>