// screens/TaskListScreen.js
import React, { useContext } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import { AvatarContext } from '../context/AvatarContext';

export default function TaskListScreen() {
  const { taskMap } = useContext(AvatarContext);

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const formatToAMPM = (timeStr) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };
  
  const tasks = Object.entries(taskMap)
    .map(([id, taskObj]) => ({
      id,
      ...taskObj
    }))
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.timeRange}>
        {formatToAMPM(item.startTime)} - {formatToAMPM(item.endTime)}
      </Text>
      <Text style={styles.taskTitle}>{item.task}</Text>
      <Text style={styles.story}>{item.story}</Text>
      <Text style={styles.status}>
        Completed: {item.completed ? '✅' : '❌'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  taskCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  story: {
    fontSize: 14,
    marginTop: 4
  },
  status: {
    fontSize: 14,
    marginTop: 8,
    color: 'gray'
  },
  timeRange: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  }
});
