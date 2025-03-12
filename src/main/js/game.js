function mainEntry(){
  'use strict';
  
  // Game Namespace - edit here and in webapp/game_settings.json
  var NAMESPACE = 'Template008';

  window.game = window.game || {};
  window.game[NAMESPACE] = window.game[NAMESPACE] || {};
  window.game[NAMESPACE].lib = {Main:function(){}};
  window.game[NAMESPACE].lib.Main.prototype.init = function(config){
    if(config&&config.urlGameFolder){
      require.config({ baseUrl: config.urlGameFolder });
    }
    var _game = this;
    /*eslint-disable */
    requirejs.onResourceLoad = function (context, map, depArray) {
      if (!window.loadedRequireArray) {
          window.loadedRequireArray = [];
      }
      window.loadedRequireArray.push(map.name);
    };
    /*eslint-enable */
    require([
      'skbJet/component/SKBeInstant/SKBeInstant',
      'skbJet/componentManchester/standardIW/gameSize',
      'skbJet/componentManchester/standardIW/loadController',
      'game/gameEntry'
    ], function(SKBeInstant){
      SKBeInstant.init(config, _game);
    });
  };
  //if there is software id in URL parameters then it should be SKB/RGS env
  if(window.location.pathname.match(/launcher\.html$/)){
    require(['skbJet/component/gameMsgBus/PlatformMsgBusAdapter'], function(){
      var gameInstantce = new window.game[NAMESPACE].lib.Main();
      gameInstantce.init();
    });
  }
}
mainEntry();