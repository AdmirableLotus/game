import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DialogProps {
  text: string;
  character?: string;
  onClose: () => void;
  visible: boolean;
}

export const SimpleDialog: React.FC<DialogProps> = ({ text, character, onClose, visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dialogBox}>
        <Text style={styles.characterName}>
          {character || "Narrator"}
        </Text>
        <Text style={styles.dialogText}>
          {text}
        </Text>
        <TouchableOpacity style={styles.continueButton} onPress={onClose}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  dialogBox: {
    backgroundColor: '#2d2d4d',
    borderRadius: 15,
    padding: 20,
    borderWidth: 3,
    borderColor: '#4a4a8a',
    marginBottom: 50,
  },
  characterName: {
    color: '#ffff00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dialogText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: '#4a4a8a',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  continueText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});