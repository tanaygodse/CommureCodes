// screens/HomeScreen.js
import React, { useContext } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';


import ScoreTracker from '../components/ScoreTracker';
import ShopButton from '../components/ShopButton';
import TaskListButton from '../components/TaskListButton';
import BoyWithDialog from '../components/BoyWithDialog';
import PlayButton from '../components/PlayButton'; 
import { AvatarContext } from '../context/AvatarContext';

export default function HomeScreen({ navigation }) {
  const { points } = useContext(AvatarContext);
  message = "Hey there! Ready for your next challenge?"
  return (
    <SafeAreaView style={styles.container}>
      {/* just your UI over the transparent background */}
      <ScoreTracker score={points} />
      <ShopButton onPress={() => navigation.navigate('Shop')}/>
      <TaskListButton onPress={() => navigation.navigate('Tasks')} />
      <BoyWithDialog message={message} />
      <PlayButton message={message} />
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