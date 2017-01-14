define([
    'tpl!app/view/txn/templates/txnDetails.tpl',
    'fwk/components/dialog',
    'app/view/txn/SpoContent'
],function(tpl, Dialog, SpoContent){

    var MchtView = Marionette.CompositeView.extend({
        template: tpl,
        className: 'flow-detail',
        triggers:{
            'click .back-trigger': 'back'
        },
        events : {
            'click #showSPO':'showSPO'
        },

         initialize: function(data) {
             this.data = data;
         },

         serializeData: function () {
             return this.data;
         },

        onRender: function() {
            var me = this;
            $(window).on('resize.drawline',function (){
                setTimeout(function(){
                    var myHeight= me.$el.height();
                    var windowHeight= $(window).height();
                    if(myHeight > windowHeight){
                        me.$el.height(windowHeight-80);
                    }
                },10);
            });
            $(window).triggerHandler('resize.drawline');
        },
        showSPO: function(){
            var spo = new Dialog({
                title: "签购单明细",
                width:380, height:660, submit:false,
                formView: new SpoContent({txId : this.data['id']})
            });

            /*spo.on('tradewater:detail:close', function(){
                this.$el.close();
            });*/

            spo.render();

            //关闭“交易详情”对话框
            this.trigger('txn:flow:close');
        }
    });


    return MchtView;
});
