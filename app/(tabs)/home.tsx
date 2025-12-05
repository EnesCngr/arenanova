import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const RESTAURANTS = [
  {
    id: '1',
    name: 'Pizza Hut',
    storeid: 'pizza',
    category: 'Italian • Pizza',
    image: require('../../photo/pizza.jpg'),
  },
  {
    id: '2',
    name: 'Sushi Express',
    storeid: 'sushi',
    category: 'Japanese • Sushi',
    image: require('../../photo/sushi.jpg'),
  },
  {
    id: '3',
    name: 'Cafe Bliss',
    storeid: 'cafe',
    category: 'Coffee • Cafe',
    image: require('../../photo/coffe.jpg'),
  },
  {
    id: '4',
    name: 'Ice Cream Dream',
    storeid: 'ice',
    category: 'Dessert • Ice Cream',
    image: require('../../photo/mcice.jpg'),
  },
  {
    id: '5',
    name: 'Burger Kingdom',
    storeid: 'burger',
    category: 'American • Burgers',
    image: require('../../photo/burger.jpg'),
  },
];

export default function Home() {
  const router = useRouter();
  const { eventName, eventLocation } = useLocalSearchParams();

  const goToMenu = (restaurant: any) => {
    router.push({
      pathname: '/(tabs)/MENU',
      params: {
        id: restaurant.id,
        storeid: restaurant.storeid,
        name: restaurant.name,
      },
    });
  };

  return (
    <LinearGradient
      colors={['#010101be', '#000000c8', '#050405b0']}
      style={{ flex: 1 }}
    >
      <FlatList
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
        ListHeaderComponent={
          <>
            {eventName && (
              <View className="mb-4 bg-white/20 p-4 rounded-xl">
                <Text className="text-white/70 text-sm mb-1">
                  {eventLocation}
                </Text>
                <Text className="text-white text-xl font-bold">
                  {eventName}
                </Text>
              </View>
            )}
            <Text className="text-white text-3xl font-bold mb-6">
              Restaurants
            </Text>
          </>
        }
        data={RESTAURANTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToMenu(item)}
            activeOpacity={0.8}
            className="bg-white rounded-2xl mb-4 overflow-hidden"
          >
            <View style={{ width: '100%', aspectRatio: 16/11, overflow: 'hidden' }}>
              <Image
                source={item.image}
                style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
              />
            </View>

            <View className="p-4">
              <Text className="text-lg font-bold text-black">
                {item.name}
              </Text>

              <Text className="text-sm text-gray-600 mb-2">
                {item.category}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="gold" />
                  <Text className="ml-1 text-gray-700">4.6</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}