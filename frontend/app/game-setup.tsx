import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Element = 'fire' | 'water' | 'earth' | 'wind';
type GameMode = 'local' | 'online';
type MapSize = 'small' | 'medium' | 'large';

export default function GameSetup() {
  const [selectedElement, setSelectedElement] = useState<Element>('fire');
  const [gameMode, setGameMode] = useState<GameMode>('local');
  const [mapSize, setMapSize] = useState<MapSize>('medium');
  const [playerCount, setPlayerCount] = useState(2);

  const elements = [
    { id: 'fire', name: 'Fire', color: '#ff5722', emoji: '🔥', description: 'Spreads through conquered lines' },
    { id: 'water', name: 'Water', color: '#2196f3', emoji: '💧', description: 'Fortifies captured territory' },
    { id: 'earth', name: 'Earth', color: '#4caf50', emoji: '🌱', description: 'Regenerates lost ground' },
    { id: 'wind', name: 'Wind', color: '#9c27b0', emoji: '💨', description: 'Moves armies farther' },
  ];

  const handleStartGame = () => {
    const gameConfig = {
      element: selectedElement,
      mode: gameMode,
      mapSize,
      playerCount,
    };
    
    // Navigate to game with config
    router.push({
      pathname: '/game',
      params: gameConfig
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.background}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Game Setup</Text>
          </View>

          {/* Element Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Element</Text>
            <View style={styles.elementsGrid}>
              {elements.map((element) => (
                <TouchableOpacity
                  key={element.id}
                  style={[
                    styles.elementCard,
                    selectedElement === element.id && styles.selectedElement,
                    { borderColor: element.color }
                  ]}
                  onPress={() => setSelectedElement(element.id as Element)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.elementEmoji}>{element.emoji}</Text>
                  <Text style={[styles.elementName, { color: element.color }]}>
                    {element.name}
                  </Text>
                  <Text style={styles.elementDescription}>
                    {element.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Game Mode */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Mode</Text>
            <View style={styles.modeContainer}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  gameMode === 'local' && styles.selectedMode
                ]}
                onPress={() => setGameMode('local')}
              >
                <Text style={[
                  styles.modeText,
                  gameMode === 'local' && styles.selectedModeText
                ]}>
                  Local Play
                </Text>
                <Text style={styles.modeDescription}>Play vs AI or pass device</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  gameMode === 'online' && styles.selectedMode
                ]}
                onPress={() => setGameMode('online')}
              >
                <Text style={[
                  styles.modeText,
                  gameMode === 'online' && styles.selectedModeText
                ]}>
                  Online
                </Text>
                <Text style={styles.modeDescription}>Play with friends online</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Players */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Number of Players</Text>
            <View style={styles.playerContainer}>
              {[2, 3, 4].map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.playerButton,
                    playerCount === count && styles.selectedPlayer
                  ]}
                  onPress={() => setPlayerCount(count)}
                >
                  <Text style={[
                    styles.playerText,
                    playerCount === count && styles.selectedPlayerText
                  ]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Map Size */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Map Size</Text>
            <View style={styles.sizeContainer}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    mapSize === size && styles.selectedSize
                  ]}
                  onPress={() => setMapSize(size as MapSize)}
                >
                  <Text style={[
                    styles.sizeText,
                    mapSize === size && styles.selectedSizeText
                  ]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                  <Text style={styles.sizeDescription}>
                    {size === 'small' && '10×10'}
                    {size === 'medium' && '12×12'}
                    {size === 'large' && '15×15'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartGame}
            activeOpacity={0.8}
          >
            <Text style={styles.startText}>START GAME</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 20,
  },
  backText: {
    fontSize: 18,
    color: '#64ffda',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  elementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  elementCard: {
    width: '48%',
    backgroundColor: '#ffffff10',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff30',
  },
  selectedElement: {
    borderWidth: 3,
    backgroundColor: '#ffffff20',
  },
  elementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  elementName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  elementDescription: {
    fontSize: 12,
    color: '#b0bec5',
    textAlign: 'center',
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#ffffff10',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff30',
  },
  selectedMode: {
    borderColor: '#64ffda',
    backgroundColor: '#64ffda20',
  },
  modeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  selectedModeText: {
    color: '#64ffda',
  },
  modeDescription: {
    fontSize: 12,
    color: '#b0bec5',
    textAlign: 'center',
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  playerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff10',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff30',
  },
  selectedPlayer: {
    borderColor: '#64ffda',
    backgroundColor: '#64ffda20',
  },
  playerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  selectedPlayerText: {
    color: '#64ffda',
  },
  sizeContainer: {
    gap: 12,
  },
  sizeButton: {
    backgroundColor: '#ffffff10',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff30',
  },
  selectedSize: {
    borderColor: '#64ffda',
    backgroundColor: '#64ffda20',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  selectedSizeText: {
    color: '#64ffda',
  },
  sizeDescription: {
    fontSize: 12,
    color: '#b0bec5',
  },
  startButton: {
    backgroundColor: '#64ffda',
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  startText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    letterSpacing: 1,
  },
});