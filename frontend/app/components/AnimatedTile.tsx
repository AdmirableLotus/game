import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, Easing } from 'react-native';

interface AnimatedTileProps {
  tile: any;
  onPress: () => void;
  isSelected: boolean;
  isCapturing: boolean;
  element: string;
}

export const AnimatedTile: React.FC<AnimatedTileProps> = ({ 
  tile, 
  onPress, 
  isSelected, 
  isCapturing,
  element
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  
  const elementColors: { [key: string]: string } = {
    fire: '#ff4d4d',
    water: '#4d79ff',
    earth: '#8cb369',
    wind: '#66ccff',
    neutral: '#33334d'
  };
  
  useEffect(() => {
    if (isCapturing) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ]).start();
      
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        rotateValue.setValue(0);
      });
    }
  }, [isCapturing]);
  
  useEffect(() => {
    if (isSelected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      opacityValue.setValue(1);
    }
  }, [isSelected]);
  
  const backgroundColor = tile.owner ? 
    (tile.owner === 1 ? '#ffdb58' : '#4a4a8a') : 
    elementColors[element] || elementColors.neutral;
  
  const rotateDeg = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 60,
        height: 60,
        margin: 2,
        borderRadius: 12,
        borderWidth: isSelected ? 4 : 2,
        borderColor: isSelected ? '#ffff00' : '#1a1a2e',
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [
          { scale: scaleValue },
          { rotate: rotateDeg }
        ],
        opacity: opacityValue,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      }}
    >
      {tile.army > 0 && (
        <Text style={{
          color: tile.owner ? '#000000' : '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          textShadowColor: tile.owner ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 1
        }}>
          {tile.army}
        </Text>
      )}
      
      {element !== 'neutral' && !tile.owner && (
        <Text style={{
          position: 'absolute',
          top: 2,
          right: 2,
          fontSize: 10,
          color: '#ffffff'
        }}>
          {element === 'fire' ? '🔥' : 
           element === 'water' ? '💧' : 
           element === 'earth' ? '🏔️' : 
           element === 'wind' ? '💨' : ''}
        </Text>
      )}
    </TouchableOpacity>
  );
};