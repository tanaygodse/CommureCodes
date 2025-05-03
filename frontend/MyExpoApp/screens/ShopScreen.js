// screens/ShopScreen.js
import React, { useContext, useState } from 'react';
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
    cost: 0,
  },
  {
    id: '2',
    name: 'Superhero Cape',
    image: require('../assets/avatar_boy2.png'),
    cost: 50,
  },
  {
    id: '3',
    name: 'Astronaut Suit',
    image: require('../assets/avatar_boy3.png'),
    cost: 100,
  },
];

export default function ShopScreen() {
  const {
    avatar,
    setAvatar,
    points,             // pulled from context
    setPoints,
    ownedCostumes,      // pulled from context
    setOwnedCostumes,
  } = useContext(AvatarContext);
  const balance = points;
  // Track owned costume IDs; default owns those with cost 0
  const [owned, setOwned] = useState(() => {
    const freeIds = costumes.filter(c => c.cost === 0).map(c => c.id);
    return new Set(freeIds);
  });

  const renderItem = ({ item }) => {
    const isSelected = avatar === item.image;
    const isOwned = owned.has(item.id);
    const canAfford = balance >= item.cost;

    const handleBuy = item => {
      if (item.cost > 0 && balance >= item.cost) {
        setPoints(balance - item.cost);
        setOwnedCostumes(prev => new Set(prev).add(item.id));
      }
      setAvatar(item.image);
      setAvatar(item.image);
    };

    const handleSelect = () => {
      setAvatar(item.image);
    };

    return (
      <View style={styles.item}>
        <Image source={item.image} style={styles.thumb} resizeMode="contain" />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>

          {!isSelected ? (
            isOwned ? (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelect}
              >
                <Text style={styles.selectText}>Select</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.buyButton,
                  item.cost === 0 && styles.freeButton,
                  item.cost > 0 && !canAfford && styles.disabledButton,
                ]}
                onPress={handleBuy}
                disabled={!canAfford}
              >
                <Text style={styles.buyText}>
                  {item.cost === 0 ? 'Free' : `Buy (${item.cost})`}
                </Text>
              </TouchableOpacity>
            )
          ) : (
            <Text style={styles.selectedText}>Selected</Text>
          )}
        </View>
      </View>
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
        <Text style={styles.balance}>Balance: {balance}</Text>
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
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    alignSelf: 'center',
    color: 'white',
  },
  balance: {
    fontSize: 18,
    marginBottom: 12,
    alignSelf: 'center',
    color: 'white',
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
  thumb: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
  },
  buyButton: {
    backgroundColor: '#0288D1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  freeButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buyText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectButton: {
    backgroundColor: '#FFA726',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0288D1',
  },
  bg: {
    flex: 1,
  },
});