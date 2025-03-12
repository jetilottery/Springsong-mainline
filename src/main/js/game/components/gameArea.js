define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    //const audio = require('skbJet/componentManchester/standardIW/audio');
    //const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const SingleGame = require('game/components/SingleGame');
    //const numberState = require('game/state/numbers');

    require('com/gsap/TweenLite');
    const Tween = window.TweenLite;

    let games;
    let numberOfGames = 6;
    let prizeCount = 0;
    //let numbers;

    //let idleTween;

    /*function randomIdleDuration() {
      return (
        gameConfig.winningNumberIdleInterval -
        gameConfig.idleIntervalVariation +
        Math.random() * gameConfig.idleIntervalVariation * 2
      );
    }*/

    function init() {
        /*idleTween = Tween.to({}, randomIdleDuration(), {
          onComplete: promptIdle,
          paused: true,
        });*/
        displayList.ticketSelectBar.interactive = false;
        games = [
            SingleGame.fromContainer(displayList.game1, 1),
            SingleGame.fromContainer(displayList.game2, 2),
            SingleGame.fromContainer(displayList.game3, 3),
            SingleGame.fromContainer(displayList.game4, 4),
            SingleGame.fromContainer(displayList.game5, 5),
            SingleGame.fromContainer(displayList.game6, 6),
        ];

        console.log(games);
        console.log(displayList);
        console.log(msgBus);
    }

    /*function promptIdle() {
      // Check if there are any remaining unrevealed cards
      const unrevealed = cards.filter(number => !number.revealed);
      if (unrevealed.length === 0) {
        return;
      }

      // Pick one at random to animate
      unrevealed[Math.floor(unrevealed.length * Math.random())].prompt();

      // Restart the idle timer tween
      idleTween.duration(randomIdleDuration());
      idleTween.play(0);
    }*/

    function checkPrizeClickStatus() {

        prizeCount++;

        if (prizeCount === 6) {
            msgBus.publish('UI.updateButtons', {
                autoPlay: {enabled: false},
                help: {enabled: false}
            });
        }
    }

    async function populate(inData, inPrizes) {
        for (var i = 0; i < numberOfGames; i++) {
            games[i].populate(inData[i], inPrizes[i]);
        }
    }

    function revealAll() {
        // Stop the idle timer tween
        msgBus.publish('idle.run', false);
        // Get all the cards yet to be revealed
        const unrevealed = games.filter(game => !(game.revealed || game.revealing));
        // Return an array of tweens that calls reveal on each card in turn
        return unrevealed.map((game) => Tween.delayedCall(0, game.revealAll, null, game));
    }

    function reset() {
        games.forEach(game => game.reset());
        prizeCount = 0;
    }

    async function enable() {

        await Promise.all([
            ...games[0].enable(),
            ...games[1].enable(),
            ...games[2].enable(),
            ...games[3].enable(),
            ...games[4].enable(),
            ...games[5].enable(),
        ]);
    }

    msgBus.subscribe('Game.PrizeClicked', checkPrizeClickStatus);


    return {
        init,
        populate,
        enable,
        revealAll,
        reset
    };
});
