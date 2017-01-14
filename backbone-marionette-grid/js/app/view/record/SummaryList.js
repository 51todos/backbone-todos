define([
    'tpl!app/view/record/templates/summarylist.tpl',
    'moment',
    'tpl!app/view/record/templates/summaryrow.tpl'
], function (tpl, moment, rowTpl) {

    var RowView = Marionette.ItemView.extend({
        tagName: "tr",
        className: "tr-summary pointer light-blue-activable",
        mixinTemplateHelpers: function (data) {
            var RESULTSTATUS_Map = {
                '0': '已结算',
                '1': '入账失败',
                '2': '结算中'
            };
            data.formatedSettleDate = moment(data.settleDate, "YYYYMMDD").format("M月D日");
            data._resultStatus = RESULTSTATUS_Map[data.resultStatus];
            return data;
        },
        template: rowTpl,

        triggers: {
            'click': 'click'
        }
    });

    var TableView = Marionette.CompositeView.extend({
        className: 'summary-list',
        itemView: RowView,
        itemViewContainer: "tbody",

        template: tpl,

        ui: {
            summaryItemPane: '.summary-item'
        },

        events: {
        },

        triggers: {
            'click .more-trigger': 'more:summary:pick'
        },

        constructor: function (options) {
            var me = this;
            Marionette.CompositeView.prototype.constructor.apply(this, arguments);

            _.each(options._events, function (fn, ev) {
                me.on(ev, fn.fn ? fn.fn : fn, fn.scope || null);
            });
        },

        onItemviewClick: function (itemView) {
            this.$el.find('.tr-summary').removeClass('active');
            itemView.$el.addClass('active');
            this.trigger('summary:item:show', {settleDate: itemView.model.get('settleDate'), shouldFetchData: true});
        },

        onCompositeCollectionRendered: function () {
            console.log('onCompositeCollectionRendered');
        },

        busySummaryItem: function (busy) {
            Opf.UI.setLoading(this.ui.summaryItemPane, busy);
        },

        initialize: function () {

            this.on('render', function () {
                // this.appendHtml = function(collectionView, itemView, index){
                //   collectionView.$el.append(itemView.el);
                // };
            });
        },

        onRender: function () {
            // 小屏幕不能默认显示某一天，如果需要的话，trigger前判断下屏幕
            if(Opf.Media.gt(Opf.Media.XS)) {
                var firstChild = this.children.first();
                firstChild && firstChild.trigger('click');
            }

        }
    });


    return TableView;

});