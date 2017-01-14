define([
    'app/view/record/sub/StlmError'
], function(StlmError) {

    return StlmError.extend({

        title: '异常交易已确认无误',
        onRender: function () {
            StlmError.prototype.onRender.apply(this, arguments);
            console.log('异常交易已确认无误', this.data);

        }

    });


});