<ul class="nav nav-pills" id="main-tabs">
    <%
    _.each(config, function (item) {
    %>
    <li>
        <a href="#<%=item.id%>" 
            data-toggle="tab" 
            name="<%=item.name%>" 
            class="<%=item.cls||item.id%>">
            <%=item.txt%>
        </a>
    </li>
    <%
    });
    %>
</ul>