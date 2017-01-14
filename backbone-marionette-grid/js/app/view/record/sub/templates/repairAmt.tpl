<table class="table repair-amt-detail">
    <thead>
        <tr>
            <th>操作类型</th>
            <th>金额</th>
            <th>操作时间</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="4">
                <div class="repair-amt-detail-pager">
                    <button type="button" class="btn btn-default btn-opf previous"><span class=" icon-angle-left"></span></button>
                    <button type="button" class="btn btn-default btn-opf next"><span class=" icon-angle-right"></span></button>
                </div>
                <div>
                    <span>合计：</span>
                    <span>截留总金额：<span class="repair-amt"><%= repaireAmt %></span></span>
                    <span>已截留总金额：<span class="repaired-amt"><%= repairedAmt %></span></span>
                    <span>未截留总金额：<span class="unrepair-amt"><%= unRepairAmt %></span></span>
                    <span>已归还金额：<span class="unrepair-amt"><%= unRepairAmt %></span></span>
                </div>
            </td>
        </tr>
    </tfoot>
</table>