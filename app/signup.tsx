import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseAuthConfig'; // Check file path

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created successfully!');
      // Login successful, redirect to Home tabs
      router.replace('/(tabs)/home'); 
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Background Video (Using expo-av as requested) */}
      <Video
        source={require('../assets/video/videobg.mp4')} // Check file path
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER}
        isMuted
        isLooping
        shouldPlay
      />
      {/* Overlay */}
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' }} />

      <View className="flex-1 justify-center px-6">
        <Text className="text-4xl font-bold text-white mb-2 text-center">Join Us</Text>
        <Text className="text-gray-300 mb-8 text-center">Enter the world of Yumfest</Text>

        {/* Email */}
        <View className="space-y-4">
          <Text className="text-white text-lg font-semibold">Email</Text>
            <TextInput
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            className="bg-white/90 text-gray-800 p-4 rounded-xl border border-white/30 text-base"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            />

            {/* Password */}
            <Text className="text-white text-lg font-semibold">Password</Text>
            <TextInput
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            className="bg-white/90 text-gray-800 p-4 rounded-xl border border-white/30 text-base"
            value={password}
            onChangeText={setPassword}
            />

            {/* Confirm Password */}
            <Text className="text-white text-lg font-semibold">Confirm Password</Text>
            <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            className="bg-white/90 text-gray-800 p-4 rounded-xl border border-white/30 text-base"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity 
          className="bg-purple-600 h-14 rounded-xl items-center justify-center mt-8 shadow-lg shadow-purple-500/50"
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity 
          className="mt-6 py-2"
          onPress={() => router.back()}
        >
          <Text className="text-white text-center font-medium">
            Already have an account? <Text className="text-purple-400 font-bold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}