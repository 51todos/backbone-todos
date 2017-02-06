/**
 * main.js
 * 配置requirejs
 */
requirejs.config({
    baseUrl: './',

    // 框架依赖
    deps:['jquery', 'json2', 'bootstrap', 'backbone', 'backbone.marionette', 'backbone.localStorage'],

    // 路径配置
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'json2': '../bower_components/json2/json2',
        'underscore': '../bower_components/underscore/underscore',
        'backbone': '../bower_components/backbone/backbone',
        'backbone.marionette': '../bower_components/backbone.marionette/lib/backbone.marionette',
        'backbone.localStorage': '../bower_components/backbone.localStorage/backbone.localStorage',
        'backbone.radio': '../bower_components/backbone.radio/build/backbone.radio',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'css': '../bower_components/require-css/css',
        'tpl': '../bower_components/text/text'
    },

    // 配置模块依赖
    shim: {
        'backbone.marionette': ['backbone'],
        'backbone.localStorage': ['backbone'],
        //'backbone.syphon': ['backbone'],

        'bootstrap': ['jquery', 'css!../bower_components/bootstrap/dist/css/bootstrap.css']
    },

    // 框架回调
    callback: function() {
        window.Mn = window.Marionette = Backbone.Marionette;

        require(['app', 'test'], function(App, Test) {
            App.start();
            Test.start();
        });
    }
});
