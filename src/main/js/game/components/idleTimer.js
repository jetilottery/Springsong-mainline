define(require => {
    const PIXI = require('com/pixijs/pixi');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

    let idle = 0;
    let idleMax = undefined;
    let timer = 0;
    let frequency = undefined;
    let variance = undefined;
    let ticker = new PIXI.ticker.Ticker();
    let instances = [];
    let replayBuffer = [];

    function init(data) {
        idleMax = data[0];
        frequency = data[1];
        variance = data[2];

        if (instances.length > 0) {
            ticker.add((delta) => {
                idle += delta;
                if (idle > (idleMax * 1000)) {
                    timer += delta;
                    if (timer > (frequency + (Math.random() * variance) - variance * 2) * 1000) {
                        let inst = selectInstance();
                        timer = 0;

                        if (inst.idleAnim !== undefined && inst.cover.visible) {

                            inst.idleAnim.onComplete = () => {
                                inst.cover.visible = true;
                                inst.idleAnim.visible = false;
                                inst.idleAnim.gotoAndStop(0);

                                if (replayBuffer.length > 3) {
                                    replayBuffer.pop();
                                }

                            };

                            inst.cover.visible = false;
                            inst.idleAnim.visible = true;
                            inst.idleAnim.gotoAndPlay(0);

                            replayBuffer.push(inst);
                        }
                    }
                }
            });

        }
    }

    function selectInstance() {
        if (instances.length > 0) {
            if (instances.indexOf(instances[Math.floor(Math.random() * instances.length)]) > -1) {
                return instances[Math.floor(Math.random() * instances.length)];
            } else {
                selectInstance();
            }
        }
    }


    function add(instObj) {
        instObj.on('click', reset);
        instances.push(instObj);
    }

    function run(val) {
        if (val) {
            ticker.start();
        } else {
            ticker.stop();
            reset();
        }
    }

    function reset() {
        idle = 0;
        timer = 0;

        instances.forEach(e => {
            e.idleAnim.gotoAndStop(0);
            e.idleAnim.visible = false;
        });
    }

    msgBus.subscribe('idle.init', init);
    msgBus.subscribe('idle.add', add);
    msgBus.subscribe('idle.run', run);
    msgBus.subscribe('idle.reset', reset);

});