define([
    'marionette',
    'app/model/Mcht',
    'app/view/Nav',
    'app/view/ToolMenu',
    'app/view/TaskQueueMgr',
    'app/controller/Nav'
  ],

  function(Marionette, MchtModel, NavView, ToolMenuView, TaskQueueMgr, NavCtrl) {

    App = new Marionette.Application();

    // 缓存临时事件
    App.__events__ = {};

    App.addRegions({
      txnRegion: '#txn-pane',
      billRegion: "#bill-pane",
      billDownloadRegion: "#bill-download-pane",
      recordRegion: "#record-pane",
      serviceRegion: "#service-pane",
      mchtRegion: "#mcht-pane",
      quotaRegion: "#quota-pane",
      storeRegion: "#store-pane",
      usersRegion: "#users-pane"
    });

    //TODO 封装组件管理器
    App.views = {};
    App.ctrls = {};

    App.getMchtModel = function () {
      return this.mchtModel;
    };

    App.addInitializer(function(options){
      var me = this;

      this.mchtModel = new MchtModel();
      //因为controller和view并不多，所以不使用懒加载

      //用户登陆成功后 mchtModel 只触发一次 sync
      this.mchtModel.on('sync', function (model) {
        $(".loadingAllIndicator").remove();

        App.isPrimaryUser = model.get('userPrimary') != '0';
        
        //因为要判别主辅用户，所以在成功获取用户信息后 创建nav view
        me.views.nav = new NavView();//.render();

        var toolMenuView = new ToolMenuView();

        // model.get('mchtUserName')
        toolMenuView.updateUsername(model.get('mchtUserName'));

        //若为辅用户，删除 基本信息 
        toolMenuView.deleteInfoBy(App.isPrimaryUser);
        
        //render nav view
        _.invoke(me.views, 'render');

        //初始化 nav controller
        me.ctrls.nav = new NavCtrl(me.views.nav);


        me.ctrls.nav.showDefaultTab();
      });

      this.mchtModel.on('error', function(){
        $(".loadingAllIndicator").remove();
        //获取后台数据失败，也显示相应内容
        me.views.nav = new NavView();
        _.invoke(me.views, 'render');
        me.ctrls.nav = new NavCtrl(me.views.nav);
        Opf.alert({title: '抱歉',
            message: '未能正确获取此商户数据'
        });
      });
    });

    //直接抄业管
    App.TaskQueueMgr = TaskQueueMgr;

    App.on("initialize:before", function() {

      console.log('initialize:before');

    });

    App.on("initialize:after", function() {

      console.log('>>>>app initialize:after');
    });

    return App;

  });

