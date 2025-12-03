import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';
import OrderSheet from '../../component/order';
import { getMenuByRestaurant, MenuItem } from '../../lib/firebaseMenu';

export default function MENU() {
  const navigation = useNavigation();
  const { name, storeid } = useLocalSearchParams();
  const orderSheetRef = useRef<ActionSheetRef>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, [storeid]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const storeIdParam = String(storeid || 'pizza');
      console.log(`Starting to fetch menu items for storeid: ${storeIdParam}`);
      const items = await getMenuByRestaurant(storeIdParam);
      console.log(`Menu items loaded for ${storeIdParam}:`, items);
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: any) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    
    orderSheetRef.current?.show();
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleCheckout = () => {
    Alert.alert('Checkout', 'Order placed successfully!');
    setCartItems([]);
    orderSheetRef.current?.hide();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#9f6eadbe', '#ac82b1c8', '#b61fbcb0']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#9f6eadbe', '#ac82b1c8', '#b61fbcb0']}
      style={{ flex: 1 }}
    >
      <ScrollView className="pt-10 px-5 pb-24" contentContainerStyle={{ flexGrow: 1 }}>
        {/* BACK BUTTON */}
        <TouchableOpacity 
          className="mb-5"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* RESTAURANT TITLE AND CART BUTTON */}
        <View className="flex-row items-center justify-between mb-5">
          <Text className="text-white text-2xl font-bold">
            {name || 'Menu'}
          </Text>
          <TouchableOpacity
            onPress={() => orderSheetRef.current?.show()}
            className="bg-purple-600 rounded-full px-4 py-2 flex-row items-center"
          >
            <Ionicons name="cart" size={20} color="white" />
            <Text className="text-white font-bold ml-2">
              {cartItems.length > 0 ? cartItems.length : 'Cart'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MENU LIST */}
        {menuItems.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg">No menu items available</Text>
          </View>
        ) : (
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-white rounded-2xl p-4 mb-4 flex-row items-center"
              >
                {/* FOOD IMAGE */}
                <Image
                  source={{ uri: item.image || 'https://via.placeholder.com/100' }}
                  className="w-20 h-20 rounded-xl mr-4"
                />

                {/* FOOD INFO */}
                <View className="flex-1">
                  <Text className="text-lg font-bold text-black">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-1">
                    {item.description}
                  </Text>
                  <Text className="text-base font-bold text-purple-700">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>

                {/* ADD BUTTON */}
                <TouchableOpacity 
                  className="bg-purple-600 p-3 rounded-full"
                  onPress={() => addToCart(item)}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>

      {/* ORDER SHEET */}
      <OrderSheet
        ref={orderSheetRef}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
    </LinearGradient>
  );
}