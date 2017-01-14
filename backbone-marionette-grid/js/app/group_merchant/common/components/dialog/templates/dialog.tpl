<%
    var MODAL_TYPE_MAP = {
        "lg": "800px",
        "md": "500px",
        "sm": "300px",
    };
    var modalType = dialogConf.modalType||"lg";
%>

<div class="modal-dialog" style="width: <%= MODAL_TYPE_MAP[modalType]%>; font-size: 14px;">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" style="color: #0077cc;"><%= dialogConf.title%></h4>
        </div>
        <div class="modal-body">
            <!-- 配置内容 -->
        </div>

        <% if(dialogConf.type !== "view" && dialogConf.type !== "alert") { %>
        <div class="modal-footer">
            <%
            var iconCls = dialogConf.type=="search"? "glyphicon-search ":
                        dialogConf.type=="del"? "glyphicon-trash":"glyphicon-ok-circle";

            var iconText = dialogConf.type=="search"? "搜索":
                        dialogConf.type=="del"? "删除":"提交";

            var btnCls = dialogConf.type=="del"? "btn-danger":"btn-primary";
            %>
            <button type="button" name="formSubmit" class="btn <%= btnCls%>">
                <span class="glyphicon <%= iconCls%>"></span> <%= iconText%>
            </button>
        </div>
        <% } %>
    </div><!-- /.modal-content -->
</div><!-- /.modal-dialog -->
