import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PixelWorld } from './PixelWorld';

export default function PixelWorldScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f0f1e', '#1a1a2e']} style={styles.background}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Menu</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>🔮 ELEMENTAL ODYSSEY</Text>
        </View>

        {/* Canvas Game World */}
        <PixelWorld />
        
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2d2d4d',
    borderBottomWidth: 2,
    borderBottomColor: '#4a4a8a',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#ffff00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#ffff00',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});