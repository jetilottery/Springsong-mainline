define(require => {
    const PIXI = require('com/pixijs/pixi');
    const Pressable = require('skbJet/componentManchester/standardIW/components/pressable');
    const FittedText = require('skbJet/componentManchester/standardIW/components/fittedText');
    const textStyles = require('skbJet/componentManchester/standardIW/textStyles');
    const resources = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const utils = require('skbJet/componentManchester/standardIW/layout/utils');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');

    require('com/gsap/TweenLite');
    require('com/gsap/easing/EasePack');

    const Tween = window.TweenLite;

    const coverFrameName = 'prizeCover';
    const backgroundFrameName = 'prizeBackground';

    const TEXT_PADDING = 10;

    class GamePrize extends Pressable {
        constructor() {
            super();

            this.WIDTH = 167;
            this.HEIGHT = 78;

            //create a cover container we can add the cover and prize label to
            this.coverContainer = new PIXI.Container();
            //create a resultContainer
            this.resultContainer = new PIXI.Container();

            //create cover
            this.cover = new PIXI.Sprite();
            this.cover.anchor.set(0.5);
            this.cover.texture = PIXI.Texture.fromFrame(coverFrameName);

            //create label
            this.label = new FittedText();
            this.label.anchor.set(0.5);
            this.label.text = resources.i18n.Game.prizeLabel;
            this.label.style = textStyles.parse('prizeCoverText');
            this.label.maxWidth = 75;

            //add to cover container
            this.coverContainer.addChild(this.cover, this.label);

            this.win = new PIXI.Sprite();
            this.noWin = new PIXI.Sprite();
            // Add text for prize value
            this.valueText = new FittedText('XXXXXX');
            this.valueText.anchor.set(0.5);
            this.valueText.style = textStyles.parse('prizeValueNoWin');
            this.valueText.maxWidth = this.WIDTH - TEXT_PADDING * 2;
            this.noWin.addChild(this.valueText);
            this.valueTextWin = new FittedText('XXXXXX');
            this.valueTextWin.anchor.set(0.5);
            this.valueTextWin.style = textStyles.parse('prizeValueWin');
            this.valueTextWin.maxWidth = this.WIDTH - TEXT_PADDING * 2;
            this.win.addChild(this.valueTextWin);
            //hide all
            this.win.visible = this.noWin.visible = false;
            //add to resultContainer
            this.resultContainer.addChild(this.win, this.noWin);
            //hide resultContainer
            this.resultContainer.visible = false;

            this.singleGameRef = undefined;

            //create reveal and idle anims
            this.revealAnim = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);

            const revealAnimFrames = utils.findFrameSequence('prizeCover');
            this.revealAnim.textures = revealAnimFrames.map(PIXI.Texture.from);
            this.revealAnim.anchor.set(0.5);

            this.revealAnim.loop = false;
            this.revealAnim.visible = false;

            this.idleAnim = new PIXI.extras.AnimatedSprite([PIXI.Texture.EMPTY]);
            this.idleAnim.loop = false;
            this.idleAnim.animationSpeed = 0.5;
            this.idleAnim.visible = false;

            //create background
            this.background = new PIXI.Sprite();
            this.background.anchor.set(0.5);
            this.background.texture = PIXI.Texture.fromFrame(coverFrameName);

            //add children to stage
            this.addChild(this.background, this.resultContainer, this.revealAnim, this.idleAnim, this.coverContainer);

            // State
            this.revealed = false;
            this.enabled = false;
            this.type = 'prize';

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
                    if (this.singleGameRef !== undefined) {
                        this.parent.parent.children[2].revealing = true;
                        this.parent.parent.children[2].manualReveal = true;
                        this.revealNumbers(this.singleGameRef);
                    }
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
            this.value = inVal;
            this.valueText.text = SKBeInstant.formatCurrency(this.value).formattedAmount;
            this.valueTextWin.text = this.valueText.text;
            this.noWin.visible = true;
        }

        reset() {
            this.valueText.text = '';
            this.valueTextWin.text = '';
            this.background.texture = PIXI.Texture.from(coverFrameName);
            this.win.visible = this.noWin.visible = false;
            this.coverContainer.visible = true;
            this.revealed = false;
        }

        revealNumbers(sym) {
            this.parent.parent.children[2].revealing = true;
            sym.forEach((e, i) => {
                Tween.delayedCall((0.2 * i), e.reveal);
                e.interactive = false;
            });
        }

        switchToWin() {
            if(PIXI.utils.TextureCache['prizeBackgroundWin']) {
                this.background.texture = PIXI.Texture.from('prizeBackgroundWin');
            }
        }

        switchToLose() {
            if(PIXI.utils.TextureCache['prizeBackground']) {
                this.background.texture = PIXI.Texture.from(backgroundFrameName);
            }
        }


        async uncover() {
            if(!autoPlay.enabled) {
                audio.playSequential('prizeBox');
                this.parent.parent.children[2].revealing = true;

            } else {
                if(!gameConfig.autoPlaySingleSound) {
                    audio.playSequential('prizeBox');
                }
            }
            msgBus.publish('Game.PrizeClicked');
            if (this.revealAnim.textures && this.revealAnim.textures.length > 1) {
                await new Promise(resolve => {
                    // Calculate the animation's duration in seconds
                    const duration = this.revealAnim.textures.length / this.revealAnim.animationSpeed / 60;
                    const halfDuration = duration / 2;
                    // Tween in the results over the 2nd half of the animation

                    this.revealAnim.visible = true;
                    this.coverContainer.visible = false;
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
                this.coverContainer.visible = false;
                this.revealAnim.visible = false;
                this.resultContainer.visible = true;
                this.revealed = true;
            }
        }

        static fromContainer(container) {
            const prize = new GamePrize();
            container.addChild(prize);
            return prize;
        }
    }

    return GamePrize;
});
