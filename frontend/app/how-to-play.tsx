import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HowToPlay() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.background}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>How to Play</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Objective</Text>
            <Text style={styles.text}>Control 60% of the map to achieve elemental victory!</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔗 Phase 1: Claim Territory</Text>
            <Text style={styles.text}>• Tap lines between dots to draw borders</Text>
            <Text style={styles.text}>• Complete squares to claim them for your element</Text>
            <Text style={styles.text}>• Each claimed territory spawns 1 army</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚔️ Phase 2: Command Armies</Text>
            <Text style={styles.text}>• Select your territory, then tap adjacent enemy territory</Text>
            <Text style={styles.text}>• Armies battle: higher number wins</Text>
            <Text style={styles.text}>• Conquer enemy territories to expand your domain</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Elemental Powers</Text>
            <Text style={styles.elementText}>🔥 Fire: Spreads to neutral territories after conquest</Text>
            <Text style={styles.elementText}>💧 Water: +1 defense bonus, double reinforcements</Text>
            <Text style={styles.elementText}>🌱 Earth: Regenerates lost territories over time</Text>
            <Text style={styles.elementText}>💨 Wind: Extended movement range and diagonal attacks</Text>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={() => router.push('/game-setup')}>
            <Text style={styles.playText}>START PLAYING</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: { marginRight: 20 },
  backText: { fontSize: 18, color: '#64ffda', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#64ffda', marginBottom: 12 },
  text: { fontSize: 16, color: '#ffffff', marginBottom: 8, lineHeight: 24 },
  elementText: { fontSize: 14, color: '#b0bec5', marginBottom: 6, lineHeight: 20 },
  playButton: {
    backgroundColor: '#64ffda',
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  playText: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e' },
});