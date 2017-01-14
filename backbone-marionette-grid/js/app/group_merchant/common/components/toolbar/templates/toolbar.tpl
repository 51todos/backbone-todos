<!-- toolbar:工具条 -->
<%
    var pageable = toolbarConf.pageable;

    _.each(toolbar, function(item) {
        if(_.isArray(item)) {
%>
            <div class="btn-group" role="group">
                <%= tplFn({tplFn: tplFn, toolbar: item, toolbarConf: toolbarConf})%>
            </div>
<%
        } else {
            var btnCls = item.btnCls||"default";

            if(_.isArray(item.items)) {
%>
                <!-- Split button -->
                <div class="btn-group">
                    <button class="btn <%= btnCls%> <%= pageable? 'btn-lg':''%>" type="button">
                        <i class="icon <%= item.iconCls%>"></i>&nbsp;<%= item.text%>
                    </button>
                    <button type="button" class="btn dropdown-toggle <%= btnCls%> <%= pageable? 'btn-lg':''%>" data-toggle="dropdown" name="<%= item.name||''%>">
                        <span class="caret"></span>
                        <span class="sr-only"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-caret">
                        <% _.each(item.items, function(_item){
                            if(_item.ajax) { return; }
                            else if(_item == "-") {
                        %>
                            <li class="divider"></li>
                        <% } else { %>
                            <li><a href="javascript:void(0);" data-value="<%= _item.value||''%>"><%= _item.name%></a></li>
                        <%}}) %>
                    </ul>
                </div>
        <% } else { %>
                <!-- toolbar:<%= item.type||"button"%> -->
                <button class="btn <%= btnCls%> <%= pageable? 'btn-lg':''%>" type="button" name="<%= item.name||''%>">
                    <i class="icon <%= item.iconCls%>"></i>&nbsp;<%= item.text%>
                </button>
        <% }} %>
<% }) %>
