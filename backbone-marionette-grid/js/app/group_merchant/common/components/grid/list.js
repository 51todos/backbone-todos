define([
    'tpl!app/group_merchant/common/components/grid/templates/list.tpl'
],function(listTplFn){

    return Marionette.ItemView.extend({
        template: listTplFn,

        tagName: 'tbody',

        initialize: function(options, params){
            this.data = options.data;
            this.colNames = options.colNames;
            this.colModel = options.colModel;
            this.colAction = options.colAction;
            this.colActionConf = options.colActionConf;
            this.parent = (params && params.context)||null;

            this.render();
        },

        serializeData: function() {
            return {
                items: this.data,
                colNames: this.colNames,
                colModel: this.colModel,
                colAction: this.colAction||[],
                colActionConf: this.colActionConf||{}
            };
        },

        events: {
            'click tr': 'onSelect',
            'click a[data-name]': 'cBtnEvt'
            //'click :checkbox': 'cbxListFn'
        },

        cBtnEvt: function(evt) {
            var that = this,
                colAction = that.colAction;

            var $target = $(evt.target),
                name = $target.attr('data-name'),
                rowData = that._getRow($target),
                colActionItem = _.findWhere(colAction, {name: name});

            if(_.isFunction(colActionItem.onClick)) {
                colActionItem.onClick.call(that, rowData, $target);
            }
        },

        cbxListFn: function(evt) {
            var that = this,
                colModel = that.colModel;

            var $target = $(evt.target),
                rowData = that._getRow($target),
                colModelItem = _.findWhere(colModel, {checkable: true});

            if(_.isFunction(colModelItem.onClick)) {
                colModelItem.onClick.call(that, rowData, $target);
            }
        },

        /**
         * 获取行数据
         */
        _getRow: function($target) {
            var curSelectRow = [{}];

            if($target) {
                var rid = $target.closest('tr[data-id]').attr('data-id');

                curSelectRow = _.filter(this.data, function(record) {
                    if(record.id == rid) {
                        return record;
                    }
                });
            }

            return curSelectRow[0];
        },

        _clearSelect: function($target) {
            $target.closest('tbody').find('tr').removeClass('selected');
        },

        getChecked: function() {
            var that = this, checkedRows = [];
            var cbxList = this.$el.find(':checkbox:checked');

            cbxList.each(function() {
                var checkedRow = that._getRow($(this));
                checkedRows.push(checkedRow);
            });

            return checkedRows;
        },

        onSelect: function(e) {
            var $target = $(e.target).closest('tr');

            // 清空上次所选记录
            this._clearSelect($target);

            $target.hasClass('selected')? $target.removeClass('selected') : $target.addClass('selected');
        },

        onCheckAll: function() {
            var cbxList = this.$el.find(':checkbox');

            cbxList.each(function() {
                if(!$(this).is(':checked')) {
                    $(this).prop('checked', true);
                }
            })
        },

        onUncheckAll: function() {
            var cbxList = this.$el.find(':checkbox');

            cbxList.each(function() {
                if($(this).is(':checked')) {
                    $(this).prop('checked', false);
                }
            })
        },

        onRender: function() {
            // 缓存当前页数据到tbody
            this.$el.data('records', this.data);
        }
    });
});
