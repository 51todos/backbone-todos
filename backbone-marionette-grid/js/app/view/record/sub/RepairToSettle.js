define([
    'app/view/record/sub/StlmRepair'
], function(StlmRepair) {

    return StlmRepair.extend({

        title: '归还截留资金',
        onRender: function () {
            var me = this;

            StlmRepair.prototype.onRender.apply(this, arguments);

            me.$el.find('.adjust-bill-pane').each(function() {
                $(this).hide();
            });

            console.log('归还截留资金', this.data);

        }

    });


});