import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';
import OrderSheet from '../../component/order';

const MENU_ITEMS = [
  {
    id: '1',
    name: 'Cheese Burger',
    description: 'Juicy beef burger with cheese',
    price: '$8.99',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    name: 'Fried Chicken',
    description: 'Crispy golden chicken',
    price: '$10.50',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni & cheese',
    price: '$12.99',
    image: 'https://via.placeholder.com/100',
  },
];

export default function MENU() {
  const navigation = useNavigation();
  const { name } = useLocalSearchParams();
  const orderSheetRef = useRef<ActionSheetRef>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);

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

  return (
    <LinearGradient
      colors={['#9f6eadbe', '#ac82b1c8', '#b61fbcb0']}
      style={{ flex: 1 }}
    >
      <ScrollView className="pt-10 px-5" contentContainerStyle={{ flexGrow: 1 }}>
        {/* BACK BUTTON */}
        <TouchableOpacity 
          className="mb-5"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* DYNAMIC RESTAURANT NAME */}
        <Text className="text-white text-2xl font-bold mb-5">
          {name || 'Menu'}
        </Text>

        {/* MENU LIST */}
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-white rounded-2xl p-4 mb-4 flex-row items-center"
            >
              {/* FOOD IMAGE */}
              <Image
                source={{ uri: item.image }}
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
                  {item.price}
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
      </ScrollView>

      {/* CART BUTTON */}
      {cartItems.length > 0 && (
        <TouchableOpacity
          onPress={() => orderSheetRef.current?.show()}
          className="absolute bottom-6 right-6 bg-purple-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="cart" size={24} color="white" />
          <View className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">{cartItems.length}</Text>
          </View>
        </TouchableOpacity>
      )}

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