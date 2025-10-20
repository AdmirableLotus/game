// Simple sound system for web/mobile
const createAudio = (src: string) => {
  if (typeof Audio !== 'undefined') {
    const audio = new Audio(src);
    audio.volume = 0.3;
    return audio;
  }
  return null;
};

const SFX = {
  capture: createAudio('/sounds/capture.mp3'),
  move: createAudio('/sounds/move.mp3'),
  win: createAudio('/sounds/win.mp3'),
  turn: createAudio('/sounds/turn.mp3')
};

export const playSound = (sound: keyof typeof SFX) => {
  try {
    SFX[sound]?.play();
  } catch (error) {
    // Silently fail if audio not available
  }
};