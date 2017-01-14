define(['jquery', 'underscore'], function() {


    //mock ajax data
    var PLUGIN_MOCK = {
        name: 'mock',
        enable: true,
        path: 'debug/mock',
        fn: function() {
            log(' require mock success');
        }
    };

    //show media infomation in screen
    var PLUGIN_MEDIA = {
        name: 'media',
        enable: false,
        path: 'debug/screen',
        fn: function() {
            log(' require media info success');
        }
    };

    //refresh css auto
    var PLUGIN_CSS_REFRESH = {
        name: 'cssRefresh',
        enable: false,
        path: 'debug/cssrefresh',
        fn: function(CssRefresh) {
            log(' require cssrefresh success');
            var refreher = new CssRefresh();
            $('<button state="0">CSS自动</button>').click(function() {
                var state = parseInt($(this).attr('state'), 10);
                var newState = state ^ 1;
                var newText = ['CSS自动', '停止CSS自动'][newState];
                //如果本来在运行
                if (newState) {
                    refreher.startAuto();
                } else {
                    refreher.stop();
                }
                $(this).attr('state', newState);
                $(this).text(newText);
            }).css({}).appendTo(toolbar);
        }
    };

    var PLUGINS = [PLUGIN_MOCK, PLUGIN_MEDIA, PLUGIN_CSS_REFRESH];

    var requirePaths = [];
    var order = [];

    //pluck the really need plugins path
    _.each(PLUGINS, function(item) {
        if (item.enable !== false) {
            order.push(item);
            //如果require数组的末尾是空参数，则在define的回调里面就没有对应的参数
            //这里用个假文件hack一下
            requirePaths.push(item.path || 'debug/_hack');
        }
    });

    log(' go to require ', order);

    requirePaths.length && require(requirePaths, function() {
        log(requirePaths);
        var args = arguments;
        _.each(arguments, function(val, idx) {
            order[idx].fn && order[idx].fn(args[idx]);
        });
    });

    function log(msg) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift('deg mode: ');
        var fn = console.log;
        fn.apply(console, args);
    }

});