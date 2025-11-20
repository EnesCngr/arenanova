import { StatusBar } from 'expo-status-bar';
import React from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from 'react-native-reanimated';


export default function Index() {
  return (
   < View className="flex-1 justify-center items-center px-6">
      <StatusBar style="light" />
      <Animated.Text entering={FadeInUp.delay(500).duration(1000).springify()} className="text-6xl text-navy-600">Home Screen</Animated.Text>

      </View>
  );
}

