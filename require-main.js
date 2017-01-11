/**
 * main.js
 * 配置requirejs
 */
requirejs.config({
    baseUrl: '../bower_components',

    // 框架依赖
    deps:['jquery', 'backbone', 'bootstrap'],

    // 路径配置
    paths: {
        'jquery': 'jquery/dist/jquery',
        'json2': 'json2/json2',
        'underscore': 'underscore/underscore',
        'backbone': 'backbone/backbone',
        'backbone.marionette': 'backbone.marionette/lib/backbone.marionette',
        'css': 'require-css/css',
        'bootstrap': 'bootstrap/dist/js/bootstrap'
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
        //'backbone.relational': ['backbone'],
        //'backbone.syphon': ['backbone'],

        'bootstrap': ['jquery', 'css!../bower_components/bootstrap/dist/css/bootstrap.css']
    },

    // 框架回调
    callback: function() {
        require(['app.js'], function(App) {
            App.start();
        });
    }
});
