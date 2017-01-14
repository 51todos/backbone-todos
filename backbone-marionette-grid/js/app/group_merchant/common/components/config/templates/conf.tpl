
<form name="gridForm_<%= showType||'custom'%>" class="component-dialog-container form-horizontal">
    <% if(_.isObject(contentConf)) {
        var colNames = contentConf.colNames;
        var colModel = contentConf.colModel;

        var searchableItems = _.filter(colModel, function(item){ return item.searchable === true; });
        var addableItems = _.filter(colModel, function(item){ return item.addable === true; });
        var editableItems = _.filter(colModel, function(item){ return item.editable === true; });
        var viewableItems = _.filter(colModel, function(item){ return item.viewable === true; });

        if(showType == "add" || showType == "edit") {
            editableItems = showType=="add"? addableItems:editableItems;
            for(var i=0; i<editableItems.length; i++) {
            var eItem = editableItems[i];
            var eOpts = eItem.editOption||{};
        %>
        <div class="form-group">
            <label for="<%= eItem.name%>" class="control-label col-sm-2 col-lg-2"><%= colNames[eItem.name]%></label>
            <div class="col-sm-6 col-lg-6">
                <% switch(eItem.type) {
                    case 'select':
                %>
                    <select id="<%= eItem.name%>" class="form-control" name="<%= eItem.name%>">
                        <% _.each(eOpts.value, function(v, k) { %>
                        <option value="<%= k%>"><%= v%></option>
                        <% }); %>
                    </select>

                <%  break;
                    case 'password':
                    case 'ajaxSelect':
                    case 'datepicker':
                    case 'daterangepicker':
                        var iconCls = /^date/i.test(eItem.type)? 'glyphicon glyphicon-calendar fa fa-calendar':
                            /password/i.test(eItem.type)? 'icon-lock':"";
                %>
                    <input id="<%= eItem.name%>" class="form-control components_<%= eItem.type%>" type="text" name="<%= eItem.name%>" data-type="<%= eItem.type%>">
                    <i class="<%= iconCls%> img-datepicker"></i>

                <%  break;
                    case 'text':
                    default:
                %>
                    <input id="<%= eItem.name%>" class="form-control" type="text" name="<%= eItem.name%>">
                    <% break; %>
                <% } %>
            </div>
            <% if(eOpts.tips) { %>
            <div class="col-sm-4">
                <div class="control-label" style="text-align: left;">
                    <i class="glyphicon glyphicon-info-sign text-color-brown"></i>
                    <span class="text-grey"><%= eOpts.tips%></span>
                </div>
            </div>
            <% } %>
        </div>

        <% }} else if(showType == "search") {
            for(var i=0; i<searchableItems.length; i++) {
            var sItem = searchableItems[i];
            var sOpts = sItem.searchOption||{};
        %>
        <div class="form-group">
            <label for="<%= sItem.name%>" class="control-label col-sm-2 col-lg-2"><%= colNames[sItem.name]%></label>
            <div class="col-sm-6 col-lg-4">
                <% switch(sItem.type) {
                    case 'select':
                %>
                    <select id="<%= sItem.name%>" class="form-control" name="<%= sItem.name%>">
                        <% _.each(sOpts.value, function(v, k) { %>
                        <option value="<%= k%>"><%= v%></option>
                        <% }); %>
                    </select>

                <%  break;
                    case 'ajaxSelect':
                    case 'datepicker':
                    case 'daterangepicker':
                        var iconCls = /^date/i.test(sItem.type)? 'glyphicon glyphicon-calendar fa fa-calendar':
                            /password/i.test(sItem.type)? 'icon-lock':"";
                %>
                    <input id="<%= sItem.name%>" class="form-control components_<%= sItem.type%>" type="text" name="<%= sItem.name%>" data-type="<%= sItem.type%>">
                    <i class="<%= iconCls%> img-datepicker"></i>

                <%  break;
                    case 'text':
                    default:
                %>
                    <input id="<%= sItem.name%>" class="form-control" type="text" name="<%= sItem.name%>">
                    <% break; %>
                <% } %>
            </div>
            <% if(sOpts.tips) { %>
            <div class="col-sm-4 col-lg-6">
                <div class="control-label" style="text-align: left;">
                    <i class="glyphicon glyphicon-info-sign text-color-brown"></i>
                    <span class="text-grey"><%= sOpts.tips%></span>
                </div>
            </div>
            <% } %>
        </div>

        <% }} else if(showType == "view") {
            for(var i=0; i<viewableItems.length; i++) {
            var vItem = viewableItems[i];
            var formatter = vItem.formatter;
        %>
        <dl class="dl-horizontal" style="margin-left: -60px;">
            <dt><%= colNames[vItem.name]%></dt>
            <dd><%= _.isFunction(formatter)? formatter(initData[vItem.name], vItem):initData[vItem.name]||'<em class="text-muted">无</em>'%></dd>
        </dl>

        <% }} else {} %>

    <% } else { %>
        <div><%= contentConf%></div>
    <% } %>
</form>
