// screens/TaskListScreen.js
import React from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  StyleSheet,
} from 'react-native';

const tasks = [
  { id: '1', title: 'Check in at reception' },
  { id: '2', title: 'Get your height & weight measured' },
  { id: '3', title: 'Meet the nurse' },
  { id: '4', title: 'Play the waiting-room game' },
];

export default function TaskListScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>• {item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', 
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 16,
    alignSelf: 'center',
    color: '#333',
  },
  list: {
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 18,
    color: '#006064',
  },
});
