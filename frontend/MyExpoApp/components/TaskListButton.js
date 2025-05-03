import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';

export default function TaskListButton({ onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <TouchableWithoutFeedback
      onPressIn={() =>
        Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start()
      }
      onPress={onPress}
    >
      <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
        <Image source={require('../assets/shop.png')} style={styles.icon} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

