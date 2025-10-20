import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const handleNewGame = () => {
    router.push('/game-setup');
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
            <Text style={styles.title}>ELEMENTAL</Text>
            <Text style={styles.subtitle}>CONQUEST</Text>
            <Text style={styles.tagline}>Territory Wars</Text>
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

          {/* Menu Buttons */}
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={[styles.menuButton, styles.primaryButton]}
              onPress={handleNewGame}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>NEW GAME</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuButton, styles.secondaryButton]}
              onPress={handleJoinGame}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextSecondary}>JOIN GAME</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuButton, styles.secondaryButton]}
              onPress={() => router.push('/how-to-play')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextSecondary}>HOW TO PLAY</Text>
            </TouchableOpacity>
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
  menuContainer: {
    width: '100%',
    paddingHorizontal: 40,
    gap: 16,
  },
  menuButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  primaryButton: {
    backgroundColor: '#64ffda',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#64ffda',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    letterSpacing: 1,
  },
  buttonTextSecondary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64ffda',
    letterSpacing: 1,
  },
});