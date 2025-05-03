import React, { useEffect, useRef, useContext, useMemo } from 'react';
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

function getCurrentTimeAsMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}


export default function BoyWithDialog() {
  const { avatar, taskMap, setTaskMap, points, setPoints } = useContext(AvatarContext); 
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const insets = useSafeAreaInsets();

  const { activeTasks, nextTask } = useMemo(() => {
    const now = getCurrentTimeAsMinutes();
    const tasks = Object.entries(taskMap).map(([id, task]) => ({
      id,
      ...task
    }));

    const active = tasks.filter(t => {
      const start = timeToMinutes(t.startTime);
      const end = timeToMinutes(t.endTime);
      return now >= start && now <= end;
    });

    const futureTasks = tasks
      .map(t => ({ ...t, startMinutes: timeToMinutes(t.startTime) }))
      .filter(t => t.startMinutes > now)
      .sort((a, b) => a.startMinutes - b.startMinutes);

    return {
      activeTasks: active,
      nextTask: futureTasks[0] || null
    };
  }, [taskMap]);

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

  const markTaskCompleted = (taskId) => {
    setTaskMap(prev => {
      if (prev[taskId].completed) return prev;
  
      const earnedPoints = prev[taskId].points || 0;

      setPoints(prevPoints => prevPoints + earnedPoints);
  
      return {
        ...prev,
        [taskId]: {
          ...prev[taskId],
          completed: true
        }
      };
    });
  };

  const renderMessages = () => {
    if (activeTasks.length > 0) {
      return activeTasks.map((task, index) => (
        <View style={styles.taskRow} key={index}>
          <Text style={styles.dialogText}>{task.story}</Text>
          <TouchableOpacity
            onPress={() => markTaskCompleted(task.id)}
            disabled={task.completed}
          >
            <Text style={[styles.tick, task.completed && styles.tickDisabled]}>
              {task.completed ? '✔️' : '✅'}
            </Text>
          </TouchableOpacity>
        </View>
      ));
    } else if (nextTask) {
      return (
        <View style={styles.taskRow}>
          <Text style={styles.dialogText}>Upcoming: {nextTask.story}</Text>
          <Text style={styles.tick}>🕒</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.taskRow}>
          <Text style={styles.dialogText}>You're all caught up for now. Great job!</Text>
        </View>
      );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 80,
          opacity,
          transform: [{ translateY }],
        }
      ]}
    >
      <View style={styles.dialogWrapper}>
        <View style={styles.dialogRow}>
          {renderMessages()}
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
    backgroundColor: 'transparent'
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
    flexShrink: 1,
  },
  dialogRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    gap: 6
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  dialogText: {
    fontSize: 16,
    flexShrink: 1,
    flexGrow: 1,
    color: '#000',
    marginRight: 8,
  },
  tick: {
    fontSize: 18,
  },
  tickDisabled: {
    opacity: 0.4
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
