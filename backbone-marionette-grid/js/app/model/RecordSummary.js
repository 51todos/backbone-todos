/**
 * 对账单->某天账单概要
 */
define([
], function() {

    return Backbone.Model.extend({

        parse: function (resp) {
            if(_.isArray(resp)) {
                return resp[0];
            }
            return resp;
        },


        fetchByDate: function (date, options) {

            return this.fetch(_.extend({
                url: Ctx.url('bill.summary.onedate', {date: date})
            }, options));

        }

    });
    
});