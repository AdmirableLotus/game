export type ElementalRealm = 'fire' | 'water' | 'earth' | 'wind' | 'neutral';

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'relic' | 'consumable';
  power: number;
  element: ElementalRealm;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Guardian {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  element: ElementalRealm;
  specialAbility: string;
  defeated: boolean;
  loot: Item[];
}

export interface ZeldaTerritory {
  id: string;
  x: number;
  y: number;
  owner: number | null;
  army: number;
  element: ElementalRealm;
  explored: boolean;
  treasure: Item | null;
  guardian: Guardian | null;
  lore: string;
  isCapturing: boolean;
}

export interface Hero {
  id: string;
  name: string;
  element: ElementalRealm;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  items: Item[];
  relics: string[];
  abilities: string[];
  experience: number;
  experienceToNext: number;
}

export const createZeldaBoard = (size: number = 8): ZeldaTerritory[][] => {
  const board: ZeldaTerritory[][] = [];
  
  for (let y = 0; y < size; y++) {
    const row: ZeldaTerritory[] = [];
    for (let x = 0; x < size; x++) {
      // Create different elemental zones
      let element: ElementalRealm = 'neutral';
      
      if (x < size/2 && y < size/2) element = 'fire';
      else if (x >= size/2 && y < size/2) element = 'water';
      else if (x < size/2 && y >= size/2) element = 'earth';
      else if (x >= size/2 && y >= size/2) element = 'wind';
      
      row.push({
        id: `${x}-${y}`,
        x,
        y,
        owner: null,
        army: 0,
        element,
        explored: false,
        treasure: null,
        guardian: null,
        lore: `This ${element} territory holds ancient secrets...`,
        isCapturing: false
      });
    }
    board.push(row);
  }
  
  // Set initial player positions
  board[1][1].owner = 1;
  board[1][1].army = 5;
  board[1][1].explored = true;
  
  board[size-2][size-2].owner = 2;
  board[size-2][size-2].army = 5;
  board[size-2][size-2].explored = true;
  
  // Add guardians to key territories
  addGuardians(board, size);
  addTreasures(board);
  
  return board;
};

const addGuardians = (board: ZeldaTerritory[][], size: number) => {
  const guardianPositions = [
    { x: 2, y: 2, element: 'fire' as ElementalRealm, name: 'Lava Sprite' },
    { x: size-3, y: 2, element: 'water' as ElementalRealm, name: 'Water Elemental' },
    { x: 2, y: size-3, element: 'earth' as ElementalRealm, name: 'Stone Guardian' },
    { x: size-3, y: size-3, element: 'wind' as ElementalRealm, name: 'Wind Spirit' }
  ];

  guardianPositions.forEach(({ x, y, element, name }) => {
    if (board[y] && board[y][x]) {
      board[y][x].guardian = {
        name,
        health: 25,
        maxHealth: 25,
        attack: 8,
        element,
        specialAbility: `${element} Storm`,
        defeated: false,
        loot: [{
          id: `${element}-essence`,
          name: `${element} Essence`,
          type: 'relic',
          power: 10,
          element,
          description: `Essence of the ${element} realm`,
          rarity: 'rare'
        }]
      };
    }
  });
};

const addTreasures = (board: ZeldaTerritory[][]) => {
  board.flat().forEach(territory => {
    if (Math.random() < 0.1 && !territory.guardian && territory.owner === null) {
      territory.treasure = {
        id: `treasure-${territory.id}`,
        name: 'Ancient Relic',
        type: 'consumable',
        power: 5,
        element: territory.element,
        description: 'A mysterious artifact from ages past',
        rarity: 'common'
      };
    }
  });
};

export const heroAbilities = {
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

export const legendaryRelics: Item[] = [
  {
    id: "triforce-power",
    name: "Triforce of Power",
    type: "relic",
    power: 50,
    element: "neutral",
    description: "Increases army strength by 50%",
    rarity: "legendary"
  },
  {
    id: "master-sword",
    name: "Master Sword", 
    type: "weapon",
    power: 30,
    element: "neutral",
    description: "Defeat guardians in one battle",
    rarity: "legendary"
  },
  {
    id: "magic-shield",
    name: "Magic Shield",
    type: "armor", 
    power: 20,
    element: "neutral",
    description: "Reduce enemy attack damage by 30%",
    rarity: "legendary"
  }
];