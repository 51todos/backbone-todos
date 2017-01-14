<style type="text/css">
    .dlg-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999 !important;
        background: rgba(0, 0, 0, 0.25);
        opacity: 1 !important;
    }

    .dlg-container {
        position: fixed;
        left: 50%;
        top: 50%;
        z-index: 1000 !important;
        background-color: #FFFFFF;
        -webkit-box-shadow: 0 5px 50px 5px #777;
        -moz-box-shadow: 0 5px 50px 5px #777;
        box-shadow: 0 5px 50px 5px #777;
    }

    .dlg-header {
        width: 100%;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        font-size: 20px;
        color: #669fc7;
        background: #F1F1F1;
    }
    .dlg-header label {
        float: left;
        margin-left: 10px;
    }
    .dlg-header i {
        cursor: pointer;
        float: right;
        margin-top: 10px;
        margin-right: 10px;
        color: #DD5A43;
    }
    .dlg-header i:hover {
        color: red;
    }

    .dlg-body {
        position: relative;
        width: 100%;
        height: auto;
        overflow: auto;
        background: white;
    }

    .dlg-footer {
        position: relative;
        width: 100%;
        height: 60px;
        background: #F1F1F1;
    }
    .dlg-footer .btn-submit {
        width: 100px;
        height: 40px;
        margin: 10px 0;
        background-color: #428bca;
        border-color: #428bca;
        border-width: 2px;
        color: white;
        text-align: center;
    }
    .dlg-footer .btn-submit:hover {
        background-color: #1b6aaa;
    }
</style>
<%
    var dlgWidth = dlgOptions.width;
    var dlgHeight = dlgOptions.height;
    var dlgTitle = dlgOptions.title;
    var dlgSubmit = dlgOptions.submit===false? false:true;
%>
<div class="dlg-mask"></div>
<div class="dlg-container" style="
    width: <%= dlgWidth+"px" %>; height: <%= dlgHeight+"px" %>;
    margin-left: -<%= (dlgWidth/2)+"px" %>; margin-top: -<%= (dlgHeight/2)+"px" %>;
">
    <!-- dialog header -->
    <div class="dlg-header">
        <label><%= dlgTitle %></label>
        <i class="icon-remove"></i>
    </div>

    <!-- dialog body -->
    <div class="dlg-body" style="height:<%= (dlgSubmit!==false?(dlgHeight-100)+'px':'auto') %>">
        <!-- appending -->
    </div>

    <!-- dialog button -->

    <% if(dlgSubmit!==false){ %>
    <div class="dlg-footer">
        <div class="col-xs-6">
            <a class="form-reset" href="javascript:void(0);" style="line-height: 60px; font-size: 12px;">重置查询条件</a>
        </div>
        <div class="col-xs-6" style="text-align: right;">
            <button class="btn-submit"><i class="icon-ok"></i>提交</button>
        </div>
    </div>
    <% } %>
</div>