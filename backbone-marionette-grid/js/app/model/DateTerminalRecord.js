/**
 * 对账单->按天查看的交易明细
 */
define([
], function() {

    return Backbone.Model.extend({
        
        fetchById: function (id, options) {
            return this.fetch(_.extend({
                url: Ctx.url('bill.algo.date.details', {id: id})
            }, options));
        }

    });
    
});