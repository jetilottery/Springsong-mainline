define(require => {
    const PIXI = require('com/pixijs/pixi');
    const Pressable = require('skbJet/componentManchester/standardIW/components/pressable');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const utils = require('skbJet/componentManchester/standardIW/layout/utils');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');

    require('com/gsap/TweenLite');
    require('com/gsap/easing/EasePack');

    const Tween = window.TweenLite;

    const coverFrameName = 'symbolsCover';
    const backgroundFrameName = 'symbolsBackground';
    const symbol1FrameName = 'symbol1';
    const symbol2FrameName = 'symbol2';
    const symbol3FrameName = 'symbol3';
    const symbol4FrameName = 'symbol4';
    const symbol5FrameName = 'symbol5';
    const symbol6FrameName = 'symbol6';
    const symbol7FrameName = 'symbol7';
    const symbol8FrameName = 'symbol8';
    const symbol1FrameNameLose = 'symbol1NoWin';
    const symbol2FrameNameLose = 'symbol2NoWin';
    const symbol3FrameNameLose = 'symbol3NoWin';
    const symbol4FrameNameLose = 'symbol4NoWin';
    const symbol5FrameNameLose = 'symbol5NoWin';
    const symbol6FrameNameLose = 'symbol6NoWin';
    const symbol7FrameNameLose = 'symbol7NoWin';
    const symbol8FrameNameLose = 'symbol8NoWin';
    const symbolIWFrameName = 'symbolInstantWin';

    class PlayerSymbol extends Pressable {
        constructor() {
            super();

            this.WIDTH = 106;
            this.HEIGHT = 78;

            //create cover
            this.cover = new PIXI.Sprite();
            this.cover.anchor.set(0.5);
            this.cover.texture = PIXI.Texture.fromFrame(coverFrameName);

            this.winAnim = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.winAnim.anchor.set(0.5);

            this.winAnim.loop = true;
            this.winAnim.visible = false;

            //create cover
            this.background = new PIXI.Sprite();
            this.background.anchor.set(0.5);
            if(PIXI.utils.TextureCache[backgroundFrameName]) {
                this.background.texture = PIXI.Texture.fromFrame(backgroundFrameName);
            }

            //result container
            this.resultContainer = new PIXI.Container();
            this.resultContainer.visible = false;
            //symbols
            this.symbol1 = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbol2 = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbol3 = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbol4 = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbol5 = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbol6 = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbol7 = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbol8 = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbolIW = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.symbol1.anchor.set(0.5);
            this.symbol2.anchor.set(0.5);
            this.symbol3.anchor.set(0.5);
            this.symbol4.anchor.set(0.5);
            this.symbol5.anchor.set(0.5);
            this.symbol6.anchor.set(0.5);
            this.symbol7.anchor.set(0.5);
            this.symbol8.anchor.set(0.5);
            this.symbolIW.anchor.set(0.5);
            //set textures
            this.symbol1.texture = PIXI.Texture.fromFrame(symbol1FrameName);
            this.symbol2.texture = PIXI.Texture.fromFrame(symbol2FrameName);
            this.symbol3.texture = PIXI.Texture.fromFrame(symbol3FrameName);
            this.symbol4.texture = PIXI.Texture.fromFrame(symbol4FrameName);
            this.symbol5.texture = PIXI.Texture.fromFrame(symbol5FrameName);
            this.symbol6.texture = PIXI.Texture.fromFrame(symbol6FrameName);
            this.symbol7.texture = PIXI.Texture.fromFrame(symbol7FrameName);
            this.symbol8.texture = PIXI.Texture.fromFrame(symbol8FrameName);
            this.symbolIW.texture = PIXI.Texture.fromFrame(symbolIWFrameName);
            this.symbol1.visible = this.symbol2.visible = this.symbol3.visible = this.symbol4.visible = this.symbol5.visible = this.symbol6.visible = this.symbol7.visible = this.symbol8.visible = this.symbolIW.visible = false;
            //add symbols to result container
            this.resultContainer.addChild(this.symbol1, this.symbol2, this.symbol3, this.symbol4, this.symbol5, this.symbol6, this.symbol7, this.symbol8, this.symbolIW);

            //create reveal and idle anims
            this.revealAnim = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.revealAnim.loop = false;
            this.revealAnim.visible = false;
            this.revealAnim.anchor.set(0.5);

            const revealAnimFrames = utils.findFrameSequence('symbolCover');
            this.revealAnim.textures = revealAnimFrames.map(PIXI.Texture.from);

            this.addChild(this.background, this.resultContainer, this.winAnim, this.revealAnim, this.cover);

            const idleAnimFrames = utils.findFrameSequence('symbolsCover');

            if(idleAnimFrames.length > 0) {
                this.idleAnim = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
                this.idleAnim.loop = false;
                this.idleAnim.visible = false;

                this.idleAnim.anchor.set(0.5);

                this.idleAnim.textures = idleAnimFrames.map(PIXI.Texture.from);

                this.addChild(this.idleAnim);

                msgBus.publish('idle.add', this);
            }

            // State
            this.revealed = false;
            this.interactive = false;
            this.enabled = false;
            this.type = 'symbol';

            this.noWinState = true;

            // Interactivity
            this.hitArea = new PIXI.Rectangle(
                this.WIDTH / -2,
                this.HEIGHT / -2,
                this.WIDTH,
                this.HEIGHT
            );

            //event listener
            this.on('press', () => {
                if (!autoPlay.enabled) {
                    this.reveal();
                    this.prizeLock();
                    msgBus.publish('idle.reset');
                }
            });
        }

        enable() {
            return new Promise(resolve => {
                this.reveal = resolve;
                this.enabled = true;
            }).then(() => {
                this.enabled = false;
            });
        }

        populate(inVal) {
            switch (inVal) {
                case 'A':
                    this.symbol1.visible = true;
                    break;
                case 'B':
                    this.symbol2.visible = true;
                    break;
                case 'C':
                    this.symbol3.visible = true;
                    break;
                case 'D':
                    this.symbol4.visible = true;
                    break;
                case 'E':
                    this.symbol5.visible = true;
                    break;
                case 'F':
                    this.symbol6.visible = true;
                    break;
                case 'G':
                    this.symbol7.visible = true;
                    break;
                case 'H':
                    this.symbol8.visible = true;
                    break;
                case 'X':
                    this.symbolIW.visible = true;
                    break;
            }
        }

        reset() {
            this.symbol1.texture = PIXI.Texture.fromFrame(symbol1FrameName);
            this.symbol2.texture = PIXI.Texture.fromFrame(symbol2FrameName);
            this.symbol3.texture = PIXI.Texture.fromFrame(symbol3FrameName);
            this.symbol4.texture = PIXI.Texture.fromFrame(symbol4FrameName);
            this.symbol5.texture = PIXI.Texture.fromFrame(symbol5FrameName);
            this.symbol6.texture = PIXI.Texture.fromFrame(symbol6FrameName);
            this.symbol7.texture = PIXI.Texture.fromFrame(symbol7FrameName);
            this.symbol8.texture = PIXI.Texture.fromFrame(symbol8FrameName);

            this.noWinState = true;
            this.winAnim.gotoAndStop(0);
            this.winAnim.visible = false;

            this.symbol1.visible = this.symbol2.visible = this.symbol3.visible = this.symbol4.visible = this.symbol5.visible = this.symbol6.visible = this.symbol7.visible = this.symbol8.visible = this.symbolIW.visible = false;
            this.resultContainer.visible = false;
            this.cover.visible = true;
            this.alpha = 1;
        }

        lose(inVal) {
            switch (inVal) {
                case 'A':
                    this.symbol1.textures = utils.findFrameSequence(symbol1FrameNameLose).map(PIXI.Texture.from);
                    break;
                case 'B':
                    this.symbol2.textures = utils.findFrameSequence(symbol2FrameNameLose).map(PIXI.Texture.from);
                    break;
                case 'C':
                    this.symbol3.textures = utils.findFrameSequence(symbol3FrameNameLose).map(PIXI.Texture.from);
                    break;
                case 'D':
                    this.symbol4.textures = utils.findFrameSequence(symbol4FrameNameLose).map(PIXI.Texture.from);
                    break;
                case 'E':
                    this.symbol5.textures = utils.findFrameSequence(symbol5FrameNameLose).map(PIXI.Texture.from);
                    break;
                case 'F':
                    this.symbol6.textures = utils.findFrameSequence(symbol6FrameNameLose).map(PIXI.Texture.from);
                    break;
                case 'G':
                    this.symbol7.textures = utils.findFrameSequence(symbol7FrameNameLose).map(PIXI.Texture.from);
                    break;
                case 'H':
                    this.symbol8.textures = utils.findFrameSequence(symbol8FrameNameLose).map(PIXI.Texture.from);
                    break;
                case 'X':
                    this.symbolIW.textures = utils.findFrameSequence(symbol8FrameNameLose).map(PIXI.Texture.from);
                    break;
            }
            console.log('match');
        }

        prizeLock() {
            msgBus.publish('Game.symbolClicked',{game:this.game});
        }

        match(inVal) {

            let frameValue;

            switch (inVal) {
                case 'A':
                    frameValue = 'symbol1_';
                    break;
                case 'B':
                    frameValue = 'symbol2_';
                    break;
                case 'C':
                    frameValue = 'symbol3_';
                    break;
                case 'D':
                    frameValue = 'symbol4_';
                    break;
                case 'E':
                    frameValue = 'symbol5_';
                    break;
                case 'F':
                    frameValue = 'symbol6_';
                    break;
                case 'G':
                    frameValue = 'symbol7_';
                    break;
                case 'H':
                    frameValue = 'symbol8_';
                    break;
                case 'X': {
                    frameValue = 'symbolInstantWin_';
                    break;
                }
            }
            this.noWinState = false;

            if(utils.findFrameSequence(frameValue).length > 0){

                this.winAnim.visible = true;

                const winAnimFrames = utils.findFrameSequence(frameValue);
                this.winAnim.textures = winAnimFrames.map(PIXI.Texture.from);

                if(this.winAnim.textures.length > 1) {
                    this.winAnim.gotoAndPlay(0);
                }

                this.symbol1.visible = false;
                this.symbol2.visible = false;
                this.symbol3.visible = false;
                this.symbol4.visible = false;
                this.symbol5.visible = false;
                this.symbol6.visible = false;
                this.symbol7.visible = false;
                this.symbol8.visible = false;
                this.symbolIW.visible = false;

            } else {

                frameValue = frameValue.substring(0, frameValue.length - 1);

                if(frameValue === "symbolInstantWin") {
                    this['symbolIW'].texture = PIXI.Texture.from(frameValue);
                    this['symbolIW'].visible = true;
                } else {
                    this[frameValue].texture = PIXI.Texture.from(frameValue+'Win');
                    this[frameValue].visible = true;
                }
            }

            console.log('match');
        }

        async uncover() {

            msgBus.publish('idle.reset');

            if(!autoPlay.enabled) {
                audio.playSequential('playerNumber');
            } else {
                if(!gameConfig.autoPlaySingleSound) {
                    audio.playSequential('playerNumber');
                }
            }
            this.cover.visible = false;
            if (this.revealAnim.textures && this.revealAnim.textures.length > 1) {
                await new Promise(resolve => {
                    // bring to front in case the animation overlaps neighboring cards
                    this.revealAnim.parent.parent.parent.setChildIndex(
                        this.revealAnim.parent.parent,
                        this.revealAnim.parent.parent.parent.children.length - 1
                    );

                    // Calculate the animation's duration in seconds
                    const duration = this.revealAnim.textures.length / this.revealAnim.animationSpeed / 60;
                    const halfDuration = duration / 2;
                    // Tween in the results over the 2nd half of the animation
                    this.revealAnim.visible = true;
                    this.resultContainer.visible = true;
                    Tween.fromTo(
                        this.resultContainer,
                        halfDuration,
                        {alpha: 0},
                        {
                            alpha: 1,
                            delay: halfDuration,
                        }
                    );

                    // Wait for the animation to complete before resolving
                    this.revealAnim.onComplete = () => {
                        this.revealAnim.visible = false;
                        this.revealed = true;
                        resolve();
                    };

                    // Disable interactivity to prevent re-reveal, then switch to the animation
                    this.enabled = false;
                    this.revealAnim.gotoAndPlay(0);
                });
            } else {
                // Otherwise just hide the cover, simple enough
                this.cover.visible = false;
                this.revealAnim.visible = false;
                this.resultContainer.visible = true;
                this.revealed = true;
            }
        }

        static fromContainer(container) {
            const sym = new PlayerSymbol();
            container.addChild(sym);
            return sym;
        }
    }

    return PlayerSymbol;
});
