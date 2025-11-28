import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, logOut, signIn } from '../../lib/auth';

/**
 * Utility Component: Login form.
 */
interface LoginPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => Promise<void>;
    loading: boolean;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
}

const LoginPanel = ({ isOpen, onClose, onLogin, loading, email, setEmail, password, setPassword }: LoginPanelProps) => {
    if (!isOpen) return null;
    
    return (
        <View className="absolute inset-0 bg-black/50 flex items-end">
            <View className="w-full bg-white rounded-t-3xl p-6 pb-8">
                {/* Drag Indicator */}
                <View className="w-20 h-1 bg-gray-300 rounded-full self-center mb-4" />
                
                <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</Text>

                {/* Email input */}
                <Text className="font-bold text-gray-600 mb-2 ml-1">Email</Text>
                <TextInput
                    placeholder="example@email.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="w-full h-14 bg-gray-100 rounded-xl px-4 border border-gray-200 mb-4"
                    placeholderTextColor="#9ca3af"
                />
                
                {/* Password input */}
                <Text className="font-bold text-gray-600 mb-2 ml-1">Password</Text>
                <TextInput
                    placeholder="••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="w-full h-14 bg-gray-100 rounded-xl px-4 border border-gray-200 mb-6"
                    placeholderTextColor="#9ca3af"
                />
                
                {/* Login Button */}
                <TouchableOpacity 
                    onPress={onLogin}
                    disabled={loading}
                    className="bg-purple-600 h-14 rounded-xl justify-center items-center shadow-md"
                >
                    <Text className="text-white text-lg font-bold">
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>
                
                {/* Sign Up Link */}
                <View className="mt-6">
                    <Text className="text-gray-500 text-center text-base">
                        Don't have an account? <Text className="text-purple-600 font-bold">Sign Up</Text>
                    </Text>
                </View>

                {/* Close Button */}
                <TouchableOpacity onPress={onClose} className="mt-4">
                    <Text className="text-center text-gray-500">Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


/**
 * Main Application Component (YUMFEST Login Screen)
 */
export default function AuthScreen() {
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoginPanelOpen, setIsLoginPanelOpen] = useState(false);

    // 1. Initial Authentication & State Listener
    useEffect(() => {
        setUser(getCurrentUser());
        setIsAuthReady(true);
    }, []);

    // 2. Email/Password Login Handler
    const handleLogin = async () => {
        setMessage('');
        if (!email || !password) {
            setMessage('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            setMessage('Login successful! Welcome to YUMFEST.');
            setIsLoginPanelOpen(false);
            setUser(getCurrentUser());
        } catch (error) {
            setMessage(`Login Failed: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    }

    // 3. Logout Handler
    const handleLogout = async () => {
        try {
            await logOut();
            setMessage('Logged out successfully.');
            setUser(null);
        } catch (error) {
            setMessage(`Logout failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    
    // --- Loading State ---
    if (!isAuthReady) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
                <Text className="text-lg text-gray-700">Loading Authentication...</Text>
            </SafeAreaView>
        );
    }

    // --- Authenticated View ---
    if (user && !user.isAnonymous) {
        return (
            <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center p-4">
                <View className="bg-white p-8 rounded-xl w-full max-w-md">
                    <Text className="text-3xl font-bold text-purple-700 mb-4 text-center">Welcome Back!</Text>
                    <Text className="text-gray-600 mb-2 text-center">You are signed in as:</Text>
                    <Text className="text-lg font-medium text-gray-800 mb-6 text-center">{user.email}</Text>
                    <Text className="text-sm text-gray-400 mb-8 text-center">User ID: {user.uid}</Text>
                    
                    <TouchableOpacity 
                        className="bg-red-500 py-3 px-6 rounded-full"
                        onPress={handleLogout}
                    >
                        <Text className="text-white text-lg font-bold text-center">Sign Out</Text>
                    </TouchableOpacity>
                    {message && (
                        <View className="mt-6 p-3 bg-red-100 rounded-lg">
                            <Text className="text-sm text-red-700 text-center">{message}</Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    // --- Unauthenticated (Initial Login Screen) View ---
    return (
        <SafeAreaView className="flex-1 bg-purple-600 justify-between">
            {/* Center Logo/Text */}
            <View className="flex-1 justify-center items-center">
                <Text className="text-5xl font-bold text-white mb-2 text-center">YUMFEST</Text>
                <Text className="text-gray-200 text-lg text-center">World of Festivals</Text>
            </View>

            {/* Error Message Display */}
            {message && (
                <View className={`p-4 ${message.includes('success') ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Text className={`text-center ${message.includes('success') ? 'text-green-700' : 'text-red-700'}`}>
                        {message}
                    </Text>
                </View>
            )}

            {/* Bottom Button */}
            <View className="items-center pb-8">
                <TouchableOpacity 
                    onPress={() => setIsLoginPanelOpen(true)}
                    className="bg-white px-12 py-4 rounded-full"
                >
                    <Text className="text-purple-600 text-xl font-bold">Let's Get Started 🚀</Text>
                </TouchableOpacity>
            </View>

            {/* LOGIN PANEL */}
            <LoginPanel
                isOpen={isLoginPanelOpen}
                onClose={() => setIsLoginPanelOpen(false)}
                onLogin={handleLogin}
                loading={loading}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
            />
        </SafeAreaView>
    );
}