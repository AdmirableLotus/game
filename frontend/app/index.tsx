import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const handleStartAdventure = () => {
    router.push('/game?element=fire&mode=local&mapSize=medium&playerCount=2');
  };

  const handleJoinGame = () => {
    router.push('/join-game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.background}
      >
        <View style={styles.content}>
          {/* Game Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>🔮 ELEMENTAL</Text>
            <Text style={styles.subtitle}>ODYSSEY</Text>
            <Text style={styles.tagline}>A Pixel Adventure</Text>
          </View>

          {/* Elemental Theme Icons */}
          <View style={styles.elementsContainer}>
            <View style={[styles.elementIcon, styles.fireElement]}>
              <Text style={styles.elementText}>🔥</Text>
            </View>
            <View style={[styles.elementIcon, styles.waterElement]}>
              <Text style={styles.elementText}>💧</Text>
            </View>
            <View style={[styles.elementIcon, styles.earthElement]}>
              <Text style={styles.elementText}>🌱</Text>
            </View>
            <View style={[styles.elementIcon, styles.windElement]}>
              <Text style={styles.elementText}>💨</Text>
            </View>
          </View>

          {/* Start Button */}
          <View style={styles.startContainer}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartAdventure}
              activeOpacity={0.8}
            >
              <Text style={styles.startText}>⚔️ BEGIN ADVENTURE</Text>
            </TouchableOpacity>
            
            <Text style={styles.flavorText}>
              "Master the elements. Claim the realm."
            </Text>
          </View>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64ffda',
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#b0bec5',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
  },
  elementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  elementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff30',
  },
  fireElement: {
    backgroundColor: '#ff5722',
  },
  waterElement: {
    backgroundColor: '#2196f3',
  },
  earthElement: {
    backgroundColor: '#4caf50',
  },
  windElement: {
    backgroundColor: '#9c27b0',
  },
  elementText: {
    fontSize: 24,
  },
  startContainer: {
    alignItems: 'center',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#4a4a8a',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ffff00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  flavorText: {
    fontSize: 14,
    color: '#ffff00',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});