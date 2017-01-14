define([
    'tpl!app/view/record/templates/summaryTerminals.tpl',
    'tpl!app/view/record/templates/terminalTxnDetailRow.tpl',
    'datatables'
],function(tpl, rowTpl){

    var terminalRowView = Marionette.ItemView.extend({
        tagName: "tr",
        template: rowTpl,
        mixinTemplateHelpers: function (data) {
            var tmp = ('' + data.date + data.time);
            data._formatedTime = tmp.replace(/\d{4}(\d{2})(\d{2})(\d{2})(\d{2})\d{2}/, '$1\/$2 $3:$4');
            return data;
        }
    });

    var TerminalView = Marionette.CompositeView.extend({
        className: 'txn-detail',
        template: tpl,
        itemView: terminalRowView,
        itemViewContainer: ".item-ct",
        triggers: {
            'click .back-trigger': 'back'
        },
        ui: {
            pageInfoText: '.page-info .text',
            pre: '.previous',
            next: '.next',
            body: '.body'

        },
        initialize: function (options) {
            var me = this;
            
            this.collection.on('sync', function (store, resp, optinos) {
                me.updatePageInfo(store, resp);
            });

            this.$el.on('click', '.previous:not(".disabled")', Opf.Function.createBuffered(function () {
                me.busy();
                me.trigger('previous');
            }, 250));

            this.$el.on('click', '.next:not(".disabled")', Opf.Function.createBuffered(function () {
                me.busy();
                me.trigger('next');
            }, 250));

        },
        busy: function (toggle) {
            Opf.UI.setLoading(this.ui.body, toggle);
        },
        onDataSync: function () {
            this.busy(false);
        },
        updatePageInfo: function (store, resp) {
            var pageInfo = Opf.String.format('第 {0}~{1}笔 / 共 {2}笔',
                resp.startIndex + 1,
                resp.startIndex + store.length,
                resp.totalCount
            );
            this.ui.pageInfoText.text(pageInfo);
            this.ui.pre.toggleClass('disabled', !resp.previous);
            this.ui.next.toggleClass('disabled', !resp.next);

        },
        onRender: function () {
            var me = this;
            if(!this.collection.isEmpty()) {
                this.$el.find('.tno').text(
                    this.collection.first().get('terminalNo')
                );
            }
            setTimeout(function () {
                me.$('table').dataTable({
                    "paging": false,
                    "ordering": false,
                    "searching": false,
                    "info": false,

                    "scrollX": true
                }); 
                var $scrollHead = me.$el.find('.dataTables_scrollHead table');
                var $scrollBodyTb = me.$el.find('.dataTables_scrollBody tbody');
                $scrollHead.append($scrollBodyTb);
            }, 1);
        }
    });

    return TerminalView;
});
