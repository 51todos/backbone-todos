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

    <div class="upper-amt">

        <div class="body">
            <table class="opf-table">
            <tbody>
            <tr>
                <td>结算失败时间</td>
                <td><%=Opf.String.replaceYMD(data.inDate,'YYYY年M月D日') %></td>
            </tr>
            <tr class="tx-amt">
                <td>应结金额</td>
                <td><%= Opf.currencyFormatter(data.settleAmt) %>元</td>
            </tr>
            </tbody>
            </table>
        </div>
        <div class="foot">
            <%
                if(data.retMsg) {
            %>
                <div class="failReason">
                    <span>结算失败原因：</span><%= data.retMsg %>
                </div>
            <%
                }
            %>
            <%
                if(data.doFlag) {
            %>
                <div class="opResult">
                    <span>处理结果：</span><%= RESULT_FLAG[data.doFlag] %>
                </div>
            <%
                }
            %>
        </div>
    </div>

</div>