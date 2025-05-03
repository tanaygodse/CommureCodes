// screens/TaskListScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function TaskListScreen() {
  return (
    <View style={styles.center}>
      <Text>📋 Here are your Tasks!</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
