define(require => {
        const PIXI = require('com/pixijs/pixi');
        const PlayerSymbol = require('game/components/PlayerSymbol');
        const GamePrize = require('game/components/GamePrize');
        const displayList = require('skbJet/componentManchester/standardIW/displayList');
        const meterData = require('skbJet/componentManchester/standardIW/meterData');
        const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
        const audio = require('skbJet/componentManchester/standardIW/audio');
        const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
        const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

        require('com/gsap/TweenMax');
        require('com/gsap/easing/EasePack');

        const Tween = window.TweenMax;

        class SingleGame extends PIXI.Container {
            constructor(inNum) {
                super();

                this.displayObjects = [];
                this.symbolRevealedArray = [];
                this.matched = false;

                this.revealed = false;
                this.revealing = false;
                this.manualReveal = false;

                this.symbolsClicked = 0;

                // Add text for label
                this.label = displayList['label' + inNum];
                this.label.text = inNum;

                // We need a prize
                this.prize = GamePrize.fromContainer(displayList['prize' + inNum]);
                this.prize.name = 'prize';


                // We need five player symbols
                this.symbols = [];
                for (var i = 0; i < 5; i++) {
                    this.symbols[i] = PlayerSymbol.fromContainer(displayList['symbol_' + inNum + '_' + (i + 1)]);
                    this.symbols[i].name = 'symbol' + (i + 1);
                    this.symbols[i].game = this;
                }

                this.displayObjects = this.symbols.slice();
                this.prize.singleGameRef = this.displayObjects;

                this.displayObjects.push(this.prize);

                //_this = this;

                //msgBus.subscribe('Game.PrizeRevealed', this.checkComplete);

                let gameRef = this;

                msgBus.subscribe('Game.symbolClicked', (data)=>{
                    if (data.game === gameRef) {
                        this.symbolsClicked++;

                        if (this.symbolsClicked === 5) {
                            this.prize.enabled = false;
                        }
                    }
                });
            }

            populate(inData, inPrize) {
                this.prize.populate(inPrize);
                for (var i = 0; i < 5; i++) {
                    this.symbols[i].populate(inData[i]);
                    this.symbols[i].value = inData[i];
                }
            }

            enable() {
                //this enable function is not like that for the prize and symbols
                //this one needs to be more like the playerNumbers/winningNumbers
                //so we need to await the prize enabled and uncovered
                // Return an array of promises for each card's lifecycle


                return this.displayObjects.map(async sym => {
                    // Enable the card and wait for it to be revealed (manually or automatically)
                    await sym.enable();
                    // Restart the idle timer tween
                    //idleTween.play(0);
                    // Play the Player Number reveal audio
                    //audio.playSequential('playerNumber');
                    // Get the next Winning Number
                    //const nextData = numbers.shift();
                    // Populate the card with the next Player Number, ready to be uncovered
                    //card.populate(nextData);
                    // Wait for the uncover animation (if animated)

                    if (sym instanceof PlayerSymbol) {
                        msgBus.publish('singlePrizeReveal.add', {symbols: sym, game: this.label.text});
                    }

                    await sym.uncover();

                    if (autoPlay.enabled && gameConfig.autoPlaySingleSound) {
                        this.prize.reveal();
                        if (this.revealing) {
                            this.checkMatch(sym);
                        }
                    } else {
                        this.checkMatch(sym);
                    }
                    // If the revealed number matches a revealed Winning Number then mark the match
                    /*if (!card.matched && numberState.winning.includes(nextData[0])) {
                      card.match();
                      audio.playSequential('match');
                      meterData.win += card.value;
                      await card.presentWin();
                    }*/
                });

                //console.log('MOOPY MOOPY MOOPY');

                /*return new Promise(resolve => {
                  this.reveal = resolve;
                  this.enabled = true;
                  //and enable the prize and symbols
                  this.prize.enable();
                  //and now the symbols
                  this.symbols.map(sym => sym.enable());
                }).then(() => {
                  this.enabled = false;
                });*/
            }

            checkMatch(sym) {

                let _this = this;
                //if this is a prize symbol, we need to push it to the array
                if (sym.type === 'symbol') {
                    this.symbolRevealedArray.push(sym.value);
                } else {
                    //if we have just revealed the prize we don't need to calculate the match
                    //we just need to check if the game has been completed
                    this.checkComplete();
                    return;
                }

                var countA = 0, countB = 0, countC = 0, countD = 0, countE = 0, countF = 0, countG = 0, countH = 0;
                var i = 0;
                var iwFound = false;

                for (i = 0; i < this.symbolRevealedArray.length; i++) {
                    //let's count
                    switch (this.symbolRevealedArray[i]) {
                        case "A":
                            countA++;
                            break;
                        case "B":
                            countB++;
                            break;
                        case "C":
                            countC++;
                            break;
                        case "D":
                            countD++;
                            break;
                        case "E":
                            countE++;
                            break;
                        case "F":
                            countF++;
                            break;
                        case "G":
                            countG++;
                            break;
                        case "H":
                            countH++;
                            break;
                        case 'X':
                            //we have found an instant win
                            iwFound = true;
                            break;
                    }
                }

                //are any of them 3?
                if (countA === 3 || countB === 3 || countC === 3 || countD === 3 || countE === 3 || countF === 3 || countG === 3 || countH === 3) {
                    //yes, rrun through the symbols array and play the animation for this symbol
                    for (i = 0; i < this.symbols.length; i++) {
                        if (this.symbols[i].value === sym.value) {
                            if (!this.matched) {
                                Object.keys(this.symbols).forEach((e) => {
                                        if (this.symbols[e].value === sym.value) {
                                            if (autoPlay.enabled && !_this.manualReveal) {
                                                if (!gameConfig.autoPlaySingleSound) {
                                                    this.symbols[e].match(sym.value);
                                                    audio.playSequential('winningNumber');
                                                }
                                            } else {
                                                this.symbols[e].match(sym.value);
                                                audio.playSequential('winningNumber');
                                            }
                                        }
                                    }
                                );

                                this.prize.win.visible = true;

                                this.prize.switchToWin();

                                this.prize.noWin.visible = false;

                                this.matched = true;
                            }
                        }
                    }

                }

//we're never going to find 3 of a kind AND an instant win in the same game
//so simple enough, if we have found an instant win we need to mark it as matched and animate
//the relevant symbol
                if (iwFound) {
                    for (i = 0; i < this.symbols.length; i++) {
                        //run through the array and animate the IW symbol
                        if (this.symbols[i].value === sym.value) {
                            if (!this.matched) {
                                this.symbols[i].match(sym.value);
                                audio.playSequential('instantWin');
                                this.prize.win.visible = true;

                                this.prize.switchToWin();

                                this.prize.noWin.visible = false;
                                this.matched = true;
                            }
                        }
                    }
                }

//we need to auto reveal the prize once we have revealed all five symbols
                if (this.symbolRevealedArray.length === 5) {
                    if (!this.prize.revealed) {
                        this.revealing = true;

                        if (gameConfig.autoPlaySingleSound) {
                            msgBus.publish('singlePrizeReveal.completeStore', {index: this.label.text});
                        }
                        Tween.delayedCall(gameConfig.autoPlayPrizeDelay, this.prize.reveal);
                    } else {
                        this.revealing = true;

                        if (gameConfig.autoPlaySingleSound) {
                            msgBus.publish('singlePrizeReveal.completeStore', {index: this.label.text});
                        }
                        this.checkComplete();
                    }
                }
            }

            checkComplete() {
                if (this.symbolRevealedArray.length === 5 && this.prize.revealed) {
                    if (this.matched) {

                        Object.keys(this.symbols).forEach((e) => {
                            if (this.symbols[e].noWinState) {
                                Tween.delayedCall(0.2, () => {
                                    this.symbols[e].lose(this.symbols[e].value);
                                    this.revealing = false;
                                });
                            }

                        });

                        //and update the footer with the prize value
                        meterData.win += this.prize.value;
                    } else {
                        Object.keys(this.symbols).forEach((e) => {
                            Tween.delayedCall(0.2, () => {
                                this.symbols[e].lose(this.symbols[e].value);
                                this.prize.switchToLose();
                                this.revealing = false;
                            });
                        });
                    }
                }

                this.revealed = true;
            }

            revealAll() {

                if (gameConfig.autoPlaySingleSound) {
                    audio.playSequential('playerNumber');
                }
                Object.keys(this.symbols).forEach((e, i) => {
                    Tween.delayedCall(gameConfig.autoPlayPlayerNumberInterval * i, this.symbols[e].reveal);
                });
            }

            reset() {
                this.symbolRevealedArray = [];
                this.matched = false;
                this.revealed = false;
                this.revealing = false;
                this.symbolsClicked = 0;
                this.prize.reset();
                this.parent.alpha = 1;
                this.prize.win.visible = false;
                this.prize.noWin.visible = true;
                for (var i = 0; i < 5; i++) {
                    this.symbols[i].reset();
                }
                this.manualReveal = false;
            }


            static fromContainer(container, inNum) {
                const game = new SingleGame(inNum);
                container.addChild(game);
                return game;
            }
        }

        return SingleGame;
    }
);
