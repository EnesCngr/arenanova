import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseAuthConfig'; // Check file path

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/'); // Redirect to login
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Background */}
      <View className="h-48 bg-purple-600 rounded-b-[40px] absolute w-full top-0" />

      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          
          {/* Profile Card */}
          <View className="items-center mt-8">
            <View className="bg-white p-1 rounded-full shadow-lg border-4 border-purple-400">
              <Image 
                source={{ uri: 'https://avatar.iran.liara.run/public' }} 
                className="w-28 h-28 rounded-full bg-gray-200"
              />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mt-3">
              {user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text className="text-purple-200 font-medium mb-4">{user?.email}</Text>
          </View>

          {/* Stats Example */}
          <View className="flex-row justify-around mx-6 bg-white p-4 rounded-2xl shadow-sm mt-4">
            <View className="items-center">
              <Text className="font-bold text-xl text-gray-800">12</Text>
              <Text className="text-gray-500 text-xs">Events</Text>
            </View>
            <View className="h-full w-[1px] bg-gray-200" />
            <View className="items-center">
              <Text className="font-bold text-xl text-gray-800">5</Text>
              <Text className="text-gray-500 text-xs">Tickets</Text>
            </View>
            <View className="h-full w-[1px] bg-gray-200" />
            <View className="items-center">
              <Text className="font-bold text-xl text-gray-800">140</Text>
              <Text className="text-gray-500 text-xs">Points</Text>
            </View>
          </View>

          {/* Menu Options */}
          <View className="px-6 mt-6 space-y-3">
            <Text className="text-gray-500 font-bold ml-2 mb-1">Account Settings</Text>
            <MenuItem icon="person-outline" title="Personal Information" />
            <MenuItem icon="notifications-outline" title="Notifications" />
            <MenuItem icon="card-outline" title="My Payments" />
            
            <Text className="text-gray-500 font-bold ml-2 mt-4 mb-1">Others</Text>
            <MenuItem icon="help-circle-outline" title="Help & Support" />
            
            {/* Logout Button */}
            <TouchableOpacity 
              onPress={handleLogout}
              className="flex-row items-center bg-red-50 p-4 rounded-xl mt-4 border border-red-100"
            >
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              <Text className="text-red-500 font-bold text-lg flex-1 ml-3">Log Out</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Menu Item Component
function MenuItem({ icon, title }: { icon: any, title: string }) {
  return (
    <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:bg-gray-50">
      <Ionicons name={icon} size={22} color="#4b5563" />
      <Text className="flex-1 text-gray-700 font-medium text-base ml-3">{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
}