// Zelda-style sound system with retro 8-bit feel

const createZeldaAudio = (src: string) => {
  if (typeof Audio !== 'undefined') {
    const audio = new Audio(src);
    audio.volume = 0.4;
    return audio;
  }
  return null;
};

export const ZeldaSFX = {
  // Classic Zelda sounds
  itemGet: createZeldaAudio('/sounds/zelda-item-get.mp3'),
  secretFound: createZeldaAudio('/sounds/zelda-secret.mp3'),
  puzzleSolved: createZeldaAudio('/sounds/zelda-puzzle.mp3'),
  heartContainer: createZeldaAudio('/sounds/zelda-heart.mp3'),
  
  // Realm music themes
  overworld: createZeldaAudio('/sounds/zelda-overworld.mp3'),
  fireRealm: createZeldaAudio('/sounds/zelda-fire-realm.mp3'),
  waterRealm: createZeldaAudio('/sounds/zelda-water-realm.mp3'),
  earthRealm: createZeldaAudio('/sounds/zelda-earth-realm.mp3'),
  windRealm: createZeldaAudio('/sounds/zelda-wind-realm.mp3'),
  
  // Battle and action
  guardianBattle: createZeldaAudio('/sounds/zelda-boss-battle.mp3'),
  victory: createZeldaAudio('/sounds/zelda-victory.mp3'),
  swordSlash: createZeldaAudio('/sounds/zelda-sword.mp3'),
  shieldBlock: createZeldaAudio('/sounds/zelda-shield.mp3'),
  
  // UI and feedback
  menuSelect: createZeldaAudio('/sounds/zelda-menu-select.mp3'),
  menuMove: createZeldaAudio('/sounds/zelda-menu-move.mp3'),
  textAdvance: createZeldaAudio('/sounds/zelda-text.mp3'),
  
  // Environmental
  doorOpen: createZeldaAudio('/sounds/zelda-door.mp3'),
  chestOpen: createZeldaAudio('/sounds/zelda-chest.mp3'),
  switchActivate: createZeldaAudio('/sounds/zelda-switch.mp3'),
};

let currentMusic: HTMLAudioElement | null = null;

export const playZeldaSound = (sound: keyof typeof ZeldaSFX) => {
  try {
    const audio = ZeldaSFX[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  } catch (error) {
    console.log(`Could not play sound: ${sound}`);
  }
};

export const playZeldaMusic = (music: keyof typeof ZeldaSFX, loop: boolean = true) => {
  try {
    // Stop current music
    if (currentMusic) {
      currentMusic.pause();
      currentMusic.currentTime = 0;
    }
    
    const audio = ZeldaSFX[music];
    if (audio) {
      audio.loop = loop;
      audio.volume = 0.3; // Lower volume for background music
      audio.play();
      currentMusic = audio;
    }
  } catch (error) {
    console.log(`Could not play music: ${music}`);
  }
};

export const stopZeldaMusic = () => {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
  }
};

// Zelda-style sound sequences
export const playItemGetSequence = () => {
  playZeldaSound('itemGet');
  // Classic Zelda "da da da daaaa" timing
  setTimeout(() => playZeldaSound('itemGet'), 200);
  setTimeout(() => playZeldaSound('itemGet'), 400);
  setTimeout(() => playZeldaSound('itemGet'), 800);
};

export const playVictoryFanfare = () => {
  playZeldaSound('victory');
  setTimeout(() => playZeldaMusic('overworld'), 3000);
};

export const playSecretFoundSequence = () => {
  playZeldaSound('secretFound');
  setTimeout(() => playZeldaSound('chestOpen'), 1000);
};