import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ZELDA_PALETTES } from '../zelda-palettes';

const ZeldaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2d2d4d',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#4a4a8a',
  },
  healthBar: {
    height: 20,
    backgroundColor: '#4a4a8a',
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    overflow: 'hidden',
  },
  healthFill: {
    height: '100%',
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
  },
  manaBar: {
    height: 20,
    backgroundColor: '#4a4a8a', 
    borderRadius: 10,
    flex: 1,
    overflow: 'hidden',
  },
  manaFill: {
    height: '100%',
    backgroundColor: '#4d79ff',
    borderRadius: 10,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  minimap: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: '#ffff00',
  },
  minimapTitle: {
    color: '#ffff00',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
});

interface ZeldaUIProps {
  hero: {
    name: string;
    level: number;
    health: number;
    mana: number;
  };
}

export const ZeldaUI: React.FC<ZeldaUIProps> = ({ hero }) => {
  return (
    <View style={ZeldaStyles.container}>
      {/* Status Bars */}
      <View style={ZeldaStyles.header}>
        <View style={{ flex: 1 }}>
          <Text style={ZeldaStyles.statusText}>
            ⚔️ {hero.name} - Level {hero.level}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={ZeldaStyles.statusText}>❤️ HP</Text>
            <View style={ZeldaStyles.healthBar}>
              <View 
                style={[
                  ZeldaStyles.healthFill, 
                  { width: `${(hero.health / 100) * 100}%` }
                ]} 
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ZeldaStyles.statusText}>⭐ MP</Text>
            <View style={ZeldaStyles.manaBar}>
              <View 
                style={[
                  ZeldaStyles.manaFill, 
                  { width: `${(hero.mana / 50) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      {/* Minimap */}
      <View style={ZeldaStyles.minimap}>
        <Text style={ZeldaStyles.minimapTitle}>World Map</Text>
        <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
          🔥 Volcano
        </Text>
        <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
          🏛️ Castle
        </Text>
        <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
          🌊 Ocean
        </Text>
      </View>
    </View>
  );
};