// App.js
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AvatarProvider } from './context/AvatarContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import TaskListScreen from './screens/TaskListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AvatarProvider>
      <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                // make each card transparent so the image shows through
                cardStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Shop" component={ShopScreen} />
              <Stack.Screen name="Tasks" component={TaskListScreen} />
            </Stack.Navigator>
          </NavigationContainer>
      </SafeAreaProvider>
    </AvatarProvider>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
});
