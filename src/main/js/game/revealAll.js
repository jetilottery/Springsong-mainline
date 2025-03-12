define(require => {
    const Timeline = require('com/gsap/TimelineLite');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const gameArea = require('game/components/gameArea');

    let revealAllTimeline;

    function start() {
        const revealGame = gameArea.revealAll();

        revealAllTimeline = new Timeline();

        // disable all interaction at the parent container level
        displayList.gameContainers.interactiveChildren = false;

        // Then the player numbers, with a delay between the winning and player numbers
        revealAllTimeline = new Timeline({
            tweens: revealGame,
            align: 'sequence',
            stagger: gameConfig.autoPlayGameDelay,
        });

        return revealAllTimeline;
    }

    function stop() {
        // re-enable all interaction at the parent container level
        displayList.gameContainers.interactiveChildren = true;
        // kill the revealAll timeline if active
        if (revealAllTimeline) {
            revealAllTimeline.kill();
            revealAllTimeline = undefined;
        }
    }

    return {
        start,
        stop,
    };
});
