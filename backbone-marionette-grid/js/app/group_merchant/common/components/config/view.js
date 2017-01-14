/**
 * Created by hefeng on 2016/5/10.
 */

/**
 * Ex
 * new ConfView({
 *      showType: 'edit', //add|edit/search/view
 *      contentConf: this.options.contentConf,
 *      initData: this.options.initData||{}
 *  })
 */

define([
    'tpl!app/group_merchant/common/components/config/templates/conf.tpl',
    'jquery.validate', 'daterangepicker'
], function(confTplFn) {
    var CommonUI = Opf.Util.CommonUI;

    var dateFormatter = function(val) {
        return moment(val).formatPureYMD()||"";
    };

    var componentsRender = {
        /**
         * 重置密码框，解决chrome下自动填入密码问题
         * @param $self
         */
        password: function($self) {
            $self.on('focus', function() {
                $(this).prop('type', 'password');
            });
        },

        /**
         * 日期范围选择器
         * @param $self <jQuery> jQuery对象
         */
        daterangepicker: function($self) {
            var that = this,
                showType = that.options.showType;

            var options = {
                // 选定日期后自动关闭
                autoApply: true,

                // 限定可选日期范围
                dateLimit: {
                    "days": 31
                },

                locale: {
                    format: 'YYYY/MM/DD',
                    customRangeLabel: '自定义日期',
                    firstDay: 1
                },

                alwaysShowCalendars: true
            };

            if(showType == "search") {
                _.extend(options, {
                    ranges: {
                        '今天': [moment(), moment()],
                        '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        '最近7天': [moment().subtract(6, 'days'), moment()],
                        '最近30天': [moment().subtract(29, 'days'), moment()],
                        '本月': [moment().startOf('month'), moment().endOf('month')],
                        '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    }
                })
            }

            $self.daterangepicker(options, function(startMoment, endMoment) {
                //$self.attr('data-startDate', startMoment.formatPureYMD());
                //$self.attr('data-endDate', endMoment.formatPureYMD());
            });
        },

        provinceCityArea: function($self) {
            var $province = $('<select data-name="province" class="form-control form-control-inline" />');
            var $city = $('<select data-name="city" class="form-control form-control-inline" />');
            var $area = $('<select data-name="areaNo" class="form-control form-control-inline" />');

            $self.prepend($province, $city, $area);

            CommonUI.address($province, $city, $area);
        },

        /**
         * ajax select
         * @param $self
         */
        ajaxSelect: function($self) {
            var obj = {
                name: $self.attr('name'),
                type: $self.attr('data-type')
            };
            var searchConf = _.findWhere(this.gridOptions.colModel, obj);

            var $parent =$self.parent();

            var searchOption = searchConf.searchOption;
            var $ajaxSelect = _buildSelect(searchOption.value, obj.name);

            $ajaxSelect.on('change', searchOption.onAjaxSelectChange||function(){});

            $parent.empty().append($ajaxSelect);

            function _buildSelect(selValue, selName) {
                var $select = $('<select name="'+selName+'" class="form-control" style="width:auto;" />'),
                    optionStr = "";

                _.each(selValue, function(v, k) {
                    optionStr += '<option value="'+k+'">'+v+'</option>';
                });

                return $select.html(optionStr);
            }
        },

        /**
         * 管理员和收银员下的登录名
         * @param $target
         */
        /*loginName: function($target) {
            // 收银员
            var loginNameTpl0 = [
                '<span class="input-group-addon"><%=prefix%>@</span>',
                '<input name="'+$target.attr('data-name')+'" class="form-control ignore">'
            ].join('');

            // 管理员
            var loginNameTpl1 = [
                '<input name="'+$target.attr('data-name')+'" class="form-control ignore">',
                '<span class="input-group-addon">@<%=suffix%></span>'
            ].join('');

            var loginNameTpl;

            $target.on('loginName:switch', function(e, p) {
                switch(p.val) {
                    // 收银员
                    case "0":
                        loginNameTpl = _.template(loginNameTpl0)({prefix: p.prefix});
                        break;

                    // 管理员
                    case "1":
                        loginNameTpl = _.template(loginNameTpl1)({suffix: p.suffix});
                        break;

                    default:
                        break;
                }
                $target.empty().html(loginNameTpl);
            });
        }*/
    };

    return Marionette.ItemView.extend({
        template: confTplFn,

        className: 'config-panel',

        ui: {
            gridForm: 'form[name^="gridForm"]',
            gridComponents: '[data-type]'
        },

        initialize: function(options) {
            this.confOptions = options||{};
            this.gridOptions = this.confOptions.contentConf||{};
            this.render();
        },

        serializeData: function() {
            return this.confOptions
        },

        // trigger event name: before:submit
        onBeforeSubmit: function() {
            return this.ui.gridForm.validate().form();
        },

        onRender: function() {
            var that = this,
                ui = that.ui,
                gridOptions = that.gridOptions,
                confOptions = that.confOptions;

            // 初始化组件
            ui.gridComponents.length>0 && that.renderComponents(ui.gridComponents);

            // 绑定校验规则
            if(confOptions.showType !== "search") {
                var validation = confOptions.validation || gridOptions.validation;
                validation && (that.validator = ui.gridForm.validate(validation));
            }

            // 初始化默认值
            confOptions.initData && that.initFormData(confOptions.initData, ui.gridForm);
        },

        getValues: function() {
            var ui = this.ui;
            var $els = ui.gridForm.find('[name]:visible:not(.ignore)');
            var obj = {};

            $.each($els, function() {
                var $el = $(this), value = "";

                if($el.is('[data-type="datepicker"]')) { // datepicker
                    value = dateFormatter($el.val());

                } else if($el.is('[data-type="daterangepicker"]')) { // daterangepicker
                    var dateRangePicker = $el.data('daterangepicker');
                    var startDate = dateRangePicker.startDate.formatPureYMD();
                    var endDate = dateRangePicker.endDate.formatPureYMD();

                    obj.startDate = startDate;
                    obj.endDate = endDate;

                    return;

                } else if($el.is('[data-type="provinceCityArea"]')) {
                    value = $el.find('select[data-name="areaNo"]').val();

                } else if($el.is('[data-with-suffix]')) {
                    /*var _$els = $el.children(),
                        _$prefix = _$els.eq(0),
                        _$suffix = _$els.eq(1),
                        _name = _$els.filter('input').attr('name'),
                        _prefix = _$prefix.is('span')? $.trim(_$prefix.text()):_$prefix.val(),
                        _suffix = _$suffix.is('span')? $.trim(_$suffix.text()):_$suffix.val();

                    value = _prefix+_suffix;

                    obj[_name] = value;

                    return;*/

                    value = $el.val() + $.trim($el.next('.input-group-addon').text());

                } else if($el.is(':checkbox')) {
                    if($el.is('[data-type="radio"]')) {
                        value = $el.is(':checked')? "1":"0";

                    } else if(!obj[$el.attr('name')]) {
                        value = [];

                        var $cbs = $els.filter(':checkbox[name="'+$el.attr('name')+'"]:checked');

                        $cbs.each(function() {
                            value.push($(this).val());
                        });

                        value = value.join(',');
                    } else {
                        return;
                    }
                } else { // other
                    value = $el.val();
                }

                obj[$el.attr('name')] = value;
            });

            return obj;
        },

        renderComponents: function(gridComponents) {
            var that = this;

            $.each(gridComponents, function(idx, self){
                var renderFn = $(self).attr('data-type');

                componentsRender[renderFn] && componentsRender[renderFn].call(that, $(self));
            })
        },

        // 写入默认值
        initFormData: function(formData, $form) {
            $form.find('[name]').each(function() {
                var $el = $(this),
                    name = $el.attr('name'),
                    value = formData[name]||"";

                if($el.is('input') || $el.is('select')) {
                    // select2组件
                    if($el.data('select2')){
                        var _obj = {},
                            _id = $el.attr('data-id'),
                            _key = $el.attr('data-key');

                        _obj[_id] = formData[_id];
                        _obj[_key] = formData[_key];

                        $el.select2('data', _obj);

                        return;
                    }

                    // 其它默认值
                    $el.val(value);

                    // 触发默认事件
                    if($el.is('select')) {
                        $el.trigger('change');
                    }

                } else {}
            });
        },

        // 重置默认值
        reset: function() {
            this.$el.find('[name]').each(function() {
                var $this = $(this);

                if($this.is('[data-type="daterangepicker"]')) {
                    //$this.val('');
                } else if($this.is('[data-type="provinceCityArea"]')) {
                    $this.find('select').each(function(){
                        $(this).children('option').eq(0).attr('selected', 'selected');
                    });
                } else {
                    if($this.is('input')) {
                        $this.val('');
                    } else if($this.is('select')) {

                    } else {}
                }
            });
        }
    })
});
