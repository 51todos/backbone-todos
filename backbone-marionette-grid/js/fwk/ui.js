define(function() {

    var UI = {

        /**
         * options: {
         * title: xx,
         * el: el
         * }
         */
        popDetailDialog: function (options) {
            var $dialog = $(options.el).dialog({
                title: options.title || '',
                autoOpen: true,
                modal: true,
                width: options.width || 526,
                draggable: false,
                resizable: false,
                create: function () {
                    $(this).closest('.ui-dialog').addClass('pop-detail-dialog');
                    $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').addClass('icon-remove');
                },
                open: function(){
                    var $dialog = $(this).closest('.ui-dialog');
                    $dialog.outerWidth(_.min([$dialog.outerWidth(),$(window).width()]));

                },
                close: function(event, ui) {
                    $(this).dialog('destroy');
                }
            });

            return $dialog;
        },

        busyText: function(el, busy, text) {
            var $el = $(el);
            $el.each(function() {
                //TODO li18n
                if (busy !== false) {
                    $(this).addClass('disabled').data('html', $el.html()).text(text || '正在提交...');
                } else {
                    $(this).removeClass('disabled').html($el.data('html'));
                }
            });
        },

        //
        setLoading: function(el, toggle, options) {
            var orgPosition, cachedPos;
            var defaultTop = 45;
            var $el;
            if(arguments.length === 0 || arguments[0] === void 0) {
                el = true;
            }
            if(el === true || el === false) {
                $el = $('#page-body');
                toggle = el;
            }else {
                $el = $(el.el || el);
            }
            if(!$el.length) {
                $el = $(document.body);
            }
            if (toggle !== false) {

                orgPosition = $el.css('position');
                if (orgPosition !== 'relative' && orgPosition !== 'absolute' &&
                    orgPosition !== 'fixed') {
                    $el.data('opf.cache.position', orgPosition);
                    $el.css('position', 'relative');
                }

                var $loader = $([
                    '<div class="loading-overlay">',
                    '<div class="loading-indicator">',
                    '<div class="loading-icon"></div>',
                    '<div class="loading-text"></div>',
                    '</div>',
                    '</div>'
                ].join(''));

                $el.append($loader);
                var $indicator = $loader.find('.loading-indicator');
                var top = Math.min(
                    Math.max($el.height() - $indicator.height(), 0),
                    defaultTop
                );
                $indicator.css('top', top);
                
            } else {

                $el.find('.loading-overlay').remove();

                cachedPos = $el.data('opf.cache.position');
                if (cachedPos !== void 0) {
                    $el.css('position', cachedPos);
                }
            }

        }
    };
    
    return UI;
});