import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

export default function Index() {
  const sheetRef = useRef<any>(null);

  // Open ActionSheet automatically on screen load
  useEffect(() => {
    sheetRef.current?.show();
  }, []);

  return (
    <View style={{ flex: 1 }}>

      {/* Background video */}
      <Video
        source={require('../../assets/video/videobg.mp4')}
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER}
        isMuted
        isLooping
        shouldPlay
      />
      <View style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(167, 139, 250, 0.4)'
      }} />

      {/* Action Sheet */}
      <ActionSheet
        ref={sheetRef}
        closeOnTouchBackdrop={false}
        gestureEnabled={true}
        defaultOverlayOpacity={0.4}
      >
        <View className="p-5">
          {/* Email input */}
          <View className="h-14 w-full bg-white rounded-xl px-4 justify-center mb-4">
            <TextInput
              placeholder="Email"
              placeholderTextColor="gray"
              className="text-base"
            />
          </View>
          
          {/* Password input */}
          <View className="h-14 w-full bg-white rounded-xl px-4 justify-center mb-4">
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
              className="text-base"
            />
          </View>
          
          {/* Login Button */}
          <TouchableOpacity className="bg-blue-600 h-14 rounded-xl items-center justify-center mt-4">
            <Text className="text-white text-lg font-semibold">Login</Text>
          </TouchableOpacity>
          
          {/* Sign Up Button */}
          <TouchableOpacity className="bg-gray-200 h-14 rounded-xl items-center justify-center mt-2">
            <Text className="text-black text-lg font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
      
    </View>
  );
}
