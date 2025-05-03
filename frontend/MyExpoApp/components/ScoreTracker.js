// components/ScoreTracker.js
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// require your star asset
const STAR = require('../assets/star2.png');

export default function ScoreTracker({ score }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { top: insets.top + 8 }]}>
      <ImageBackground
        source={STAR}
        style={styles.star}
        resizeMode="contain"
      >
        <Text style={styles.scoreText}>{score}</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  star: {
    width: 99,           // tweak to match your asset’s dimensions
    height: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',    // pick whatever contrasts best
  },
});
