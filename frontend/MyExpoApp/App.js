// App.js
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AvatarProvider } from './context/AvatarContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayButton from './components/PlayButton'; // ← import it

import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import TaskListScreen from './screens/TaskListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AvatarProvider>
      <SafeAreaProvider>
        {/* mount your background exactly once */}
        <ImageBackground
          source={require('./assets/image_bg.png')}
          style={styles.bg}
          resizeMode="cover"
        >
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'fade',          // smoother transition
                animationDuration: 200,
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Shop" component={ShopScreen} />
              <Stack.Screen name="Tasks" component={TaskListScreen} />
            </Stack.Navigator>
          </NavigationContainer>

          {/* ← mount it here so it floats on every screen */}
          <PlayButton />

        </ImageBackground>
      </SafeAreaProvider>
    </AvatarProvider>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
