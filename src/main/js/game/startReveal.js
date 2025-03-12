define(function(require) {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');

    const gameArea = require('game/components/gameArea');
    const revealAll = require('game/revealAll');
    const singlePrizeReveal = require('game/components/singlePrizeReveal');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');

    async function startReveal() {

        // Listen for autoplay activation which triggers the remaining cards to reveal automatically
        msgBus.subscribe('Game.AutoPlayStart', revealAll.start);

        // Listen for autoplay deactivation which cancels the revealAll timeline
        msgBus.subscribe('Game.AutoPlayStop', revealAll.stop);
        msgBus.publish('idle.run',true);
        msgBus.publish('singlePrizeReveal.reset');

        // Enable all of the winning numbers and player numbers, wait until they are all revealed
        await gameArea.enable();
        if(autoPlay.enabled && gameConfig.autoPlaySingleSound) {
            msgBus.publish('singlePrizeReveal.reveal', revealAll);
            await singlePrizeReveal.complete;
        }


        // continue to the next state
        gameFlow.next('REVEAL_COMPLETE');
    }

    gameFlow.handle(startReveal, 'START_REVEAL');
});
