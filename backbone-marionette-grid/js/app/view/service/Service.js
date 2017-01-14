define([
    'tpl!app/view/service/templates/row.tpl',
    'tpl!app/view/service/templates/list.tpl',
    'app/view/service/pager'
    ], function(rowTpl,listTpl,Pager){
    var SUMMARY_DESC_LEN = 120;
    var STATUS_MAP = {
        '1': '立即开通',
        '3': '立即开通',
        '2': '暂停服务'
    };
    var RowView = Marionette.ItemView.extend({
        template: rowTpl,

        events: {
            'click .unfold' : 'unfoldDesc',
            'click .fold' : 'foldDesc'
        },

        triggers: {
            'click .request-stop-service' : 'request:stop:service'
        },

        className: 'row service-row',

        mixinTemplateHelpers: function(data){
            if (data.desc.length > SUMMARY_DESC_LEN) {
                data.summaryDesc = data.desc.slice(0,SUMMARY_DESC_LEN) + '...';
                data.shouldAppendUnfoldBtn = true;
            } else {
                data.summaryDesc = data.desc;
                data.shouldAppendUnfoldBtn = false;
            }

            data.operationText = STATUS_MAP[data.status];

            return data;
        },

        unfoldDesc: function(e){
            $(e.target).closest('div').toggle();
            $(e.target).closest('.service-desc').find('.service-detail-desc').toggle();
        },

        foldDesc: function(e){
            $(e.target).closest('div').toggle();
            $(e.target).closest('.service-desc').find('.service-summary-desc').toggle();
        }
    });
    var CompositeView = Marionette.CompositeView.extend({
        template: listTpl,
        itemView: RowView,
        itemViewContainer: '.service-list-container',

        initialize: function(){
            this.render();
        },

        onRender: function(){
            // this._addPager();
            // this._addListener();
        },

        onItemviewRequestStopService: function(args){
            this.trigger('request:stop:service', args.model.get('id'), args.$el);
        },

        _addPager: function(){
            this.pager = new Pager({collection: this.collection}); //render()
            this.$('.pager-container').append(this.pager.$el);
        },

        _addListener: function(){
            this.listenTo(this.pager, 'all', function(evName){
                this.trigger.apply(this, arguments);
            });
        }

    });

    return CompositeView;
});