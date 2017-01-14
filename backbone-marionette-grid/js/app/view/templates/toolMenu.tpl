<!-- 用户下拉列表 -->
<li class="light-blue">
    <a data-toggle="dropdown" href="#" class="dropdown-toggle">
        <span class="username"></span>
        <i class="icon-caret-down"></i>
    </a>

    <ul class="pull-right dropdown-menu dropdown-yellow2 dropdown-caret dropdown-close">
        <%
        _.each(items, function (item) {
            if(item === "-") {
        %>
            <li class="divider"></li>
        <% } else { %>
            <li>
                <a href="javascript:void(0);" id="<%=item.id%>">
                    <i class="<%=item.icon%>"></i>
                    <%=item.text%>
                </a>
            </li>
        <% }}) %>
    </ul>
</li>
