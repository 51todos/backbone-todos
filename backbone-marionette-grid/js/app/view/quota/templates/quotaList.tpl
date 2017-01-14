<% if(items.length==0){ %>
        <tr><td colspan="13"><h4 class="text-muted text-center">暂无数据</h4></td></tr>
<% } else {
        _.each(items, function(item, idx){
%>
            <tr>
                <td><%= item.box %></td>
                <td><%= item.t1DailyAmount %></td>
                <td><%= item.t1TradeAmountOfDebitCard %></td>
                <td><%= item.t1TradeAmountOfCreditCard %></td>
                <td><%= item.t0DailyAmount %></td>
                <td><%= item.t0TradeAmountOfDebitCard %></td>
                <td><%= item.t0TradeAmountOfCreditCard %></td>
                <td><%= item.weixinDailyAmount %></td>
                <td><%= item.weixinSingleAmount %></td>
                <td><%= item.alipayDailyAmount %></td>
                <td><%= item.alipaySingleAmount %></td>
                <td><%= item.wsDailyAmount %></td>
                <td><%= item.wsSingleAmount %></td>
            </tr>
<%
        });
    }
%>