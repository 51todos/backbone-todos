<% 
    var FREQUENCY_MAP = {
        0 : "年",
        1 : "月",
        2 : "周"
        };

    var FEE_MAP = {
        0 : fixedFeeAmt + "元",
        1 : fixedFeeAmt + "元/" + FREQUENCY_MAP[fixedFeeFrequency],
        2 : "免费开通"
        };

    var FEE_RATE = {
        0 : "免手续费"
        };

    var STYLE_MAP = {
        "2": "btn-default stop",
        "1": "btn-primary request",
        "3": "btn-primary request"
    }

%>
<div class="service-container col-xs-12">
    <div class="title-fee-special-button clearfix col-xs-12">
        <div class="title-fee-special">
            <div class="title"><%= name %></div>
            <div class="fee">
            <span class="fix-fee"><%= FEE_MAP[fixedFeeType] %><span class="invisible-in-xs">，</span></span><span class="handling-charge"><%= (handlingChargeRate == 0) ? "免手续费" : "手续费在原来的基础上增加" + handlingChargeRate + "%。" %></span>
            </div>
            <% if(trialPrice) { %>
            <div class="special-offers">
                <span class="special-offers-title">优惠活动：</span><span><%= trialPrice %></span>元试用<span><%= trialPeriod %></span>天
            </div>
            <% } %>
        </div>
        <div class="btn-container">
            <button type="button" class="btn <%= STYLE_MAP[status] %> request-stop-service"><%= operationText %></button>
        </div>
    </div>
    <div class="service-desc col-xs-12">
        <div class="service-title">服务内容</div>
        <div class="service-summary-desc">
            <%= summaryDesc %>
            <% if(shouldAppendUnfoldBtn) { %>
                <a href="javascript: void 0" class="unfold">更多></a>
            <% } %>
        </div>
        <div class="service-detail-desc">
            <%= desc %>
            <a href="javascript: void 0" class="fold"><折叠</a>
        </div>
    </div>
</div>
