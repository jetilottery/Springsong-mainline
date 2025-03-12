define({
    /*
     * Game configuration options
     * Anything defined here could be overwritten either based on the channel in
     * assetPacks/CHANNEL/layout/gameConfig.js or at an operator level by gameConfig.json in i18n
     */

    // The scale and bounciness of the number match tween
    matchAnimAmplitude: 4,
    matchAnimPeriod: 0.5,
    // Should the HowToPlay screen show when the game loads
    showHowToPlayOnLoad: false,
    // Use AutoPlay with toggle start/stop rather than single use RevealAll
    toggleAutoPlay: false,
    // Time between each number being revealed in autoplay. 0 for instant reaveal.
    autoPlayPlayerNumberInterval: 0.2,
    //delay between the last symbol and the prize in auto play
    autoPlayPrizeDelay: 0.1,

    // Time between the revealing the winning numbers section and the player numbers section
    autoPlayGameDelay: 0.1,

    autoPlayRowDelay : 0.2,

    autoPlaySingleSound:true,
    // Time between idle animations
    idleTimerValue: 2,

    idleFrequencyValue: 1,

    idleVariance: 0.2,

    resultMusicFadeOutDuration: 0,
    // Time between entering the result screen and the terminator audio starting
    resultTerminatorFadeInDelay: 0,
    // Time over which the terminator audio will fade in
    resultTerminatorFadeInDuration: 0.5,
    // Should the Result screen show when ticket is complete
    showResultScreen: true
});
