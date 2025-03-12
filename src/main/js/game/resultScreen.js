define(function (require) {
    const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
    const meterData = require('skbJet/componentManchester/standardIW/meterData');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

    require('com/gsap/TweenLite');
    const Tween = window.TweenLite;

    function resultScreen() {
        // ResultPlaques template component handles populating and showing the result screen
        // All that needs doing here is playing the result screen audio
        const terminator = meterData.totalWin > 0 ? 'winTerminator' : 'loseTerminator';
        audio.fadeOut('music', gameConfig.resultMusicFadeOutDuration);

        msgBus.publish('idle.run');


        Tween.delayedCall(gameConfig.resultTerminatorFadeInDelay, () =>
            audio.fadeIn(terminator, gameConfig.resultTerminatorFadeInDuration, false)
        );
    }


    gameFlow.handle(resultScreen, 'RESULT_SCREEN');
});
