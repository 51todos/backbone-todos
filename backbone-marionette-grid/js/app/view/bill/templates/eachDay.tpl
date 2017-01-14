<%
    var weekday = moment(date, 'YYYYMMDD').weekday(),
        formattedDate = Opf.String.replaceYMD(date, 'M月D日'),
        MAP_WEEKDAY = {
                0 : '周一',
                1 : '周二',
                2 : '周三',
                3 : '周四',
                4 : '周五',
                5 : '周六',
                6 : '周日'
            },
        dateToShow =  formattedDate,

        
        basePageNumber = 0,
        firstPageNumber = basePageNumber + 1,
        lastPageNumber = _.min([collection.state.pageSize,pageBean.totalElements]);
%>

<table class="opf-table">
    <thead>
        <tr class="timeSortRow">
            <th><%= dateToShow %>交易</th>
            <th>凭证号</th>
            <th>支付方式</th>
            <th>结算周期</th>
            <th class="text-color-green">交易本金</th>
            <th class="text-color-brown">手续费</th>
            <th class="text-color-blue">减免金额</th>
            <th>结算金额</th>
        </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr>
            <td colspan="8">
                <div class="info-container">
                    <div class="day-sumup">
                        <span class="text-color-blue"><%= pageBean.totalElements %></span>笔交易，总金额<span class="text-color-green">&yen;<%= amt %></span>，正在显示第<span class="first-page-number"><%= firstPageNumber %></span>-<span class="last-page-number"><%= lastPageNumber %></span>笔交易。</div>
                    <div class="pager-container"></div>
                </div>
            </td>
        </tr>
    </tfoot>
</table>