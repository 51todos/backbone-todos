define([
    'datepicker',
    'fancybox'
], function() {

    var View = Backbone.View.extend({

        initialize: function (options) {
            this.options = options;
            this.store = options.store;
            this.render();

            this.store.on({
                add: function () {
                    console.log('add');
                },
                remove: function () {
                    console.log('remove');
                }
            });

        },

        /**
         * options
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        _getDatePickerOptions: function () {
            var me = this;

            function beforeShowDay(date) {
                if (me.store.containsBySettleDate(date)) {
                    return false;
                }
            }

            var opt = {
                beforeShowDay: beforeShowDay

            }, maxDateModel;

            if(!this.store.isEmpty()) {
                maxDateModel = this.store.min(function (model) {
                    return parseInt(model.get('settleDate'), 10);
                });
                opt.endDate = maxDateModel ? moment(maxDateModel.get('settleDate'), 'YYYYMMDD').subtract('days', 1).toDate() : null;
            }
            return opt;
        },

        render: function () {
            var me = this;
            console.log('>>>billdatepicker render');

            this._datepicker = this.$el.datepicker(this._getDatePickerOptions());

            this._datepicker.on('changeDate', function (e) {
                if(e.date) {
                    me.trigger('billdate:pick', e);
                }
            });
            // this._datepicker.on('changeMonth', function (e) {
            //     console.log('changeMonth', arguments);
            // });

            this.$el.appendTo(document.body);
        },

        close: function () {
            $.fancybox.close();
            //关闭后清空当所选日期
            this._datepicker.datepicker('setDate', null);
        },

        show: function () {
            var me = this;
            aHack =  $('<a></a>');
            this._box = aHack.fancybox({
                helpers: {
                    overlay: {
                        closeClick: false 
                    }
                },
                openEffect: 'none',
                closeEffect: 'none',
                afterLoad: function() {
                    this.inner.append(me.$el);
                    me.$el.show();
                },
                beforeClose: function () {
                    me.$el.hide().appendTo(document.body);
                }
            }).click();
        }
    });

    return View;
});