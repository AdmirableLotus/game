import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface Dialog {
  id: string;
  character: { id: string; name: string; sprite: string; color: string };
  text: string;
  choices?: { text: string; nextDialog?: string }[];
}

const DialogStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
    zIndex: 1000
  },
  container: {
    backgroundColor: '#2d2d4d',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 3,
    borderColor: '#4a4a8a',
    maxHeight: '40%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  characterSprite: {
    fontSize: 32,
    marginRight: 10
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffff00'
  },
  textContainer: {
    minHeight: 60,
    marginBottom: 15
  },
  dialogText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 22
  },
  choicesContainer: {
    marginTop: 10
  },
  choiceButton: {
    backgroundColor: '#4a4a8a',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#6a6aaa'
  },
  choiceText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center'
  },
  continueButton: {
    backgroundColor: '#8cb369',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-end',
    minWidth: 100
  },
  continueText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

interface DialogSystemProps {
  currentDialog: Dialog | null;
  onDialogClose: (nextDialogId?: string) => void;
  isVisible: boolean;
}

export const DialogSystem: React.FC<DialogSystemProps> = ({ 
  currentDialog, 
  onDialogClose, 
  isVisible 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible && currentDialog) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  }, [isVisible, currentDialog]);

  if (!currentDialog || !isVisible) return null;

  return (
    <Animated.View style={[DialogStyles.overlay, { opacity: fadeAnim }]}>
      <View style={DialogStyles.container}>
        <View style={DialogStyles.header}>
          <Text style={DialogStyles.characterSprite}>{currentDialog.character.sprite}</Text>
          <Text style={[DialogStyles.characterName, { color: currentDialog.character.color }]}>
            {currentDialog.character.name}
          </Text>
        </View>
        
        <View style={DialogStyles.textContainer}>
          <Text style={DialogStyles.dialogText}>{currentDialog.text}</Text>
        </View>
        
        {currentDialog.choices && currentDialog.choices.length > 0 ? (
          <View style={DialogStyles.choicesContainer}>
            {currentDialog.choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={DialogStyles.choiceButton}
                onPress={() => onDialogClose(choice.nextDialog)}
              >
                <Text style={DialogStyles.choiceText}>{choice.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TouchableOpacity
            style={DialogStyles.continueButton}
            onPress={() => onDialogClose()}
          >
            <Text style={DialogStyles.continueText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};