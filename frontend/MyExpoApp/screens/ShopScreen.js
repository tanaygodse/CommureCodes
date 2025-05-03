// screens/ShopScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function ShopScreen() {
  return (
    <View style={styles.center}>
      <Text>🛒 Welcome to the Shop!</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});

