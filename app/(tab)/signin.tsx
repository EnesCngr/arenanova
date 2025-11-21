import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from '../../lib/auth';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const user = await signUp(email, password);
      Alert.alert('Success', 'Account created successfully!');
      // Navigate to menu or home screen
      router.push('/(tab)/menutab');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Sign Up Form */}
      <View className="flex-1 justify-center px-6">
        <Text className="text-4xl font-bold text-white mb-8 text-center">Create Account</Text>

        {/* Email Input */}
        <Text className='font-bold text-lg mb-2 text-white'>Email</Text>
        <View className="h-14 w-full bg-white rounded-xl px-4 justify-center mb-4 border-2 border-gray-300">
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="gray"
            className="text-base"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <Text className='font-bold text-lg mb-2 text-white'>Password</Text>
        <View className="h-14 w-full bg-white rounded-xl px-4 justify-center mb-4 border-2 border-gray-300">
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="gray"
            secureTextEntry
            className="text-base"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password Input */}
        <Text className='font-bold text-lg mb-2 text-white'>Confirm Password</Text>
        <View className="h-14 w-full bg-white rounded-xl px-4 justify-center mb-6 border-2 border-gray-300">
          <TextInput
            placeholder="Re-enter your password"
            placeholderTextColor="gray"
            secureTextEntry
            className="text-base"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity 
          className="bg-blue-600 h-14 rounded-xl items-center justify-center mb-4"
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login Button */}
        <TouchableOpacity 
          className="bg-gray-200 h-14 rounded-xl items-center justify-center"
          onPress={() => router.back()}
        >
          <Text className="text-black text-lg font-semibold">Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;