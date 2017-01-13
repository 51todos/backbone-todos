/**
 * main.js
 * 配置requirejs
 */

// bower components path
var PATH_BOWER = '../bower_components';

requirejs.config({
    baseUrl: './',

    // 框架依赖
    deps:['jquery', 'backbone', 'bootstrap', 'backbone.localStorage'],

    // 路径配置
    paths: {
        'jquery': PATH_BOWER + '/jquery/dist/jquery',
        'json2': PATH_BOWER + '/json2/json2',
        'underscore': PATH_BOWER + '/underscore/underscore',
        'backbone': PATH_BOWER + '/backbone/backbone',
        'backbone.marionette': PATH_BOWER + '/backbone.marionette/lib/backbone.marionette',
        'backbone.localStorage': PATH_BOWER + '/backbone.localStorage/backbone.localStorage',
        'css': PATH_BOWER + '/require-css/css',
        'bootstrap': PATH_BOWER + '/bootstrap/dist/js/bootstrap'
    },

    // 配置模块依赖
    shim: {
        'backbone.marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'backbone': {
            deps: ['jquery', 'underscore', 'json2'],
            exports: 'Backbone'
        },
        'backbone.localStorage': ['backbone'],
        //'backbone.syphon': ['backbone'],

        'bootstrap': ['jquery', 'css!'+ PATH_BOWER +'/bootstrap/dist/css/bootstrap.css']
    },

    // 框架回调
    callback: function() {
        require(['app'], function(App) {
            App.start();
        });
    }
});
