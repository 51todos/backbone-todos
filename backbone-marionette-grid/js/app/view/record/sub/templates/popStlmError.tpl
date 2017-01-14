<%
    var ERROR_TYPE = {
        '1': '对账不平',
        '2': '风控拦截延迟清算',
        '3': '手工延迟清算',
        '4': '商户不正常延迟清算'
    };

    var RESULT_FLAG = {
        '0': '工作人员已处理，且款项已清算。',
        '1': '工作人员已处理，即将参与清算。',
        '2': '已作退货处理。',
        '3': '已向银行请款。',
        '4': '已挂账。',
        '5': '已作退货处理。',
        '9': '工作人员即将处理。'
    };
%>
<div>
<%
_.each(data, function(item){
%>

<div class="stlm-error-list">

    <div class="header">
        <table class="opf-table">
            <tbody>
                <tr>
                    <td>交易金额</td>
                    <td>RMB <%= Opf.currencyFormatter(item.txAmt) %> </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="body">
        <table class="opf-table">
        <tbody>
        <tr>
            <td>商户名</td>
            <td><%=item.mchtName%></td>
        </tr>
        <tr>
            <td>终端号</td>
            <td><%= item.terminal %></td>
        </tr>
        <tr>
            <td>卡号</td>
            <td><%=item.acNo%></td>
        </tr>
        <tr>
            <td>交易类别</td>
            <td><%=item.txName%></td>
        </tr>
        <tr>
            <td>凭证号</td>
            <td><%=item.traceNo%></td>
        </tr>
        <tr>
            <td>日期/时间</td>
            <td><%=moment(''+item.txDate+item.txTime, 'YYYYMMDDHHmmss').format('YYYY/MM/DD HH:mm:ss') %></td>
        </tr>
        </tbody>
        </table>
    </div>

    <div class="foot">
        <%
            if(item.errType) {
        %>
            <div class="failReason">
                <span>异常原因：</span><%= ERROR_TYPE[item.errType] %>
            </div>
        <%
            }
        %>
        <%
            if(item.resultFlag) {
        %>
            <div class="opResult">
                <span>处理结果：</span><%= RESULT_FLAG[item.resultFlag] %>
            </div>
        <%
            }
        %>
    </div>
</div>

<%
});
%>
</div>