define([
    'tpl!app/view/templates/task-queue.tpl',
    'marionette'
], function(tpl, Marionette) {

    /**
     * addTask 添加一个任务视图，该任务视图触发'used'则管理器会知道
     */

    var TaskQueueView = Marionette.CompositeView.extend({

        template: tpl,
        tagName: 'div',
        className: 'task-box',

        itemViewContainer: '.task-ct',

        ui: {
            'dropdownHeader': '.dropdown-header',
            'ddHeaderWatingText': '.dropdown-header .waiting-text',
            'dropdownHeaderNumText': '.dropdown-header .num',
            'numBadge': '.badge',
            'tableSit': '.task-queue-table-sit'
        },

        events: {
            // 'click .waiting-text': 'onDDHeaderWaitingTextClick'
        },

        initialize: function() {

            this.collection = this.newCollection();

            this.render().$el.prependTo($('#tool-menu'));
        },

        newCollection: function() {
            var collection = new Backbone.Collection();
            var me = this,
                ui = this.ui;

            collection.on('add', function() {
                me.updateDDHeader();
            });

            collection.on('change:status', function() {
                me.updateDDHeader();
            });

            return collection;
        },

        onRender: function() {
            var me = this;
            this.updateDDHeader();

            var waitingModel;
            this.ui.ddHeaderWatingText.on('click', function () {
                waitingModel = me.collection.findWhere({status:'waiting'});
                if(waitingModel) {
                    var waitingChildView = me.children.findByModel(waitingModel);
                    waitingChildView && me.ui.tableSit.scrollTo(waitingChildView.$el);
                }
                return false;
            });
        },

        updateDDHeader: function() {
            var ui = this.ui;
            var waitingModels = this.collection.filter(function(m) {
                return m.get('status') === 'waiting';
            });

            if (waitingModels.length) {
                ui.numBadge.text(waitingModels.length).show();
                ui.numBadge.attr('title', waitingModels.length+'个等待中的任务');

                ui.dropdownHeaderNumText.text(waitingModels.length);
                ui.dropdownHeader.show();
            } else {
                ui.numBadge.hide();
                ui.dropdownHeader.hide();
            }
        },

        addTaskView: function(childviewClass, model) {
            model = model || {};

            var _getItemView = this.getItemView;
            this.getItemView = function() {
                return childviewClass;
            };

            //this.collection.add(model, {at: 0});
            this.collection.add(model);

            this.ui.tableSit.scrollTop(0);

            this.getItemView = _getItemView;
        }

    });

    var AbstractTask = function() {
        this.initialize && this.initialize.apply(this, arguments);
    };

    _.extend(AbstractTask.prototype, Backbone.Events, {
        //返回对应的任务视图的类
        View: null,

        //返回对应模型实例
        getModel: function() {
            console.error('必须实现getModel 方法');
        },

        getViewClass: function() {
            return this.View;
        }
    });

    var Mrg = {

        extendTask: function() {
            return Backbone.Model.extend.apply(AbstractTask, arguments);
        },

        init: function() {
            this.taskQueueView || (this.taskQueueView = new TaskQueueView().render());
            return this;
        },

        getTaskList: function() {
            return this.taskQueueView ? this.taskQueueView.collection.toJSON() : null;
        },

        /**
         * @param {[type]} task Mrg.extendTask 生成的类的实例
         */
        addTask: function(task) {
            this.init();

            this.taskQueueView.addTaskView(task.getViewClass(), task.getModel());
        }
    };

    return Mrg;
});