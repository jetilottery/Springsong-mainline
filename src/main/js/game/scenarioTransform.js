define((require) => {
  const prizeData = require('skbJet/componentManchester/standardIW/prizeData');

  return function scenarioTransform(scenarioString) {
    // split the string into the six individual game scenarios
    const scenarioArr = scenarioString.split('|');
    // the number of games is always 8
    const numberOfGames = 6;
    // init arrays
    let gameScenarios = [];
    let prizes = [];

    for (var i = 0; i < numberOfGames; i++){
      gameScenarios[i] = scenarioArr[i].split(',')[0].split('');
      prizes[i] = prizeData.prizeTable[scenarioArr[i].split(',')[1]];
    }

    return {
      gameScenarios,
      prizes
    };
  };
});
