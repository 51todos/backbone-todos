define([
    'tpl!app/view/bill/templates/eachDay.tpl',
    'tpl!app/view/bill/templates/row.tpl',
    'tpl!app/view/bill/templates/showDetails.tpl',
    'app/view/bill/Pager',
    'app/store/PageableTimeBills'
    ],function(dayTpl,rowTpl, detailsTpl, PagerView, PageableTimeBills){

        var RowView = Marionette.ItemView.extend({
            template: rowTpl,
            tagName: 'tr',
            className: 'timeSortRow ',
            triggers: {
                'click': 'click'
            }
        });

        var EachDayView = Marionette.CompositeView.extend({
            template: dayTpl,
            itemView: RowView,
            itemViewContainer: 'tbody',
            className: 'eachday-table',

            ui: {
                pager: '.pager-container'
            },

            initialize: function (options) {
                var me = this;
                this.data = options.data;
                this.ownerView = options.ownerView;

                this.collection = new PageableTimeBills(this.data, {parse: true});

                this.pager = new PagerView({
                    collection: this.collection
                });

                
                //要在pager创建完后触发，让pager可以同步collection的分页信息
                this.collection.trigger('sync', this.collection, this.data);

                this._listenToPager();
            },

            _listenToPager: function () {
                var me = this;

                this.pager.on('previous:page', function() {
                    me.collection.setQueryOptions(me.getQueryParams()).getPreviousPage();
                });

                this.pager.on('next:page', function() {
                    me.collection.setQueryOptions(me.getQueryParams()).getNextPage();
                });

                this.pager.on('goto:page', function(index){
                    me.collection.setQueryOptions(me.getQueryParams()).getPage(index);
                });
            },

            serializeData: function () {
                return this.data;
            },

            templateHelpers: function(){
                return {collection : this.collection };
            },


            //在 firefox 下 onItemviewClick 需要传 event 参数，否则 event 为 undefined . zhuyimin
            onItemviewClick: function(itemView, event){
                console.log("itemView being clicked! ", itemView);
                console.log($(event.target));

                var $tr = $(event.target).closest('tr');
                this.$el.find('.timeSortRow').removeClass('active');
                $tr.addClass('active');

                var data = itemView.model.attributes,
                    detailsTable = detailsTpl(data);


                Opf.UI.popDetailDialog({
                    title: '对账详情',
                    el: $(detailsTable)
                });

            },

            getQueryParams: function(){
                var dateValObj = this.ownerView.getDateValues();
                var tnVal = this.ownerView.getTerminalVal();
                var params = {
                    startDate: dateValObj.startDate,
                    endDate: dateValObj.endDate,
                    terminal: tnVal === 'all' ? '' : tnVal,
                    txDate: this.data.date
                };

                console.log('交易数据请求的参数', params);

                return params;
            },

            onRender: function(){
                var me = this;
                this.ui.pager.append(this.pager.$el);

                this.listenTo(this.collection, 'request', function () {
                    Opf.UI.setLoading(me.$el);
                    $(document).ajaxStop(function () {
                        Opf.UI.setLoading(me.$el, false);
                    });
                });

                // 更新当前显示的条目数。
                // 很显然在此之前， initialize 时 this.collection 就 trigger 了一下 sync ,导致第一次同步时不能更新显示条目数
                // 通过在 eachDay.tpl 中初始化时设值挽救一下
                this.listenTo(this.collection, 'sync', function(collection,resp){
                    var basePageNumber = collection.state.pageSize * collection.state.currentPage;

                    var firstPageNumber = basePageNumber+1;

                    var lastPageNumber = basePageNumber+collection.state.numberOfElements > collection.state.totalRecords ?
                                            collection.state.totalRecords :
                                            basePageNumber+collection.state.numberOfElements;

                    me.$('.first-page-number').text(firstPageNumber);
                    me.$('.last-page-number').text(lastPageNumber);
                });
            }

        });
        return EachDayView;
    });