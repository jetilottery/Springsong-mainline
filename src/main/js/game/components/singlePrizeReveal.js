define(require => {

    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const util = require('game/components/utils');
    const meterData = require('skbJet/componentManchester/standardIW/meterData');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');

    require('com/gsap/TweenMax');
    require('com/gsap/TimelineMax');

    const Tween = window.TweenMax;
    const Timeline = window.TimelineMax;

    let processed = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
    };
    let completeRow = [
        false,
        false,
        false,
        false,
        false,
        false,
    ];
    let _complete = Promise.resolve();

    function add(data) {
        processed[data.game].push(data.symbols);
        // processed.winningNumber[data.game] = data.symbols.value;
    }

    function reset() {
        processed = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
        };
        completeRow = [
            false,
            false,
            false,
            false,
            false,
            false,
        ];
    }

    async function revealAll() {
        _complete = new Promise(resolve => {

            Tween.delayedCall(gameConfig.autoPlayRowDelay, () => {
                let timeline = new Timeline({
                    onComplete: () => {
                        Tween.delayedCall(gameConfig.autoPlayRowDelay, resolve);
                    }
                });

                Object.values(processed).forEach((element, index) => {

                    let winningSymbol = element.map(e => {
                        return e.value;
                    });

                    let common = util.common(winningSymbol);
                    if (!completeRow[index]) {
                        if (common.count === 3) {
                            let winAmmount;
                            timeline.add(Tween.delayedCall(gameConfig.autoPlayRowDelay, () => {
                                element.forEach((e,i,a) => {
                                    if (e.value === common.mostCommon) {
                                        if(!e.game.revealing) {
                                            e.match(common.mostCommon);
                                            e.game.prize.win.visible = true;
                                            e.game.prize.switchToWin();
                                            e.game.prize.noWin.visible = false;

                                            winAmmount = e.game.prize.value;
                                        }
                                    } else {
                                        e.lose(e.value);
                                    }

                                    if(i === a.length - 1 && common.mostCommon === undefined) {
                                        e.game.prize.noWin.visible = true;
                                        e.game.prize.win.visible = false;
                                        e.game.prize.switchToLose();
                                    }
                                });
                                audio.playSequential('winningNumber');
                                meterData.win += winAmmount;

                            }));
                        } else {
                            timeline.add(Tween.delayedCall(gameConfig.autoPlayRowDelay, () => {
                                element.forEach(e => {
                                    if (e.value !== 'X') {
                                        if(winningSymbol.indexOf('X') === -1) {
                                            e.lose(e.value);
                                            e.game.prize.noWin.visible = true;
                                            e.game.prize.win.visible = false;
                                            e.game.prize.switchToLose();
                                        } else {
                                            e.lose(e.value);
                                        }
                                    } else {
                                        if(!e.game.revealing) {
                                            meterData.win += e.game.prize.value;
                                            e.match('X');
                                            e.game.prize.win.visible = true;
                                            e.game.prize.switchToWin();
                                            e.game.prize.noWin.visible = false;
                                            audio.play('bonus');
                                        }
                                    }
                                });
                            }));
                        }
                    }
                });
            });
        });
    }

    function updatedCompleted(data) {
        completeRow[data.index - 1] = true;
    }

    msgBus.subscribe('singlePrizeReveal.add', add);
    msgBus.subscribe('singlePrizeReveal.reset', reset);
    msgBus.subscribe('singlePrizeReveal.reveal', revealAll);
    msgBus.subscribe('singlePrizeReveal.completeStore', updatedCompleted);

    return {
        get complete() {
            return _complete;
        }
    };

})
;