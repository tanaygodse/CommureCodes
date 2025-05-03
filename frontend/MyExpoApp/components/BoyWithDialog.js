// components/BoyWithDialog.js
import React, { useEffect, useRef, useContext, useMemo, useState } from 'react';
import {
  Animated,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { AvatarContext } from '../context/AvatarContext';

const CELEBRATION = require('../assets/celebration.json');
const { width, height } = Dimensions.get('window');

function getCurrentTimeAsMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export default function BoyWithDialog() {
  // ← all hooks at the top level, no shenanigans
  const {
    avatar,
    taskMap,
    setTaskMap,
    points,
    setPoints,
    speechMessage,
    setSpeechMessage,
  } = useContext(AvatarContext);

  const [showCelebration, setShowCelebration] = useState(false);
  const animationRef = useRef(null);

  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const insets     = useSafeAreaInsets();

  // compute active vs next task
  const { activeTasks, nextTask } = useMemo(() => {
    const now   = getCurrentTimeAsMinutes();
    const tasks = Object.entries(taskMap).map(([id, t]) => ({ id, ...t }));

    // only show tasks not yet completed
    const pending = tasks.filter(t => !t.completed);

    // those currently in their time window
    const active = pending.filter(t => {
      const start = timeToMinutes(t.startTime);
      const end   = timeToMinutes(t.endTime);
      return now >= start && now <= end;
    });

    // upcoming ones after now
    const upcoming = pending
      .map(t => ({ ...t, startMin: timeToMinutes(t.startTime) }))
      .filter(t => t.startMin > now)
      .sort((a, b) => a.startMin - b.startMin);

    return {
      activeTasks: active,
      nextTask:    upcoming[0] || null
    };
  }, [taskMap]);

  // keep speechMessage in sync with what’s shown
  useEffect(() => {
    if (activeTasks.length > 0) {
      setSpeechMessage(activeTasks.map(t => t.story).join(' - '));
    } else if (nextTask) {
      setSpeechMessage(`Upcoming: ${nextTask.story}`);
    } else {
      setSpeechMessage("You're all caught up. Great job!");
    }
  }, [activeTasks, nextTask, setSpeechMessage]);

  // animate in
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -10, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const markTaskCompleted = (taskId) => {
    setTaskMap(prev => {
      if (prev[taskId].completed) return prev;
      const earned = prev[taskId].points || 0;
      setPoints(p => p + earned);

      // Launch the Lottie celebration
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000); // hide after 3s (or use onAnimationFinish)

      return {
        ...prev,
        [taskId]: { ...prev[taskId], completed: true }
      };
    });
  };

  const renderMessages = () => {
    if (activeTasks.length) {
      return activeTasks.map((task, i) => (
        <View style={styles.taskRow} key={i}>
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
    }
    if (nextTask) {
      return (
        <View style={styles.taskRow}>
          <Text style={styles.dialogText}>Upcoming: {nextTask.story}</Text>
          <Text style={styles.tick}>🕒</Text>
        </View>
      );
    }
    return (
      <View style={styles.taskRow}>
        <Text style={styles.dialogText}>You're all caught up. Great job!</Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: insets.bottom + 80, opacity, transform: [{ translateY }] }
      ]}
    >
      <View style={styles.dialogWrapper}>
        <ScrollView
          style={styles.dialogScroll}
          contentContainerStyle={styles.dialogContent}
          nestedScrollEnabled
        >
          {renderMessages()}
        </ScrollView>
        <View style={styles.triangle} />
      </View>

      {showCelebration && (
        <LottieView
          ref={animationRef}
          source={CELEBRATION}
          autoPlay
          loop={false}
          style={{
            position: 'absolute',
            top: -height * 0.5,
            width: width,
            height: height,
            marginLeft: -200,
            marginTop: 200,
            zIndex: 100,
          }}
          onAnimationFinish={() => setShowCelebration(false)}
        />
      )}

      <Image source={avatar} style={styles.boyImage} resizeMode="contain" />
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
  dialogScroll: {
    maxHeight: 120,         // about two lines of text
  },
  dialogRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    // you can adjust vertical spacing here
    paddingHorizontal: 4,
  },
});
