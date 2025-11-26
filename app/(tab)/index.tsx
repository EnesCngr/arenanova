import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { auth } from '../../firebaseAuthConfig';

export default function Index() {
  const sheetRef = useRef<any>(null);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Open ActionSheet automatically on screen load
  useEffect(() => {
    sheetRef.current?.show();
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    if (user) { 
      Alert.alert('Success', 'Logged in successfully!');
      router.push('/(tab)/menutab');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  }

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
        backgroundColor: 'rgba(157, 121, 177, 0.7)'
      }} />

      <View className='flex-1 justify-center items-center' style={{ paddingBottom: 100 }}>
        <Text className='text-4xl font-bold text-white mb-4'>YUMFEST</Text>    
      </View>

      {/* Button to open ActionSheet */}
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 100 }}>
        <Text className='font-bold mb-2'>
          welcome to my app
        </Text>
        <TouchableOpacity 
          onPress={() => sheetRef.current?.show()}
          className="bg-black px-8 py-4 rounded-2xl">
          <Text className="text-white text-xl font-bold">let get started</Text>
        </TouchableOpacity>
      </View>

      {/* Action Sheet that shows the login form */}
      <ActionSheet
        ref={sheetRef}
        closeOnTouchBackdrop={false}
        gestureEnabled={true}
        defaultOverlayOpacity={0.4}
      >
        <View className="p-5">
          {/* Email input */}
         
        <Text className='font-bold text-lg mb-2'>Email</Text>
          <View className="h-14 w-full bg-white rounded-xl px-4 justify-center mb-3 border-2 border-gray-300">
            <TextInput
              placeholder="Email"
              placeholderTextColor="gray"
              className="text-base"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          {/* Password input */}
           <Text className='font-bold text-lg mb-2'>Password</Text>
          <View className="h-14 w-full bg-white rounded-xl px-4 justify-center mb-2 border-2 border-gray-300">
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
              className="text-base"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          {/* Login Button */}
          <TouchableOpacity 
            className="bg-blue-600 h-14 rounded-xl items-center justify-center mt-6"
            disabled={loading}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
          
          {/* Sign Up Button */}
          <TouchableOpacity 
            className="bg-gray-200 h-14 rounded-xl items-center justify-center mt-2" 
            onPress={() => router.push("/(tab)/signin")}
          >
            <Text className="text-black text-lg font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
      
    </View>
  );
}
