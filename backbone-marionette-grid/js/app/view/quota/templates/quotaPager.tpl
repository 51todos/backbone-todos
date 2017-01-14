<%
    var currentPage = parseInt(page.number);
    var totalPages = parseInt(page.totalPages);
    var hasFirstPage = !page.firstPage ? "" : "disabled";
    var hasLastPage = !page.lastPage ? "" : "disabled";
    var hasPrePage = currentPage>0 ? "" : "disabled";
    var hasNextPage = currentPage != totalPages-1 ? "" : "disabled";
%>
<% if(page.totalElements!=0) { %>
<tr>
    <td class="pager-container" colspan="13">
        <style type="text/css">
            .pager-container { padding: 0; }
            .pager-container li { list-style: none; display: inline-block; margin:0; }
        </style>
        <ul class="pager-container btn-groups text-center">
            <li class="first-page"><a class="btn btn-default <%= hasFirstPage %>" data-number="0" href="javascript: void 0">首页</a></li>
            <li class="previous-page"><a class="btn btn-default <%= hasPrePage %>" data-number="<%= currentPage-1 %>" href="javascript: void 0">上一页</a></li>
            <li class="next-page"><a class="btn btn-default <%= hasNextPage %>" data-number="<%= currentPage+1 %>" href="javascript: void 0">下一页</a></li>
            <li class="last-page"><a class="btn btn-default <%= hasLastPage %>" data-number="<%= totalPages-1 %>" href="javascript: void 0">尾页</a></li>
        </ul>
    </td>
</tr>
<% } %>