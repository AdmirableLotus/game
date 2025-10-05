import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function JoinGame() {
  const [roomCode, setRoomCode] = useState('');
  const [selectedElement, setSelectedElement] = useState('fire');
  const [loading, setLoading] = useState(false);

  const elements = [
    { id: 'fire', name: 'Fire', color: '#ff5722', emoji: '🔥' },
    { id: 'water', name: 'Water', color: '#2196f3', emoji: '💧' },
    { id: 'earth', name: 'Earth', color: '#4caf50', emoji: '🌱' },
    { id: 'wind', name: 'Wind', color: '#9c27b0', emoji: '💨' },
  ];

  const handleJoinGame = async () => {
    if (roomCode.length !== 6) {
      Alert.alert('Invalid Room Code', 'Room code must be 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to join game
      console.log('Joining game:', roomCode, 'as', selectedElement);
      
      // For now, navigate directly to game
      router.push({
        pathname: '/game',
        params: {
          element: selectedElement,
          mode: 'online',
          roomCode,
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to join game. Please check the room code and try again.');
    } finally {
      setLoading(false);
    }
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
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Join Game</Text>
          </View>

          {/* Room Code Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Room Code</Text>
            <TextInput
              style={styles.roomCodeInput}
              value={roomCode}
              onChangeText={setRoomCode}
              placeholder="ABCD12"
              placeholderTextColor="#b0bec5"
              maxLength={6}
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect={false}
            />
            <Text style={styles.inputHelper}>
              Ask your friend for the 6-character room code
            </Text>
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
                  onPress={() => setSelectedElement(element.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.elementEmoji}>{element.emoji}</Text>
                  <Text style={[styles.elementName, { color: element.color }]}>
                    {element.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Join Button */}
          <TouchableOpacity
            style={[styles.joinButton, (!roomCode || loading) && styles.joinButtonDisabled]}
            onPress={handleJoinGame}
            disabled={!roomCode || loading}
            activeOpacity={0.8}
          >
            <Text style={[styles.joinText, (!roomCode || loading) && styles.joinTextDisabled]}>
              {loading ? 'JOINING...' : 'JOIN GAME'}
            </Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  roomCodeInput: {
    backgroundColor: '#ffffff10',
    borderRadius: 16,
    padding: 20,
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 4,
    borderWidth: 2,
    borderColor: '#ffffff30',
  },
  inputHelper: {
    fontSize: 14,
    color: '#b0bec5',
    textAlign: 'center',
    marginTop: 8,
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
  },
  joinButton: {
    backgroundColor: '#64ffda',
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  joinButtonDisabled: {
    backgroundColor: '#ffffff20',
  },
  joinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    letterSpacing: 1,
  },
  joinTextDisabled: {
    color: '#b0bec5',
  },
});