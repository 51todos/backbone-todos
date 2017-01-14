define([
    'fwk/function'
], function(FnUtils) {

    var SELECT_PLACEHOLDER_OPTION_CLS = 'placeholder';

    /**
     * options: {
     *     selected: true, // 默认选中第一项
     *     placeholder: 'xx', // 默认提示语
     *     value: '',默认值 // 默认值
     *     ajax: { // ajax配置
     *         ajax的配置
     *     }
     * }
     */
    function Select (el, options) {
        this.$el = el? $(el) : $(options.el);
        this.options = options || {};

        this.init();

    }

    Select.prototype = {
        constructor: Select,

        init: function () {
            this.options.placeholder && doInitPlaceHolder(this.$el, this.options.placeholder);
            if(this.options.ajax) {
                this.fetch(this.options.ajax);
            }
        },

        clear: function () {
            var hasChange = this.$el.find('option:selected:not(:disabled)').length > 0;
            this.$el.empty();
            doInitPlaceHolder(this.$el, this.options.placeholder);
            hasChange && this.$el.trigger('change');
        },

        applyDefaultValue: function (defaultVal) {
            var $el = this.$el;
            defaultVal = defaultVal || this.options.value || $el.data('ajaxselect.value');

            if(defaultVal) {
                $el.val(defaultVal);
                $el.data('ajaxselect.value', null);
                delete this.options.value;

                if($el.val() == defaultVal) {//设置默认值成功才触发
                    this.options.onDefaultValue && this.options.onDefaultValue.call($el[0], defaultVal);
                    // $el.trigger('ajaxselect.default');
                    // $el.trigger('change');
                }

                if($el.data('select2')) {
                    var selVal = $el.val();
                    var selOption = $el.find('option:selected').text();
                    $el.select2('data', {id: selVal, text: selOption});
                }

            }
        },

        updateOptions: function (data, defaultVal) {
            if(data) {
                var strHtml = convertToSelectOptionsHtml(data, this.options);
                doUpdateOptions(this.$el, strHtml);
                if(this.options.selected) {
                    this.$el.find('option').eq(1).attr('selected', true).trigger('change');
                } else {
                    this.applyDefaultValue(defaultVal);
                }
            } else {
                doUpdateOptions(this.$el, '');
            }
        },

        setDefaultValue: function (defaultVal) {
            //如果已经获取完值生成了选项
            //就直接设置
            var me = this;
            var promise = this.deferred.promise();
            if(promise.done){
                promise.done(function(){
                    me.$el.val(defaultVal);
                });
            }else{
                //不然就设置默认值对应的属性
                me.applyDefaultValue(defaultVal);
            }
        },

        fetch: function (argAjax) {
            var me = this;
            me.deferred = $.Deferred();

            var ajaxOptions = $.extend({
                // async: false,
                type: 'GET'
            }, argAjax);

            function success (data) {
                me.updateOptions(data);
                me.deferred.resolve();
            }

            ajaxOptions.success = FnUtils.createSequence(success, ajaxOptions.success || $.noop);

            return Opf.ajax(ajaxOptions);
        }
    };


    function doUpdateOptions (el, optionsHtml) {
        $(el).empty();
        doInitPlaceHolder(el);
        optionsHtml && $(el).append($(optionsHtml));
    }

    function convertToSelectOptionsHtml (arr, opts) {
        return _.map(arr, function (item, i) {
            if(opts && opts.convertField){
                var fieldObj = {}, props = {};
                    fieldObj.name = item[opts.convertField.name];
                    fieldObj.value = item[opts.convertField.value];

                if(item.mchtNo) {
                    props.mchtNo = item.mchtNo;
                }

                fieldObj.props = props;

                item = fieldObj;
            }

            var optionTpl = '<option value="<%=item.value%>" ' +
                    '<% if(!_.isEmpty(item.props)){ _.each(item.props, function(v, k) { %> data-<%= k%>=<%= v%> <% }) } %>' +
                '><%=item.name%></option>';

            return _.template(optionTpl, {item:item});
        }).join('');
    }

    function doInitPlaceHolder (el, placeholder) {
        placeholder = placeholder || $(el).data('placeholder');
        if(placeholder) {
            $(el).append(
                $('<option disabled="disabled " style="display:none;" selected="selected"></option>')//
                .text(placeholder)
                .addClass(SELECT_PLACEHOLDER_OPTION_CLS)
            );
            $(el).data('placeholder', placeholder);
        } else {
            $(el).append('<option></option>');
        }
    }

    return Select;
});