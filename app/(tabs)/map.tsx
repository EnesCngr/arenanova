import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MapScreen() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('pizza');

  const restaurants = [
    { id: 'pizza', name: 'Pizza Hut', address: 'Rachelsmolen 1, 5612 MA Eindhoven', phone: '+1-800-PIZZA-1' },
    { id: 'sushi', name: 'Sushi Express', address: 'Rachelsmolen 1, 5612 MA Eindhoven', phone: '+1-800-SUSHI-1' },
    { id: 'cafe', name: 'Cafe Bliss', address: 'Rachelsmolen 1, 5612 MA Eindhoven', phone: '+1-800-CAFE-1' },
    { id: 'ice', name: 'Ice Cream Dream', address: 'Rachelsmolen 1, 5612 MA Eindhoven', phone: '+1-800-ICE-1' },
    { id: 'burger', name: 'Burger Kingdom', address: 'Rachelsmolen 1, 5612 MA Eindhoven', phone: '+1-800-BURGER-1' },
  ];

  const handleOpenMaps = () => {
    const selectedRestaurantData = restaurants.find(r => r.id === selectedRestaurant);
    if (selectedRestaurantData) {
      const encodedAddress = encodeURIComponent(selectedRestaurantData.address);
      const url = `https://www.google.com/maps/search/${encodedAddress}`;
      Linking.openURL(url);
    }
  };

  const handleCall = () => {
    const selectedRestaurantData = restaurants.find(r => r.id === selectedRestaurant);
    if (selectedRestaurantData) {
      Linking.openURL(`tel:${selectedRestaurantData.phone}`);
    }
  };

  const currentRestaurant = restaurants.find(r => r.id === selectedRestaurant);

  return (
    <LinearGradient colors={['#9f6eadbe', '#ac82b1c8', '#b61fbcb0']} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
        {/* Header */}
        <Text className="text-white text-3xl font-bold mb-6">Restaurant Locations</Text>

        {/* Map Image */}
        <View className="rounded-2xl overflow-hidden bg-white shadow-lg mb-6">
          <Image
            source={require('../../photo/map.jpeg')}
            style={{ width: '100%', height: 280, resizeMode: 'cover' }}
          />
        </View>

        {/* Restaurant Selection */}
        <Text className="text-white text-lg font-bold mb-3">Select Restaurant</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {restaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              onPress={() => setSelectedRestaurant(restaurant.id)}
              className={`mr-3 px-4 py-2 rounded-full border-2 ${
                selectedRestaurant === restaurant.id
                  ? 'bg-purple-600 border-purple-600'
                  : 'bg-white/20 border-white/30'
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedRestaurant === restaurant.id ? 'text-white' : 'text-white'
                }`}
              >
                {restaurant.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Restaurant Details Card */}
        {currentRestaurant && (
          <TouchableOpacity activeOpacity={0.8} className="bg-white rounded-2xl mb-4 overflow-hidden shadow-lg">
            {/* Restaurant Name & Info */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-black">{currentRestaurant.name}</Text>
            </View>

            {/* Details */}
            <View className="p-4">
              {/* Address */}
              <View className="flex-row items-start mb-4">
                <View className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                  <Ionicons name="location" size={20} color="#7c3aed" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">Address</Text>
                  <Text className="text-sm text-gray-600 mt-1">{currentRestaurant.address}</Text>
                </View>
              </View>

              {/* Phone */}
              <View className="flex-row items-start mb-4">
                <View className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <Ionicons name="call" size={20} color="#0ea5e9" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">Phone</Text>
                  <Text className="text-sm text-blue-600 mt-1 font-semibold">{currentRestaurant.phone}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3 mt-6">
                <TouchableOpacity
                  onPress={handleOpenMaps}
                  className="flex-1 bg-purple-600 rounded-lg py-3 flex-row items-center justify-center"
                >
                  <Ionicons name="map" size={18} color="white" />
                  <Text className="text-white font-bold ml-2">Open Maps</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCall}
                  className="flex-1 bg-blue-500 rounded-lg py-3 flex-row items-center justify-center"
                >
                  <Ionicons name="call" size={18} color="white" />
                  <Text className="text-white font-bold ml-2">Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        </ScrollView>
      </LinearGradient>
    );
}
