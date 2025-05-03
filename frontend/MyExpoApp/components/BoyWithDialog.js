// components/BoyWithDialog.js
import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Image, StyleSheet } from 'react-native';

export default function BoyWithDialog({ message }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.dialogWrapper}>
        <Text style={styles.dialogText}>{message}</Text>
        <View style={styles.triangle} />
      </View>

      <Image
        source={require('../assets/avatar_boy1.png')}
        style={styles.boyImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',     // right-align bubble + image
  },
  boyImage: {
    width: 180,                  // make him bigger!
    height: 180,
  },
  dialogWrapper: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 12,
    maxWidth: 240,
    marginBottom: 8,             // gap between bubble and head
    elevation: 4,                // Android shadow
    shadowColor: '#000',         // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dialogText: {
    fontSize: 16,
  },
  triangle: {
    alignSelf: 'center',         // center tip under bubble
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderTopWidth: 8,
    borderTopColor: '#FFF9C4',   // same as bubble
  },
});
