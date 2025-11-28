import React from 'react';
import { SafeAreaView, Text } from 'react-native';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      <Text className="text-2xl font-bold text-gray-800">Welcome! 👋</Text>
      <Text className="text-gray-500 mt-2">Home Feed</Text>
    </SafeAreaView>

    
  );
}