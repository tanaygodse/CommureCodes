// screens/ShopScreen.js
import React, { useContext } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { AvatarContext } from '../context/AvatarContext';

const costumes = [
  {
    id: '1',
    name: 'Default Outfit',
    image: require('../assets/avatar_boy1.png'),
  },
  {
    id: '2',
    name: 'Superhero Cape',
    image: require('../assets/avatar_boy2.png'),
  },
  {
    id: '3',
    name: 'Astronaut Suit',
    image: require('../assets/avatar_boy3.png'),
  },
];

export default function ShopScreen() {
  const { avatar, setAvatar } = useContext(AvatarContext);

  const renderItem = ({ item }) => {
    const isSelected = avatar === item.image;
    return (
      <TouchableOpacity
        style={[
          styles.item,
          isSelected && styles.selectedItem,
        ]}
        onPress={() => setAvatar(item.image)}
      >
        <Image
          source={item.image}
          style={styles.thumb}
          resizeMode="contain"
        />
        <Text style={styles.name}>{item.name}</Text>
        {isSelected && <View style={styles.checkmark} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/image_bg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <Text style={styles.header}>Shop Costumes</Text>
        <FlatList
          data={costumes}
          keyExtractor={t => t.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: 'transparent', },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    alignSelf: 'center',
  },
  list: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#0288D1',
  },
  thumb: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    flex: 1,
  },
  checkmark: {
    width: 16,
    height: 16,
    backgroundColor: '#0288D1',
    borderRadius: 8,
  },
  bg: {
    flex: 1
  }
});
