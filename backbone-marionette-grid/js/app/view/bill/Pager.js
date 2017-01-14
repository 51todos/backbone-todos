define([
    'tpl!app/view/bill/templates/pager.tpl'
],function (tpl) {

    var View = Marionette.ItemView.extend({

        initialize: function (options) {
            this.collection = options.collection;

            this.render();
        },

        triggers: {
        },

        serializeData: function(){
            return this.collection.state;
        },

        events: {
            'click .previous': function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')) {
                    this.trigger('previous:page', e);
                }
            },
            'click .next': function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')) {
                    this.trigger('next:page', e);
                }
            },
            'click .page-number': function(e) {
                if (true) {
                    var pageNumber = parseInt($(e.target).text(), 10) - 1;
                    this.trigger('goto:page', pageNumber);
                }
            }
        },

        template: tpl,
        className: "pager",

        ui: {
            preBtn     : '.previous',
            nextBtn    : '.next',
            pageBtns    : '.page-number'
        },

        onRender: function () {
            var ui = this.ui;

            this.collection.on('sync', function (collection, resp) {
                
                ui.preBtn.toggleClass('disabled', !collection.state.hasPreviousPage);
                ui.nextBtn.toggleClass('disabled', !collection.state.hasNextPage);
                updatePageBtns(ui.pageBtns, collection.state.currentPage);
                
            });

            function updatePageBtns($buttons, pageNumber) {
                $buttons.removeClass('active');
                _.each($buttons, function(button){
                    if ($(button).text() == pageNumber + 1) {
                        $(button).addClass('active');
                    }
                });
            }
        }
    });

    return View;
});
