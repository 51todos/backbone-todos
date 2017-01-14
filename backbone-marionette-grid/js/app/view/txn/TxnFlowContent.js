define([
    'tpl!app/view/txn/templates/txnFlowContent.tpl'
], function(tpl) {


    var View = Marionette.ItemView.extend({

        template: tpl,

        events: {
            'click .tr-flow-row': 'onFlowItemClick'
        },

        /*
         */
        initialize: function (options) {
            console.log('>>>txnFlowContent initialize', arguments);
            this.data = options.data;
        },

        onFlowItemClick: function (e) {
            var $tr = $(e.target).closest('tr');
            this.$el.find('.tr-flow-row').removeClass('active');
            $tr.addClass('active');
            this.trigger('txn:flow:show', $tr.attr('bid'));
        },

        serializeData: function () {
            return {
                data: this.data
            };
        },

        onRender: function () {

        }

    });
 

    return View;
});