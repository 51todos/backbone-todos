/**
 * 对账单->按天查看的交易明细(终端分组)
 */
define([
], function() {

    return Backbone.Model.extend({
        
        fetchByDate: function (date, options) {
            return this.fetch(_.extend({
                url: Ctx.url('bill.algo.details', {date: date})
            }, options));
        }

    });
    
});