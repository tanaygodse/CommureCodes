// components/TaskCompleteButton.js
import React, { useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
const { width, height } = Dimensions.get('window');


const TaskCompleteButton = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const animationRef = useRef(null);

  const handlePress = () => {
    setShowAnimation(true);
    animationRef.current?.play();

    // Optional: call backend API to mark task complete

    setTimeout(() => {
      setShowAnimation(false);
    }, 5000);
  };

  return (
    <>
      {/* 🌠 Fullscreen Animation */}
      {showAnimation && (
        <LottieView
          ref={animationRef}
          source={require('../assets/celebration.json')}
          autoPlay
          loop={false}
          style={{
            position: 'absolute',
            top: '-350%',
            width,
            height,
            marginLeft: -50,  // -½ width
            marginTop: -50,   // -½ height
            zIndex: 100, // Ensure it overlays everything
          }}
        />
      )}

      {/* ✅ Inline Tick Button */}
      <TouchableOpacity onPress={handlePress} style={styles.inlineButton}>
        <Ionicons name="checkmark-circle" size={28} color="green" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  inlineButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    marginTop: 6,
    marginRight: 2,
  },
});

export default TaskCompleteButton;
