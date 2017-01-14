define([
    'tpl!app/view/bill/templates/remoteTnSel.tpl',
    'select2'
], function(tpl) {

    var ALL_TN_OPTION_VAL = 'all';

    return Marionette.ItemView.extend({
        className: 'remote-tn-sel',

        template: tpl,

        events: {
            'click .toggle-item': 'toggleDropdown',
            'click .all-item': 'selectAllItemOption'
        },

        ui: {
            toggleText: '.toggle-item .text',
            toggleArrow: '.toggle-item .arrow',
            toggle: '.toggle-item',
            downList : '.down-list',
            allItem: '.all-item',
            inputItem: '.input-item',
            tnSearchInput: '.tn-search-input'
        },

        initialize: function () {
            var me = this;

            this.render();
            //TODO销毁移除事件

            $(document).click(function (e) {
                //如果点击的不是我，并且我的下拉菜单弹出
                if(!$.contains(me.$el, e.target) && me.ui.downList.is(':visible')){
                    me.ui.downList.hide();
                }
            });
            this.setValue(ALL_TN_OPTION_VAL);
        },

        selectAllItemOption: function () {
            this.setValue(ALL_TN_OPTION_VAL);
            this.hideOptions();
        },

        onRender: function() {

            var me = this;
            this.ui.tnSearchInput.select2({
                allowClear: true,
                    width: '100%',
                    minimumInputLength: 4,
                    ajax: {
                        url: "api/open-user/settle-bill/algo-details-terminal-no",
                        data: function(term, page) {
                            return { kw: term };
                        },
                        results: function(resp, page) {
                            return {
                                results: me._formatQueryResult(resp.data.terminalNo)
                            };
                        }
                    }//ef ajax
                }
            ).on('change', function (e) {
                me.setValue(e.val);
                me.hideOptions();
                $(this).select2('val', null);
            });
        },

        _formatQueryResult: function (terminalNos) {
            var curVal = this.getValue();
            var arr = [];
            _.each(terminalNos, function (no) {
                //过滤当前选中值，不给机会你选中已选的值
                if(no !== curVal) {
                    arr.push({id: no, text: no});
                }
            });
            return arr;
        },

        setValue: function (val) {
            var lastVal = this.getValue();
            var ui = this.ui;
            var text;

            if(val !== lastVal) {
                this.ui.toggle.attr('value', val);
                this.trigger('change', val);

                if(val === ALL_TN_OPTION_VAL) {
                    //如果设置了‘全部终端’，那么隐藏‘全部终端’这个选项
                    ui.allItem.hide();
                    text = '全部终端';
                }else {
                    //如果选择某个终端号，那么显示
                    ui.allItem.show();
                    text = '终端号' + val;
                }

                this.ui.toggleText.text(text).attr('title', text);
            }
        },

        hideOptions: function () {
            this.ui.downList.hide();
        },

        showOptions: function () {
            this.ui.downList.show();
        },

        getValue: function () {
            return this.ui.toggle.attr('value');
        },

        toggleDropdown: function () {
            this.ui.downList.toggle();
            this.ui.toggleArrow.toggleClass('icon-caret-up').toggleClass('icon-caret-down');
            //选择全部终端则为空串
            return false;
        }
    });
    
});