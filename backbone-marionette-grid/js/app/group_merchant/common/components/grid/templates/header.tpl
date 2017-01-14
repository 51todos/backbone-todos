<!-- 输出表头 -->
<%
var checkable = _.findWhere(opts.colModel, {checkable: true});
if(checkable) {
%>
    <th width="30"><input type="checkbox"></th>
<% }
_.each(opts.colNames, function(v, k) {
    var model = _.findWhere(opts.colModel, {name: k})||{};
    if(k == 'action' || model.hidden !== true) {
%>
    <th data-name="<%= k %>"><%= v %></th>
<% }}) %>
