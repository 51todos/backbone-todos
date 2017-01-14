/**
 * User hefeng
 * Date 2016/5/9
 */
define([
    'app/group_merchant/common/components/config/view'
], function(ConfView) {
    return Marionette.ItemView.extend({
        className: 'search-panel',

        template: _.template('' +
            '<div class="search-container clearfix">' +
            '<div class="row">' +
            '<div class="col-sm-offset-2 col-sm-10">' +
            '<button class="btn btn-primary" type="button" name="search"><i class="glyphicon glyphicon-search"></i>&nbsp;查询</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
            //'<a href="javascript:void(0);" name="reset" style="font-size:12px;">清空筛选条件</a>' +
            '</div></div></div>'
        ),

        ui: {
            searchContainer: '.search-container',
            btnSearch: 'button[name="search"]',
            btnReset: 'button[name="reset"]'
        },

        events: {
            'click .toggle-hidden': 'toggleHiddenFn',
            'click @ui.btnSearch': 'searchFn',
            'click @ui.btnReset': 'resetFn'
        },

        initialize: function(options, params) {
            this.gridOptions = options? (options.searchTemplate||options):"";
            this._ui = options.ui? options.ui:{};
            this.parent = (params && params.context) || null;
            //this.render();
        },

        onRender: function() {
            var confView = this.confView = new ConfView({
                showType: 'search',
                contentConf: this.gridOptions
            });

            this.ui.searchContainer.before(confView.$el);

            this.extendUI(confView.$el);
        },

        extendUI: function($confViewEl) {
            this.ui.hiddenEl = $confViewEl.find('div.hidden');
        },

        toggleHiddenFn: function(evt) {
            var $self = $(evt.target);
            var text = $.trim($self.text());
            var $hidden = this.ui.hiddenEl;

            // 显示/隐藏页面元素
            if($hidden.is(':visible')) {
                $self.text(text.replace(/隐藏/, '显示'));
                $hidden.addClass('hidden');
            } else {
                $self.text(text.replace(/显示/, '隐藏'));
                $hidden.removeClass('hidden');
            }
        },

        // 重置查询条件
        resetFn: function() {
            this.confView.reset();
        },

        // 搜索
        searchFn: function() {
            var parent = this.parent;
            var postData = this.confView.getValues();

            parent.gridView.reloadGrid(postData, {reset: true});
        }
    })
});