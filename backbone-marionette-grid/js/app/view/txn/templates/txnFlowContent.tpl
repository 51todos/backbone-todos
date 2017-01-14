<%
var STAT_MAP = {
    '0': '',
    '1': '(交易失败)',
    '2': '(已冲正)',
    '3': '(已撤销)',
    '4': '(交易失败)',
    '5': '(部分退货)',
    '6': '(全额退货)',
    '7': '(交易失败)'
};

var STAT_TEXT_COLOR = {
    '0': 'color-black',
    '1': 'color-red',
    '2': 'color-red',
    '3': 'color-red',
    '4': 'color-red',
    '5': 'color-red',
    '6': 'color-red',
    '7': 'color-red'
};

var DISCCYCLE_MAP = {
    '0': 'T+0',
    '1': 'T+1',
    's0': 'S+0'
};

%>


<%
_.each(data, function (dayItem) {
%>
    <div class="day-block">
        <div class="table-wrap">
            <table class="opf-table">
                <thead>
                    <%
                        var weekday = moment(dayItem.date, 'YYYYMMDD').weekday(),
                            formattedDate = Opf.String.replaceYMD(dayItem.date, 'M月D日'),
                            MAP_WEEKDAY = {
                                    0 : '周一',
                                    1 : '周二',
                                    2 : '周三',
                                    3 : '周四',
                                    4 : '周五',
                                    5 : '周六',
                                    6 : '周日'
                            },
                            dateLabel = formattedDate,
                            SUBCODE_MAP = {
                                '30' : '余额查询',
                                '31' : '消费',
                                '32' : '消费冲正',
                                '33' : '消费撤销',
                                '34' : '消费撤销冲正',
                                '35' : '退货',
                                '50' : '余额查询',
                                '51' : '消费',
                                '52' : '消费冲正',
                                '53' : '消费撤销',
                                '54' : '消费撤销冲正',
                                '55' : '退货'
                            },
                            TRADETYPE_MAP ={
                                '1': 'T+1',
                                '0': 'T+0准实时'
                            };
                    %>
                    <tr>
                        <th class="time-col text-left">
                            <div class="innerwrap th-inner"><%=dateLabel%></div>
                        </th>
                        <th class="ac-no-col">
                            <div class="th-inner">消费卡号</div>
                        </th>
                        <th class="trace-no-col">
                            <div class="th-inner">凭证号</div>
                        </th>
                        <th class="trade-type-col">
                            <div class="th-inner">交易类型</div>
                        </th>
                        <th class="trade-type-col">
                            <div class="th-inner">结算周期</div>
                        </th>
                        <th class="amt-col text-right">
                            <div class="th-inner">交易金额</div>
                        </th>
                    </tr>
                </thead>
                <tbody class="list">
                <%
                    _.each(dayItem.items, function (timeItem) {
                %>
                <tr class="tr-flow-row <%= ((timeItem.subCode === '31' || timeItem.subCode === '51') && timeItem.stat === '0') ? '' : STAT_TEXT_COLOR[timeItem.stat]%> " bid="<%=timeItem.id%>">
                    <td class="time-col text-left">
                        <div class="innerwrap td-inner">
                            <span class="text <%= STAT_TEXT_COLOR[timeItem.stat] %>">
                                <%=Opf.String.replaceHms(timeItem.time, 'HH:mm:ss')%>
                            </span>
                        </div>
                    </td>

                    <td class="ac-no-col">
                        <div class="td-inner">
                            <span><%= timeItem.acNo %></span>
                        </div>
                    </td>

                    <td class="trace-no-col">
                        <div class="td-inner">
                            <span><%= timeItem.traceNo %></span>
                        </div>
                    </td>

                    <td class="trade-type-col">
                        <div class="td-inner">
                            <span><%= timeItem.txName%><%= STAT_MAP[timeItem.stat] %></span>
                        </div>
                    </td>

                    <td class="trade-type-col">
                        <div class="td-inner">
                            <span><%= DISCCYCLE_MAP[timeItem.discCycle]%></span>
                        </div>
                    </td>

                    <td class="amt-col text-right">
                        <div class="td-inner <%= STAT_TEXT_COLOR[timeItem.stat] %>">
                            + <%= Opf.Number.currency(timeItem.amt,2,'¥','','.',false) %>
                        </div>
                    </td>
                </tr>
                <%
                    });
                %>
                </tbody>
            </table>
        </div>
    </div>

<%
});
%>