/**
 * require配置
 */
requirejs.config({

  deps: ['json2','bowser', 'jquery', 'bootstrap','jquery-ui','marionette','moment.override','fwk/framework'],

  urlArgs: '_ts=201606081650', //+new Date().getTime(),//打包的时候会替换掉时间戳_ts=201606081650

  waitSeconds: 0,//不使用超时机制
  baseUrl : 'js/',
  paths : {
    'mockajax'           : 'vendor/jquery.mockjax',
    'url'                : 'url',
    'bootstrap'          : 'vendor/bootstrap',
    'backbone'           : 'vendor/backbone',
    'jquery'             : 'vendor/jquery-1.10.2',
    'json2'              : 'vendor/json2',
    'marionette'         : 'vendor/backbone.marionette',
    'underscore'         : 'vendor/underscore',
    'tpl'                : 'vendor/tpl',
    'jquery.validate.origin' : 'vendor/jquery.validate',
    'jquery.validate'      : 'override/jquery.validate.override',
    'jquery.edValidate'  : 'fwk/validate.ed',
    'bootbox'            : 'vendor/bootbox',
    'bowser'             : 'vendor/bowser',
    'moment.override'    : 'override/moment.override',
    'moment'             : 'vendor/moment',
    'datepicker'      : 'vendor/bootstrap-datepicker',
    'daterangepicker'      : 'vendor/bootstrap-daterangepicker',
    'fancybox'      : 'vendor/jquery.fancybox',
    'fancybox-buttons' : 'vendor/jquery.fancybox-buttons',
    'fancybox-thumbs'  : 'vendor/jquery.fancybox-thumbs',
    'jquery-ui': 'vendor/jquery-ui-1.10.4.custom',
    'fastclick': 'vendor/fastclick',
    'backbone.paginator': 'vendor/backbone.paginator',
    'select2': 'vendor/select2'
  },

  shim : {
    'moment.override': {
      deps: ['moment']
    },
    'mockajax': {
      deps: ['jquery']
    },    
    'bootstrap': {
      deps: ['jquery']
    },   
    'jquery-ui': {
      deps: ['jquery']
    },

    'url': {
      exports: 'url'
    },

    'backbone': {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    'marionette': {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    'fancybox-buttons': {
      deps: ['fancybox']
    },
    'fancybox-thumbs': {
      deps: ['fancybox']
    },
    'jquery.validate'      : ['jquery']
  }
});

//var OPEN_DEBUG = /.*?.*debug/.test(window.location.href);

(function (global) {
  require(['json2','bowser', 'jquery', 'bootstrap','jquery-ui','marionette','moment.override','fwk/framework'], function(){
    main();
  });

  function main () {
    //TODO refactor 为了把index.html里面的文件依赖过来，暂时在最外层包一下，保证安全,
    require([
      'fastclick'
      //OPEN_DEBUG ? 'debug/debug' : ''
    ], function(FastClick) {
      FastClick.attach(document.body);

      require(['app/context'], function(Context) {
        global.Ctx = Context;
        global.Ctx.load(startApp);
      });
    });
  }
  

  function confirmChangePsw(callback) {

    if (!Ctx.enableForceChangeInitPsw) {
      callback();
      return;
    }

    Opf.ajax({
      url: 'api/entry/pws-status',
      success: onSuccess
    });

    function changePswDiag4Inig() {
      require(['app/entry/repair-password'], function(PswDialogApis) {
        PswDialogApis.showChangePswDiag4Inig();
        App.once('psw:change:success', function() {
          callback();
        });
        App.once('psw:skip:success', callback);
      });

    }

    function onSuccess(resp) {
      if (parseInt(resp.data.isPwsChanged, 10) === 0) {
        changePswDiag4Inig();
      } else {
        callback();
      }
    }
  }

  function startApp() {
    //now start sub app with parent app (default config `startWithParent` true)
    require(['app'], function(App) {

      confirmChangePsw(function() {
        // $(".loadingAllIndicator").remove();
        App.start();
      });

    });
  }

})(this);
