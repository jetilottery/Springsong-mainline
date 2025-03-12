define({
  _BASE_APP: {
    children: ['background', 'logo', 'winUpTo', 'gameContainers'],
  },

  /*
   * BACKGROUND
   */
  background: {
    type: 'sprite',
    children: ['selectionBackgrounds'],
    landscape: {
      texture: 'landscape_background',
    },
    portrait: {
      texture: 'portrait_background',
    },
  },

  selectionBackgrounds: {
    type: 'sprite',
    landscape: {
      texture: 'landscape_selectionBackgrounds',
      x:28,
      y:84
    },
    portrait: {
      texture: 'portrait_selectionBackgrounds',
        x:0,
        y:0
    },
  },

  /*
   * LOGO
   */
  logo: {
    type: 'sprite',
    anchor: 0.5,
    landscape: {
      x: 299,
      y: 200,
      texture: 'landscape_gameLogo',
    },
    portrait: {
      x: 405,
      y: 153.5,
      texture: 'portrait_gameLogo',
    },
  },

  /*
   * WIN UP TO
   */
  winUpTo: {
    type: 'container',
    children: ['winUpToIn', 'winUpToOut'],
    landscape: { x: 303, y: 390 },
    portrait: { x: 405, y: 286 },
  },
  winUpToIn: {
    type: 'container',
    children: ['winUpToInText','winUpToInValue'],
  },
  winUpToInText: {
    type: 'text',
    style: 'winUpTo',
    string: 'winUpTo',
    align: 'center',
    anchor: 0.5,
    landscape: {
      maxWidth: 550,
      y:-40
    },
    portrait:{
      maxWidth: 780,
      y: 0
    }
  },
  winUpToInValue: {
    type: 'text',
    style: 'winUpToValue',
    align: 'center',
    anchor: 0.5,
    maxWidth: 550,
    landscape: { 
      visible: true,
      y: 30
    },
    portrait: { 
      visible: false,
      y: 0
    },
  },
  winUpToOut: {
    type: 'container',
    children: ['winUpToOutText','winUpToOutValue'],
  },
  winUpToOutText: {
    type: 'text',
    style: 'winUpTo',
    string: 'winUpTo',
    align: 'center',
    anchor: 0.5,    
    landscape: {
      maxWidth: 550,
      y:-40
    },
    portrait:{
      maxWidth: 780,
      y: 0
    }
  },
  winUpToOutValue: {
    type: 'text',
    style: 'winUpToValue',
    align: 'center',
    anchor: 0.5,
    maxWidth: 550,
    landscape: { 
      visible: true,
      y: 30
    },
    portrait: { 
      visible: false,
      y: 0
    },
  },

  /*
   * GAME CONTAINERS
   */

  gameContainers: {
    type: 'container',
    children: ['game1','game2','game3','game4','game5','game6'],
    landscape: { x: 598, y: 84 },
    portrait: { x: 12, y: 390 },
  },
  game1:{
    type: 'container',
    children: ['label1','symbol_1_1','symbol_1_2','symbol_1_3','symbol_1_4','symbol_1_5','prize1']
  },  
  label1: {
    type: 'text',
    style: 'gameNumber',
    anchor: 0.5,
    landscape: { x: 37, y: 45 },
    portrait: { x: 30, y: 47 }
  },
  symbol_1_1: {
    type: 'container',
    landscape: { x: 126, y: 45 },
    portrait: { x: 113, y: 47 },
  },
  symbol_1_2: {
    type: 'container',
    landscape: { x: 238, y: 45 },
    portrait: { x: 223, y: 47 },
  },
  symbol_1_3: {
    type: 'container',
    landscape: { x: 350, y: 45 },
    portrait: { x: 333, y: 47 },
  },
  symbol_1_4: {
    type: 'container',
    landscape: { x: 462, y: 45 },
    portrait: { x: 443, y: 47 },
  },
  symbol_1_5: {
    type: 'container',
    landscape: { x: 574, y: 45 },
    portrait: { x: 553, y: 47 },
  }, 
  prize1: {
    type: 'container',
    landscape: { x: 716.5, y: 45 },
    portrait: { x: 695, y: 47 },
  }, 
  game2:{
    type: 'container',
    children: ['label2','symbol_2_1','symbol_2_2','symbol_2_3','symbol_2_4','symbol_2_5','prize2'],
    landscape: { x: 0, y: 94 },
    portrait: { x: 0, y: 102 },
  },
  label2: {
    type: 'text',
    style: 'gameNumber',
    anchor: 0.5,
    landscape: { x: 37, y: 45 },
    portrait: { x: 30, y: 47 }
  },
  symbol_2_1: {
    type: 'container',
    landscape: { x: 126, y: 45 },
    portrait: { x: 113, y: 47 },
  },
  symbol_2_2: {
    type: 'container',
    landscape: { x: 238, y: 45 },
    portrait: { x: 223, y: 47 },
  },
  symbol_2_3: {
    type: 'container',
    landscape: { x: 350, y: 45 },
    portrait: { x: 333, y: 47 },
  },
  symbol_2_4: {
    type: 'container',
    landscape: { x: 462, y: 45 },
    portrait: { x: 443, y: 47 },
  },
  symbol_2_5: {
    type: 'container',
    landscape: { x: 574, y: 45 },
    portrait: { x: 553, y: 47 },
  }, 
  prize2: {
    type: 'container',
    landscape: { x: 716.5, y: 45 },
    portrait: { x: 695, y: 47 },
  }, 
  game3:{
    type: 'container',
    children: ['label3','symbol_3_1','symbol_3_2','symbol_3_3','symbol_3_4','symbol_3_5','prize3'],
    landscape: { x: 0, y: 188 },
    portrait: { x: 0, y: 204 },
  },
  label3: {
    type: 'text',
    style: 'gameNumber',
    anchor: 0.5,
    landscape: { x: 37, y: 45 },
    portrait: { x: 30, y: 47 }
  },
  symbol_3_1: {
    type: 'container',
    landscape: { x: 126, y: 45 },
    portrait: { x: 113, y: 47 },
  },
  symbol_3_2: {
    type: 'container',
    landscape: { x: 238, y: 45 },
    portrait: { x: 223, y: 47 },
  },
  symbol_3_3: {
    type: 'container',
    landscape: { x: 350, y: 45 },
    portrait: { x: 333, y: 47 },
  },
  symbol_3_4: {
    type: 'container',
    landscape: { x: 462, y: 45 },
    portrait: { x: 443, y: 47 },
  },
  symbol_3_5: {
    type: 'container',
    landscape: { x: 574, y: 45 },
    portrait: { x: 553, y: 47 },
  }, 
  prize3: {
    type: 'container',
    landscape: { x: 716.5, y: 45 },
    portrait: { x: 695, y: 47 },
  },  
  game4:{
    type: 'container',
    children: ['label4','symbol_4_1','symbol_4_2','symbol_4_3','symbol_4_4','symbol_4_5','prize4'],
    landscape: { x: 0, y: 282 },
    portrait: { x: 0, y: 306 },
  },
  label4: {
    type: 'text',
    style: 'gameNumber',
    anchor: 0.5,
    landscape: { x: 37, y: 45 },
    portrait: { x: 30, y: 47 }
  },
  symbol_4_1: {
    type: 'container',
    landscape: { x: 126, y: 45 },
    portrait: { x: 113, y: 47 },
  },
  symbol_4_2: {
    type: 'container',
    landscape: { x: 238, y: 45 },
    portrait: { x: 223, y: 47 },
  },
  symbol_4_3: {
    type: 'container',
    landscape: { x: 350, y: 45 },
    portrait: { x: 333, y: 47 },
  },
  symbol_4_4: {
    type: 'container',
    landscape: { x: 462, y: 45 },
    portrait: { x: 443, y: 47 },
  },
  symbol_4_5: {
    type: 'container',
    landscape: { x: 574, y: 45 },
    portrait: { x: 553, y: 47 },
  }, 
  prize4: {
    type: 'container',
    landscape: { x: 716.5, y: 45 },
    portrait: { x: 695, y: 47 },
  }, 
  game5:{
    type: 'container',
    children: ['label5','symbol_5_1','symbol_5_2','symbol_5_3','symbol_5_4','symbol_5_5','prize5'],
    landscape: { x: 0, y: 376 },
    portrait: { x: 0, y: 408 },
  },
  label5: {
    type: 'text',
    style: 'gameNumber',
    anchor: 0.5,
    landscape: { x: 37, y: 45 },
    portrait: { x: 30, y: 47 }
  },
  symbol_5_1: {
    type: 'container',
    landscape: { x: 126, y: 45 },
    portrait: { x: 113, y: 47 },
  },
  symbol_5_2: {
    type: 'container',
    landscape: { x: 238, y: 45 },
    portrait: { x: 223, y: 47 },
  },
  symbol_5_3: {
    type: 'container',
    landscape: { x: 350, y: 45 },
    portrait: { x: 333, y: 47 },
  },
  symbol_5_4: {
    type: 'container',
    landscape: { x: 462, y: 45 },
    portrait: { x: 443, y: 47 },
  },
  symbol_5_5: {
    type: 'container',
    landscape: { x: 574, y: 45 },
    portrait: { x: 553, y: 47 },
  }, 
  prize5: {
    type: 'container',
    landscape: { x: 716.5, y: 45 },
    portrait: { x: 695, y: 47 },
  },  
  game6:{
    type: 'container',
    children: ['label6','symbol_6_1','symbol_6_2','symbol_6_3','symbol_6_4','symbol_6_5','prize6'],
    landscape: { x: 0, y: 470 },
    portrait: { x: 0, y: 510 },
  },  
  label6: {
    type: 'text',
    style: 'gameNumber',
    anchor: 0.5,
    landscape: { x: 37, y: 45 },
    portrait: { x: 30, y: 47 }
  },
  symbol_6_1: {
    type: 'container',
    landscape: { x: 126, y: 45 },
    portrait: { x: 113, y: 47 },
  },
  symbol_6_2: {
    type: 'container',
    landscape: { x: 238, y: 45 },
    portrait: { x: 223, y: 47 },
  },
  symbol_6_3: {
    type: 'container',
    landscape: { x: 350, y: 45 },
    portrait: { x: 333, y: 47 },
  },
  symbol_6_4: {
    type: 'container',
    landscape: { x: 462, y: 45 },
    portrait: { x: 443, y: 47 },
  },
  symbol_6_5: {
    type: 'container',
    landscape: { x: 574, y: 45 },
    portrait: { x: 553, y: 47 },
  }, 
  prize6: {
    type: 'container',
    landscape: { x: 716.5, y: 45 },
    portrait: { x: 695, y: 47 },
  }, 

  /*
   * How To Play
   */
  howToPlayPages: {
    type: 'container',
    children: ['howToPlayPage1'],
  },
  howToPlayPage1: {
    type: 'text',
    string: 'page1',
    style: 'howToPlayText',
    fontSize: 30,
    wordWrap: true,
    anchor: 0.5,
    align: 'center',
    landscape: { x: 720, y: 415, wordWrapWidth: 1100 },
    portrait: { x: 405, y: 550, wordWrapWidth: 560 },
  },
});
