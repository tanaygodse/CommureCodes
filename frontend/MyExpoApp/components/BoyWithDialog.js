// components/BoyWithDialog.js
import React, { useEffect, useRef, useContext } from 'react';
import {
  Animated,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarContext } from '../context/AvatarContext';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons'; // for play icon
import TaskCompleteButton from '../components/TaskCompleteButton';

export default function BoyWithDialog({ message }) {
  const { avatar } = useContext(AvatarContext);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -10,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const handleTaskComplete = () => {
    setShowAnimation(true);
    animationRef.current?.play();

    // Optionally update backend here

    setTimeout(() => {
      setShowAnimation(false);
    }, 5000);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 80,    // lift above the home indicator
          opacity,
          transform: [{ translateY }],
        }
      ]}
    >
      <View style={styles.dialogWrapper}>
        <View style={styles.dialogRow}>
          <Text style={styles.dialogContent}>{message}</Text>
          <TaskCompleteButton />
        </View>
        <View style={styles.triangle} />
      </View>

      <Image
        source={avatar}
        style={styles.boyImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: -70,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  boyImage: {
    width: 420,
    height: 420,
  },
  dialogWrapper: {
    backgroundColor: '#FFFAE5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: 260,
    marginBottom: 10,
    marginRight: 150,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  dialogRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  dialogText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#000',
    marginBottom: 8,
  },
  triangle: {
    position: 'absolute',
    bottom: -10,
    right: 26,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: '#FFFAE5',
  },
});
