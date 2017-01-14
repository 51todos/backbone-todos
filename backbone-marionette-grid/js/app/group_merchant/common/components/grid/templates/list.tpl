<% if(items.length==0){ %>
    <tr><td colspan="100"><h4 class="text-muted text-center">暂无数据</h4></td></tr>
<% } else {
    _.each(items, function(item, idx){
        var k, i;
%>
    <tr data-id="<%= item.id=(item.id||idx)%>">
        <%
        for(k=0; k<colModel.length; k++) {
            var model = colModel[k];
            if(model.checkable) {
        %>
            <td>
                <input type="checkbox">
            </td>
        <%
            } else if(model.hidden) {
        %>
                <td hidden>
                    <span data-field="<%= model.name%>"><%= item[model.name] %></span>
                </td>
        <%
            } else {
         %>
                <td>
                    <span data-field="<%= model.name%>">
                        <%= _.isFunction(model.formatter)? model.formatter(item[model.name], item):item[model.name] %>
                    </span>
                </td>
        <% }} %>

        <% if(colAction.length>0) { %>
        <td>
        <%
        for(i = 0; i<colAction.length; i++) {
            var actionItem = colAction[i];
            var actionName = actionItem.name||i;

            if(_.isBoolean(actionItem)) { continue; }

            if(colActionConf && colActionConf[actionName]===false) { continue; }

            if(_.isFunction(colActionConf.canRender)) {
                var canRender = colActionConf.canRender.call(null, actionName, item);
                if(!canRender) { continue; }
            }
        %>
            <a href="javascript:;" data-name="<%= actionName%>"><%= actionItem.text %></a>
        <% } %>
        </td>
        <% } %>
    </tr>
<% })} %>