import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const LoadingScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <Text style={styles.gameTitle}>🔮 Elemental Conquest 🔮</Text>
      <Text style={styles.subtitle}>Territory Wars</Text>
      
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#64ffda" />
        <Text style={styles.loadingText}>Loading the realms...</Text>
      </View>
      
      <View style={styles.elementsContainer}>
        <Text style={styles.elementText}>🔥 Fire</Text>
        <Text style={styles.elementText}>💧 Water</Text>
        <Text style={styles.elementText}>🌱 Earth</Text>
        <Text style={styles.elementText}>💨 Wind</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64ffda',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 60,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  elementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  elementText: {
    fontSize: 24,
    textAlign: 'center',
  },
});