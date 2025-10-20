// Zelda-style game types and interfaces

export type ElementalRealm = 'fire' | 'water' | 'earth' | 'wind';

export interface Hero {
  id: string;
  name: string;
  element: ElementalRealm;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  items: Item[];
  relics: Relic[];
  abilities: Ability[];
  position: { x: number; y: number };
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'key';
  element: ElementalRealm | 'neutral';
  power: number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  effect: string;
  element: ElementalRealm;
  discovered: boolean;
  lore: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  element: ElementalRealm;
  manaCost: number;
  cooldown: number;
  currentCooldown: number;
  unlocked: boolean;
}

export interface Territory {
  id: string;
  x: number;
  y: number;
  element: ElementalRealm | 'neutral';
  owner: number | null;
  armyCount: number;
  type: 'normal' | 'guardian' | 'treasure' | 'shrine' | 'ruins' | 'secret';
  explored: boolean;
  treasure: Item | null;
  guardian: Guardian | null;
  lore: string | null;
  puzzle: Puzzle | null;
}

export interface Guardian {
  id: string;
  name: string;
  element: ElementalRealm;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  specialAbility: string;
  defeated: boolean;
  loot: Item[];
  lore: string;
}

export interface Puzzle {
  id: string;
  type: 'switch' | 'riddle' | 'sequence' | 'elemental';
  description: string;
  solution: string | number[];
  solved: boolean;
  reward: Item | Territory[];
  hint: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  chapter: number;
  objectives: QuestObjective[];
  completed: boolean;
  reward: Item | Relic | Ability;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'defeat' | 'collect' | 'explore' | 'solve';
  target: string;
  current: number;
  required: number;
  completed: boolean;
}

export interface GameWorld {
  territories: Territory[][];
  heroes: Hero[];
  currentHero: number;
  chapter: number;
  quests: Quest[];
  discoveredLore: string[];
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  gamePhase: 'exploration' | 'combat' | 'puzzle' | 'dialog';
}

export interface Dialog {
  id: string;
  speaker: string;
  text: string;
  choices?: DialogChoice[];
  next?: string;
}

export interface DialogChoice {
  text: string;
  next: string;
  condition?: string;
}

// Zelda-style sound effects
export interface ZeldaSounds {
  overworld: string;
  fireRealm: string;
  waterRealm: string;
  earthRealm: string;
  windRealm: string;
  guardianBattle: string;
  victory: string;
  itemGet: string;
  secretFound: string;
  puzzleSolved: string;
  heartContainer: string;
}

// Game constants
export const ELEMENTAL_COLORS = {
  fire: { primary: '#FF4500', secondary: '#8B0000', accent: '#FFD700' },
  water: { primary: '#1E90FF', secondary: '#00008B', accent: '#00CED1' },
  earth: { primary: '#228B22', secondary: '#8B4513', accent: '#32CD32' },
  wind: { primary: '#87CEEB', secondary: '#708090', accent: '#FFFFFF' },
  neutral: { primary: '#696969', secondary: '#2F2F2F', accent: '#C0C0C0' }
};

export const HERO_ABILITIES = {
  fire: {
    name: "Blazing Charge",
    description: "Move armies twice as far for one turn",
    manaCost: 15,
    cooldown: 3
  },
  water: {
    name: "Tidal Defense", 
    description: "Double defense for all territories for one turn",
    manaCost: 20,
    cooldown: 4
  },
  earth: {
    name: "Stone Regeneration",
    description: "Restore 2 armies to all territories",
    manaCost: 25,
    cooldown: 5
  },
  wind: {
    name: "Gale Speed",
    description: "Take two actions in one turn",
    manaCost: 30,
    cooldown: 6
  }
};

export const LEGENDARY_RELICS = [
  {
    id: "triforce-power",
    name: "Triforce of Power",
    description: "Ancient relic of immense strength",
    effect: "Increase army strength by 50%",
    element: 'fire' as ElementalRealm
  },
  {
    id: "triforce-wisdom", 
    name: "Triforce of Wisdom",
    description: "Ancient relic of deep knowledge",
    effect: "Reveal all hidden territories",
    element: 'water' as ElementalRealm
  },
  {
    id: "triforce-courage",
    name: "Triforce of Courage", 
    description: "Ancient relic of brave hearts",
    effect: "Immunity to guardian special attacks",
    element: 'earth' as ElementalRealm
  }
];