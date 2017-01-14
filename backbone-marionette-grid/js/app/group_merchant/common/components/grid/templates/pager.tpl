<%
    var thePage = parseInt(page.number);
    var currentPage = thePage+1;
    var totalPages = parseInt(page.totalPages);
    var hasFirstPage = !page.firstPage ? "" : "disabled";
    var hasLastPage = !page.lastPage ? "" : "disabled";
    var hasPrePage = thePage>0 ? "" : "disabled";
    var hasNextPage = thePage < totalPages-1 ? "" : "disabled";
%>
<% if(page.totalElements!=0) { %>
<tr>
    <td class="pager-container" colspan="50">
        <ul class="pager-container btn-groups text-center">
            <li class="first-page">
                <a class="btn btn-default <%= hasFirstPage %>" data-number="0" href="javascript: void 0">
                    <i class="glyphicon glyphicon-step-backward"></i>&nbsp;首页
                </a>
            </li>
            <li class="previous-page">
                <a class="btn btn-default <%= hasPrePage %>" data-number="<%= thePage-1 %>" href="javascript: void 0">
                    <i class="glyphicon glyphicon-chevron-left"></i>&nbsp;上一页
                </a>
            </li>
            <li>
                <span class="label label-default"><%= currentPage%></span>
                /
                <span class="label label-default"><%= totalPages%></span>
            </li>
            <li class="next-page">
                <a class="btn btn-default <%= hasNextPage %>" data-number="<%= thePage+1 %>" href="javascript: void 0">
                    下一页&nbsp;<i class="glyphicon glyphicon-chevron-right"></i>
                </a>
            </li>
            <li class="last-page">
                <a class="btn btn-default <%= hasLastPage %>" data-number="<%= totalPages-1 %>" href="javascript: void 0">
                    尾页&nbsp;<i class="glyphicon glyphicon-step-forward"></i>
                </a>
            </li>
        </ul>
    </td>
</tr>
<% } %>