define(function(require) {
  const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
  const winUpTo = require('game/components/winUpTo');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const gameArea = require('game/components/gameArea');

  function gameReset() {
    winUpTo.reset();
    gameArea.reset();

    // Fade out the win/lose terminator in case it is still playing
    if (audio.isPlaying('winTerminator')) {
      audio.fadeOut('winTerminator', 1);
    }
    if (audio.isPlaying('loseTerminator')) {
      audio.fadeOut('loseTerminator', 1);
    }

    gameFlow.next('BUY_SCREEN');
  }

  gameFlow.handle(gameReset, 'GAME_RESET');
});
