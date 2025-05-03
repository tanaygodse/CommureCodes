// screens/HomeScreen.js
import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';


import ScoreTracker from '../components/ScoreTracker';
import ShopButton from '../components/ShopButton';
import TaskListButton from '../components/TaskListButton';
import BoyWithDialog from '../components/BoyWithDialog';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* just your UI over the transparent background */}
      <ScoreTracker score={42} />
      <ShopButton onPress={() => navigation.navigate('Shop')} />
      <TaskListButton onPress={() => navigation.navigate('Tasks')} />
      <BoyWithDialog message="Hey there! Ready for your next challenge?" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bg: {
    flex: 1,
  },
});

