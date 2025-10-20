class ZeldaAudioManager {
  private sounds: { [key: string]: HTMLAudioElement | null } = {};
  private music: { [key: string]: HTMLAudioElement | null } = {};
  private currentMusic: HTMLAudioElement | null = null;

  constructor() {
    this.initializeSounds();
    this.initializeMusic();
  }

  private initializeSounds() {
    const soundFiles = {
      capture: '/sounds/zelda-capture.mp3',
      move: '/sounds/zelda-move.mp3', 
      win: '/sounds/zelda-win.mp3',
      select: '/sounds/zelda-select.mp3',
      battle: '/sounds/zelda-battle.mp3',
      treasure: '/sounds/zelda-treasure.mp3',
      dialog: '/sounds/zelda-dialog.mp3',
      menuMove: '/sounds/zelda-menu-move.mp3',
      menuSelect: '/sounds/zelda-menu-select.mp3'
    };

    Object.entries(soundFiles).forEach(([key, src]) => {
      try {
        if (typeof Audio !== 'undefined') {
          const audio = new Audio(src);
          audio.volume = 0.4;
          this.sounds[key] = audio;
        } else {
          this.sounds[key] = null;
        }
      } catch (error) {
        console.log(`Could not load sound: ${key}`);
        this.sounds[key] = null;
      }
    });
  }

  private initializeMusic() {
    const musicFiles = {
      overworld: '/sounds/zelda-overworld.mp3',
      fireRealm: '/sounds/zelda-fire-realm.mp3',
      waterRealm: '/sounds/zelda-water-realm.mp3', 
      earthRealm: '/sounds/zelda-earth-realm.mp3',
      windRealm: '/sounds/zelda-wind-realm.mp3',
      guardianBattle: '/sounds/zelda-boss-battle.mp3',
      victory: '/sounds/zelda-victory.mp3'
    };

    Object.entries(musicFiles).forEach(([key, src]) => {
      try {
        if (typeof Audio !== 'undefined') {
          const audio = new Audio(src);
          audio.volume = 0.3;
          this.music[key] = audio;
        } else {
          this.music[key] = null;
        }
      } catch (error) {
        console.log(`Could not load music: ${key}`);
        this.music[key] = null;
      }
    });
  }

  playSound(soundName: string) {
    try {
      const sound = this.sounds[soundName];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log(`Audio play failed: ${soundName}`));
      }
    } catch (error) {
      console.log(`Could not play sound: ${soundName}`);
    }
  }

  playMusic(musicName: string, loop: boolean = true) {
    try {
      // Stop current music
      if (this.currentMusic) {
        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;
      }

      const music = this.music[musicName];
      if (music) {
        music.loop = loop;
        music.volume = 0.3;
        music.play().catch(e => console.log(`Music play failed: ${musicName}`));
        this.currentMusic = music;
      }
    } catch (error) {
      console.log(`Could not play music: ${musicName}`);
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  // Zelda-style sound sequences
  playItemGetSequence() {
    this.playSound('treasure');
    setTimeout(() => this.playSound('treasure'), 200);
    setTimeout(() => this.playSound('treasure'), 400);
    setTimeout(() => this.playSound('treasure'), 800);
  }

  playVictoryFanfare() {
    this.playSound('win');
    setTimeout(() => this.playMusic('overworld'), 3000);
  }
}

export const audioManager = new ZeldaAudioManager();