<%
    var SUBCODE_MAP = {
        '30': '余额查询',
        '31': '消费',
        '32': '消费冲正',
        '33': '消费撤销',
        '34': '消费撤销冲正',
        '35': '退货',
        '50': '余额查询',
        '51': '消费',
        '52': '消费冲正',
        '53': '消费撤销',
        '54': '消费撤销冲正',
        '55': '退货'
    },
    errStr = errStr || "";
    
%>
<div class="txn-details-container">
        <!--
        <a id="showSPO" style="margin:0px 0px 10px 400px;color=blue;text-decoration:none;cursor:pointer;font-size:0.9em;font-weight:bold;">
            查看签购单
        </a>-->
        <div class="header">
            <table class="opf-table">
                <tbody>
                    <tr>
                        <td>交易金额</td>
                        <td>RMB <%= Opf.currencyFormatter(amt) %> </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="body">
            <table class="opf-table">
                <tbody>
                    <tr>
                        <td>商户名</td>
                        <td><%= mchtName %></td>
                    </tr>
                    <tr>
                        <td>终端号</td>
                        <td><%= iboxNo %></td>
                    </tr>
                    <tr>
                        <td>卡号</td>
                        <td><%= acNo %></td>
                    </tr>
                    <tr>
                        <td>交易类别</td>
                        <td><%= SUBCODE_MAP[subCode] %></td>
                    </tr>
                    <tr>
                        <td>凭证号</td>
                        <td><%= traceNo %></td>
                    </tr>
                    <tr>
                        <td>日期/时间</td>
                        <td><%= Opf.String.replaceFullDate('' + date + time, '$1/$2/$3  $4:$5:$6') %></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <%
        if(fdxxx){
            if(stat == '4'){
        %>
            <div class="foot fdxxx" style="color:red">
            <%
            }else{
            %>
            <div class="foot fdxxx" style="color:black">
            <%
            }
            %>
                <%
                    if(Ctx.enableShowErrorStringInVoucher){
                %>
                <div><span>错误描述：</span><%= fdxxx %></div>
                <div><span>失败原因：</span><%= errStr %></div>
                <%
                } else {
                %>
                <div><span>失败原因：</span><%= fdxxx %></div>
                <%
                }
                %>
            </div>
        <%
        }
        %>

        <div class="unit-inner signature">
            <%
            if(signature && false){  
            %>
            <div class="endorse">持卡人签名</div>
            <img src="<%= signature %>">
            <%
            }
            %>
        </div>
</div>
</div>