// components/PlayButton.js
import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';

export default function PlayButton({ message = 'Hello!', onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const speakMessage = () => {
    console.log(message);
    Speech.speak(message, {
      pitch: 1.4,
      rate: 0.85,
      voice: 'com.apple.ttsbundle.siri_Aaron_en-US_compact',
    });
    console.log("after speak")
  };

  const handlePress = () => {
    speakMessage();
    if (onPress) onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={() =>
        Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }).start()
      }
      onPress={handlePress}
    >
      <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
        <Image source={require('../assets/play.png')} style={styles.icon} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    right: '5%',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 80,
    height: 80,
  },
});
