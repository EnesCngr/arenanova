import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { auth } from '../firebaseAuthConfig'; // Check file path

export default function Index() {
  const sheetRef = useRef<ActionSheetRef>(null);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // If login successful, go to home tab
      router.replace('/(tabs)/home'); 
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>

      {/* Background Video */}
      <Video
        source={require('../assets/video/videobg.mp4')} // Check file path
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER}
        isMuted
        isLooping
        shouldPlay
      />
      {/* Overlay */}
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' }} />

      {/* Center Logo/Text */}
      <View className='flex-1 justify-center items-center' style={{ paddingBottom: 100 }}>
        <Text className='text-5xl font-bold text-white mb-2 tracking-widest'>YUMFEST</Text>    
        <Text className='text-gray-200 text-lg tracking-widest'>World of Festivals</Text>    
      </View>

      {/* Bottom Button */}
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80 }}>
        <TouchableOpacity 
          onPress={() => sheetRef.current?.show()}
          className="bg-purple-600 px-10 py-5 rounded-full shadow-lg shadow-purple-500/50">
          <Text className="text-white text-xl font-bold">Let's Get Started 🚀</Text>
        </TouchableOpacity>
      </View>

      {/* LOGIN PANEL (Action Sheet) */}
      <ActionSheet
        ref={sheetRef}
        gestureEnabled={true}
        containerStyle={{ borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingBottom: 40 }}
        indicatorStyle={{ backgroundColor: 'gray', width: 100 }}
      >
        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</Text>

          {/* Email input */}
          <Text className='font-bold text-gray-600 mb-2 ml-1'>Email</Text>
          <View className="h-14 w-full bg-gray-100 rounded-xl px-4 justify-center mb-4 border border-gray-200">
            <TextInput
              placeholder="example@email.com"
              className="text-base text-black"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          {/* Password input */}
          <Text className='font-bold text-gray-600 mb-2 ml-1'>Password</Text>
          <View className="h-14 w-full bg-gray-100 rounded-xl px-4 justify-center mb-6 border border-gray-200">
            <TextInput
              placeholder="******"
              secureTextEntry
              className="text-base text-black"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          {/* Login Button */}
          <TouchableOpacity 
            className="bg-purple-600 h-14 rounded-xl items-center justify-center shadow-md shadow-purple-200"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-lg font-bold">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
          
          {/* SIGN UP BUTTON */}
          <TouchableOpacity 
            className="mt-6 py-2" 
            onPress={() => {
              sheetRef.current?.hide(); // Close panel first
              router.push("/signup");   // Then go to signup page
            }}
          >
            <Text className="text-gray-500 text-center text-base">
              Don't have an account? <Text className="text-purple-600 font-bold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
      
    </View>
  );
}