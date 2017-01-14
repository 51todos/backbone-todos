<div class="back-header header text-center">

  <span class="visible-only-xs back-trigger pointer blue-font">
    <i class="icon icon-chevron-left"></i>返回
  </span>

    <span class="pre-record-container invisible-in-xs" ><i class="icon icon-caret-left pre-record switch-record <% if(isFirstPage) { %> disabled <% } %>"></i></span>
  <span class="settle-date"><%= formatedSettleDate %><%= discMessage %>结算详情</span>
    <span class="next-record-container invisible-in-xs" ><i class="icon icon-caret-right next-record switch-record <% if(isLastPage) { %> disabled <% } %>"></i></span>
  <div class="switchPanel">
      <ul>
          <%= list %>
      </ul>
  </div>
</div>

<div class="detail-container"></div>
<div class="switch-container">
  <ul class="clearfix">
    <%= list %>
  </ul>
</div>