<table class="hfa">
<tbody>
<%
_.each(data, function (item) {
%>
<tr>
    <td class="text-left"><%=Opf.String.replaceYMD(item.date, 'MM日DD月')%></td>
    <td class="text-right"><%= Opf.currencyFormatter(item.amt) %> 元</td>
</tr>
<%
});
%>
</tbody>
</table>