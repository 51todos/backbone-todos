define([
    'tpl!app/view/mcht/templates/baseMchtMsg.tpl'
],function(tpl){

    var MchtView = Marionette.CompositeView.extend({
        tagName: 'div',
        template: tpl,

        serializeData: function () {
            return {data: this.model.toJSON()};
        },

        onRender: function() {
        }
    });

        return MchtView;
    });
