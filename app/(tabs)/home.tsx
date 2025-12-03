import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const RESTAURANTS = [
  {
    id: '1',
    name: 'Pizza Hut',
    storeid: 'pizza',
    category: 'Italian • Pizza',
    image: 'https://via.placeholder.com/150?text=Pizza',
  },
  {
    id: '2',
    name: 'Sushi Express',
    storeid: 'sushi',
    category: 'Japanese • Sushi',
    image: 'https://via.placeholder.com/150?text=Sushi',
  },
  {
    id: '3',
    name: 'Cafe Bliss',
    storeid: 'cafe',
    category: 'Coffee • Cafe',
    image: 'https://via.placeholder.com/150?text=Cafe',
  },
  {
    id: '4',
    name: 'Ice Cream Dream',
    storeid: 'ice',
    category: 'Dessert • Ice Cream',
    image: 'https://via.placeholder.com/150?text=IceCream',
  },
  {
    id: '5',
    name: 'Burger Kingdom',
    storeid: 'burger',
    category: 'American • Burgers',
    image: 'https://via.placeholder.com/150?text=Burger',
  },
];

export default function Home() {
  const router = useRouter();

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
      colors={['#9f6eadbe', '#ac82b1c8', '#b61fbcb0']}
      style={{ flex: 1 }}
    >
      <FlatList
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
        ListHeaderComponent={
          <Text className="text-white text-3xl font-bold mb-6">
            Restaurants
          </Text>
        }
        data={RESTAURANTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToMenu(item)}
            activeOpacity={0.8}
            className="bg-white rounded-2xl mb-4 overflow-hidden"
          >
            <Image
              source={{ uri: item.image }}
              className="w-full h-40"
            />

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