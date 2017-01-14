define([
    


], function() {

    return Marionette.Controller.extend({
        /**
         * @param  {[type]} view of Nav
         */
        initialize: function (navView) {
            this.navView = navView;

            App.on('tab:show', function (options) {
                
                require(options.deps.split(/,/), function (Ctrl) {
                    Ctrl.show && Ctrl.show();
                });
                
            });

        },

        showDefaultTab: function () {
            this.navView.showDefaultTab();
            App.on('show:bill:view', function(settleDate){
                toBillTab();
                require(['app/controller/Bill'], function(ctrl){
                    ctrl.show && ctrl.show({startDate: settleDate, endDate: settleDate});
                });

                function toBillTab(){
                    var $billTab = $('a.bill-tab'),
                        $billRegion = $('#bill-pane');
                    $('div.tab-pane').removeClass('active');
                    $billRegion.addClass('active');
                    $('ul.nav-pills li').removeClass('active');
                    $billTab.parent().addClass('active');
                }
            });

        }
    });


    
});