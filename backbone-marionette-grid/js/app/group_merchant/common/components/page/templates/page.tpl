<!-- pagebar -->
<div class="region-pagebar">
    <% if(caption !== "") { %>
    <div class="row">
        <div class="col-xs-4">
            <h3 style="margin-bottom: 0;"><%= caption||""%></h3>
        </div>
        <div class="col-xs-8" style="text-align: right;">
            <div class="region-toolbar"></div>
            <!--<div id="btns-pane" class="btns-panel">
                <button type="button" class="btn btn-success btn-lg" name="addUser">
                    <i class="icon icon-plus-sign"></i>
                    新增员工账号
                </button>
            </div>-->
        </div>
    </div>

    <!-- 分割线 -->
    <hr>
    <% } %>
</div>

<!-- search -->
<div class="region-search"></div>

<!-- grid -->
<div class="region-grid"></div>
