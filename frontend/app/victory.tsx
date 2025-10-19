import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { recordGameResult, getGameStats } from './storage';

export default function Victory() {
  const params = useLocalSearchParams();
  const { winner, element } = params;
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const recordWin = async () => {
      await recordGameResult(element as string, true);
      const newStats = await getGameStats();
      setStats(newStats);
    };
    recordWin();
  }, [element]);

  const elementEmojis = {
    fire: '🔥',
    water: '💧', 
    earth: '🌱',
    wind: '💨'
  };

  const handleNewGame = () => {
    router.push('/game-setup');
  };

  const handleMainMenu = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.victoryContainer}>
            <Text style={styles.victoryTitle}>VICTORY!</Text>
            <Text style={styles.elementEmoji}>
              {elementEmojis[element as keyof typeof elementEmojis]}
            </Text>
            <Text style={styles.winnerText}>
              {(element as string).toUpperCase()} CONQUERS THE REALM
            </Text>
            <Text style={styles.subtitle}>
              Dominance achieved through elemental mastery
            </Text>
            {stats && (
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                  🏆 {stats.wins[element as string] || 0} victories as {element}
                </Text>
                <Text style={styles.statsText}>
                  🔥 {stats.winStreak} win streak
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={handleNewGame}
            >
              <Text style={styles.buttonText}>NEW CONQUEST</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={handleMainMenu}
            >
              <Text style={styles.buttonTextSecondary}>MAIN MENU</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  victoryContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  victoryTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 20,
  },
  elementEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#b0bec5',
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
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
  statsContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#64ffda',
    fontWeight: '600',
  },
});