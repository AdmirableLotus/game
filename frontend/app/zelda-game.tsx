import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { zeldaStyles } from './zelda-styles';
import { Hero, Territory, GameWorld, ElementalRealm, ELEMENTAL_COLORS } from './zelda-types';
import { playSound } from './sounds';

export default function ZeldaGame() {
  const [gameState, setGameState] = useState<'title' | 'story' | 'playing' | 'inventory' | 'victory'>('title');
  const [gameWorld, setGameWorld] = useState<GameWorld | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [currentDialog, setCurrentDialog] = useState<string | null>(null);

  // Initialize the game world
  const initializeWorld = (heroElement: ElementalRealm) => {
    const hero: Hero = {
      id: 'player',
      name: 'Link',
      element: heroElement,
      level: 1,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      experience: 0,
      items: [],
      relics: [],
      abilities: [],
      position: { x: 4, y: 4 }
    };

    // Create 8x8 world map with different realm territories
    const territories: Territory[][] = [];
    for (let y = 0; y < 8; y++) {
      const row: Territory[] = [];
      for (let x = 0; x < 8; x++) {
        const territory: Territory = {
          id: `${x}-${y}`,
          x,
          y,
          element: getRealmForPosition(x, y),
          owner: x === 4 && y === 4 ? 1 : null, // Hero starts in center
          armyCount: x === 4 && y === 4 ? 5 : 0,
          type: getTerritoryType(x, y),
          explored: x === 4 && y === 4,
          treasure: null,
          guardian: null,
          lore: null,
          puzzle: null
        };
        row.push(territory);
      }
      territories.push(row);
    }

    // Add guardians to special territories
    addGuardians(territories);
    addTreasures(territories);

    const world: GameWorld = {
      territories,
      heroes: [hero],
      currentHero: 0,
      chapter: 1,
      quests: [],
      discoveredLore: [],
      timeOfDay: 'day',
      gamePhase: 'exploration'
    };

    setGameWorld(world);
  };

  const getRealmForPosition = (x: number, y: number): ElementalRealm | 'neutral' => {
    // Divide map into elemental quadrants
    if (x < 4 && y < 4) return 'fire';    // Top-left: Fire Realm
    if (x >= 4 && y < 4) return 'water';  // Top-right: Water Realm  
    if (x < 4 && y >= 4) return 'earth';  // Bottom-left: Earth Realm
    if (x >= 4 && y >= 4) return 'wind';  // Bottom-right: Wind Realm
    return 'neutral';
  };

  const getTerritoryType = (x: number, y: number): Territory['type'] => {
    // Center is normal starting area
    if (x === 4 && y === 4) return 'normal';
    
    // Corners have guardians
    if ((x === 0 && y === 0) || (x === 7 && y === 0) || 
        (x === 0 && y === 7) || (x === 7 && y === 7)) {
      return 'guardian';
    }
    
    // Some random special territories
    if (Math.random() < 0.15) return 'treasure';
    if (Math.random() < 0.1) return 'shrine';
    if (Math.random() < 0.05) return 'secret';
    
    return 'normal';
  };

  const addGuardians = (territories: Territory[][]) => {
    // Add elemental guardians to corner territories
    const guardianPositions = [
      { x: 0, y: 0, element: 'fire' as ElementalRealm, name: 'Lava Titan' },
      { x: 7, y: 0, element: 'water' as ElementalRealm, name: 'Tidal Colossus' },
      { x: 0, y: 7, element: 'earth' as ElementalRealm, name: 'Stone Golem' },
      { x: 7, y: 7, element: 'wind' as ElementalRealm, name: 'Storm Dragon' }
    ];

    guardianPositions.forEach(({ x, y, element, name }) => {
      territories[y][x].guardian = {
        id: `guardian-${element}`,
        name,
        element,
        health: 100,
        maxHealth: 100,
        attack: 25,
        defense: 15,
        specialAbility: `${element} Storm`,
        defeated: false,
        loot: [],
        lore: `The ancient guardian of the ${element} realm.`
      };
    });
  };

  const addTreasures = (territories: Territory[][]) => {
    // Add random treasures to treasure territories
    territories.flat().forEach(territory => {
      if (territory.type === 'treasure' && Math.random() < 0.7) {
        territory.treasure = {
          id: `treasure-${territory.id}`,
          name: 'Ancient Relic',
          type: 'consumable',
          element: territory.element as ElementalRealm,
          power: 10,
          description: 'A mysterious artifact from ages past',
          rarity: 'rare',
          icon: '💎'
        };
      }
    });
  };

  const handleTerritoryPress = (territory: Territory) => {
    if (!gameWorld) return;

    const hero = gameWorld.heroes[gameWorld.currentHero];
    
    // Check if territory is adjacent to hero or hero's territories
    if (isAdjacent(hero.position, territory) || territory.owner === 1) {
      
      if (territory.guardian && !territory.guardian.defeated) {
        // Battle guardian
        setCurrentDialog(`A mighty ${territory.guardian.name} blocks your path! Prepare for battle!`);
        playSound('capture');
        
        // Simple battle resolution
        setTimeout(() => {
          territory.guardian!.defeated = true;
          territory.owner = 1;
          territory.armyCount = 3;
          territory.explored = true;
          setCurrentDialog(`Victory! The ${territory.guardian!.name} has been defeated!`);
          playSound('win');
          
          setTimeout(() => setCurrentDialog(null), 3000);
        }, 2000);
        
      } else if (territory.treasure && !territory.explored) {
        // Discover treasure
        hero.items.push(territory.treasure);
        territory.explored = true;
        setCurrentDialog(`You found: ${territory.treasure.name}! ${territory.treasure.description}`);
        playSound('capture');
        
        setTimeout(() => setCurrentDialog(null), 3000);
        
      } else {
        // Normal territory conquest
        if (territory.owner !== 1) {
          territory.owner = 1;
          territory.armyCount = Math.max(1, territory.armyCount);
          territory.explored = true;
          playSound('move');
        }
      }
      
      setGameWorld({ ...gameWorld });
      checkVictoryCondition();
    }
  };

  const isAdjacent = (pos1: { x: number; y: number }, territory: Territory): boolean => {
    const dx = Math.abs(pos1.x - territory.x);
    const dy = Math.abs(pos1.y - territory.y);
    return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
  };

  const checkVictoryCondition = () => {
    if (!gameWorld) return;
    
    const totalTerritories = 64;
    const playerTerritories = gameWorld.territories.flat().filter(t => t.owner === 1).length;
    
    if (playerTerritories >= totalTerritories * 0.6) {
      setGameState('victory');
      playSound('win');
    }
  };

  const renderTerritory = (territory: Territory) => {
    const colors = ELEMENTAL_COLORS[territory.element] || ELEMENTAL_COLORS.neutral;
    const isOwned = territory.owner === 1;
    const isExplored = territory.explored;
    
    let tileStyle = [zeldaStyles.zeldaTile];
    
    // Apply realm-specific styling
    switch (territory.element) {
      case 'fire': tileStyle.push(zeldaStyles.fireRealm); break;
      case 'water': tileStyle.push(zeldaStyles.waterRealm); break;
      case 'earth': tileStyle.push(zeldaStyles.earthRealm); break;
      case 'wind': tileStyle.push(zeldaStyles.windRealm); break;
    }
    
    // Special territory styling
    if (territory.guardian && !territory.guardian.defeated) {
      tileStyle.push(zeldaStyles.guardianTile);
    } else if (territory.treasure && !isExplored) {
      tileStyle.push(zeldaStyles.treasureTile);
    }

    return (
      <TouchableOpacity
        key={territory.id}
        style={tileStyle}
        onPress={() => handleTerritoryPress(territory)}
      >
        {/* Territory content */}
        {territory.guardian && !territory.guardian.defeated && (
          <Text style={{ fontSize: 20 }}>👹</Text>
        )}
        {territory.treasure && !isExplored && (
          <Text style={{ fontSize: 16 }}>💎</Text>
        )}
        {isOwned && territory.armyCount > 0 && (
          <Text style={zeldaStyles.armyCount}>{territory.armyCount}</Text>
        )}
        {!isExplored && !territory.guardian && !territory.treasure && (
          <Text style={{ fontSize: 12, color: '#666' }}>?</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (gameState === 'title') {
    return (
      <SafeAreaView style={zeldaStyles.zeldaTitleContainer}>
        <LinearGradient colors={['#0a0a0a', '#2F4F2F']} style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={zeldaStyles.zeldaTitle}>ELEMENTAL REALMS</Text>
          <Text style={zeldaStyles.zeldaTitle}>THE SHATTERED KINGDOM</Text>
          <Text style={zeldaStyles.zeldaSubtitle}>
            Long ago, the four Elemental Spirits maintained balance in the kingdom...
            But an ancient darkness shattered their power. As the chosen Hero, 
            you must restore balance by conquering territories and reuniting the elemental forces!
          </Text>
          
          <View style={{ marginTop: 40 }}>
            <Text style={[zeldaStyles.panelTitle, { marginBottom: 20 }]}>Choose Your Element:</Text>
            
            {(['fire', 'water', 'earth', 'wind'] as ElementalRealm[]).map(element => (
              <TouchableOpacity
                key={element}
                style={[zeldaStyles.zeldaButton, { backgroundColor: ELEMENTAL_COLORS[element].primary }]}
                onPress={() => {
                  initializeWorld(element);
                  setGameState('playing');
                  playSound('turn');
                }}
              >
                <Text style={zeldaStyles.zeldaButtonText}>
                  {element.toUpperCase()} REALM
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[zeldaStyles.zeldaButton, { marginTop: 20 }]}
            onPress={() => router.back()}
          >
            <Text style={zeldaStyles.zeldaButtonText}>BACK TO MENU</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (gameState === 'victory') {
    return (
      <SafeAreaView style={zeldaStyles.zeldaTitleContainer}>
        <LinearGradient colors={['#FFD700', '#8B0000']} style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[zeldaStyles.zeldaTitle, { color: '#FFFFFF' }]}>VICTORY!</Text>
          <Text style={zeldaStyles.zeldaSubtitle}>
            The elemental balance has been restored! The kingdom is united once more under your rule.
          </Text>
          
          <TouchableOpacity 
            style={zeldaStyles.zeldaButton}
            onPress={() => setGameState('title')}
          >
            <Text style={zeldaStyles.zeldaButtonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!gameWorld) return null;

  const hero = gameWorld.heroes[gameWorld.currentHero];

  return (
    <SafeAreaView style={zeldaStyles.gameContainer}>
      {/* Status Bar */}
      <View style={zeldaStyles.statusBar}>
        <View style={zeldaStyles.healthBar}>
          <Text style={zeldaStyles.statusText}>❤️ {hero.health}/{hero.maxHealth}</Text>
        </View>
        <View style={zeldaStyles.manaBar}>
          <Text style={zeldaStyles.statusText}>⭐ {hero.mana}/{hero.maxMana}</Text>
        </View>
      </View>

      {/* Mini-map */}
      <View style={zeldaStyles.minimap}>
        <Text style={zeldaStyles.minimapTitle}>World Map</Text>
        <Text style={[zeldaStyles.statusText, { fontSize: 10 }]}>
          Chapter {gameWorld.chapter}
        </Text>
      </View>

      {/* Inventory Panel */}
      <View style={zeldaStyles.inventoryPanel}>
        <Text style={zeldaStyles.panelTitle}>Items ({hero.items.length})</Text>
        {hero.items.slice(0, 6).map((item, index) => (
          <View key={item.id} style={zeldaStyles.itemSlot}>
            <Text style={{ fontSize: 16 }}>{item.icon || '📦'}</Text>
          </View>
        ))}
      </View>

      {/* Game Board */}
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 400, justifyContent: 'center' }}>
          {gameWorld.territories.flat().map(territory => renderTerritory(territory))}
        </View>
      </ScrollView>

      {/* Dialog Box */}
      {currentDialog && (
        <View style={zeldaStyles.dialogBox}>
          <Text style={zeldaStyles.dialogText}>{currentDialog}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <TouchableOpacity 
          style={zeldaStyles.zeldaButton}
          onPress={() => router.back()}
        >
          <Text style={zeldaStyles.zeldaButtonText}>MENU</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={zeldaStyles.zeldaButton}
          onPress={() => {
            // Use hero ability
            if (hero.mana >= 15) {
              hero.mana -= 15;
              setCurrentDialog(`${hero.name} uses ${hero.element} power!`);
              setTimeout(() => setCurrentDialog(null), 2000);
            }
          }}
        >
          <Text style={zeldaStyles.zeldaButtonText}>ABILITY</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}