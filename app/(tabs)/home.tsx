import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const RESTAURANTS = [
  {
    id: '1',
    name: 'pizza hut',
    category: 'Pizza • Fast Food',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Burger King',
    category: 'Burgers • Fries',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Sushi grill',
    category: 'Japanese • Sushi',
    image: 'https://via.placeholder.com/150',
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

              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="gold" />
                <Text className="ml-1 text-gray-700">4.6</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}