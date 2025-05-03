// components/ScoreTracker.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScoreTracker({ score }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapper, { top: insets.top + 8 }]}>
      <Text style={styles.text}>Points: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

