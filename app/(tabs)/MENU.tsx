import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';
import OrderSheet from '../../component/order';
import { getMenuByRestaurant, MenuItem } from '../../lib/firebaseMenu';
// Stripe and Firebase Imports
import { useStripe } from '@stripe/stripe-react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebasedConfig';

export default function MENU() {
  const navigation = useNavigation();
  const router = useRouter();
  
  // Get URL parameters
  const params = useLocalSearchParams();
  
  // CRITICAL FIX: Handle undefined parameters (e.g., when accessed from Tab Bar)
  const storeidRaw = params.storeid;
  const nameRaw = params.name;

  // Set safe defaults to prevent database errors
  const safeStoreId = Array.isArray(storeidRaw) ? storeidRaw[0] : (storeidRaw || 'general_store_id');
  const safeStoreName = Array.isArray(nameRaw) ? nameRaw[0] : (nameRaw || 'General Menu');

  const orderSheetRef = useRef<ActionSheetRef>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    loadMenu();
  }, [safeStoreId]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      // If ID is generic, fetch a default category (e.g., pizza) so the list isn't empty
      const fetchId = safeStoreId === 'general_store_id' ? 'pizza' : safeStoreId;
      
      const items = await getMenuByRestaurant(fetchId);
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
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
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
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
  };

  // --- STRIPE INTEGRATION (Direct API for School Project) ---
  const fetchPaymentIntent = async (amount: number) => {
    try {
      const amountInCents = Math.round(amount * 100);

      // ⚠️ PASTE YOUR 'sk_test_...' KEY HERE
      const STRIPE_SECRET_KEY = 'sk_test_51SUupzAouzJdpNyvfvb38IWmlyBtJFaZYzwpuH6AxNq60Ko9IHDeF7aUxcFzZ5Tc7uJDTUuyy9McoFgw4hLpldwk00kqbxl0r7'; 

      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: amountInCents.toString(),
          currency: 'usd',
          'automatic_payment_methods[enabled]': 'true',
        }).toString(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        Alert.alert("Error", "Stripe Error: " + (data.error?.message || 'Unknown error'));
        return null;
      }

      return data.client_secret;
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No internet connection.");
      return null;
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setPaymentProcessing(true);

    const totalAmount = cartItems.reduce((total, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace('$', ''));
        return total + price * item.quantity;
      }, 0);

    const clientSecret = await fetchPaymentIntent(totalAmount);

    if (!clientSecret) {
        setPaymentProcessing(false);
        return;
    }

    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'YumFest App',
      returnURL: 'your-app://stripe-redirect',
    });

    if (initError) {
      Alert.alert("Error", "Could not initialize payment sheet.");
      setPaymentProcessing(false);
      return;
    }

    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      // Payment failed or canceled
      setPaymentProcessing(false);
    } else {
      // ✅ PAYMENT SUCCESSFUL - SAVE TO FIREBASE
      try {
        // Double check for undefined values before saving
        const finalStoreId = safeStoreId || 'Unknown_Restaurant';
        const finalStoreName = safeStoreName || 'General Order';
        const finalUserId = auth.currentUser?.uid || 'guest_user';

        const orderData = {
            items: cartItems,
            totalAmount: totalAmount,
            status: 'Preparing', // Initial status
            restaurantId: finalStoreId, 
            restaurantName: finalStoreName,
            createdAt: serverTimestamp(),
            userId: finalUserId,
            paymentId: 'Stripe_Success_Transaction'
        };
        
        // Add to Firestore
        const docRef = await addDoc(collection(db, "orders"), orderData);
        
        // Clear cart & Close modal
        setCartItems([]);
        orderSheetRef.current?.hide();
        
        // Redirect to Success Page
        router.replace({ 
            pathname: "/order-success", 
            params: { orderId: docRef.id } 
        });

      } catch (dbError: any) {
        console.error("Database Error:", dbError);
        Alert.alert("Critical Error", "Payment successful but failed to save order. Error: " + dbError.message);
      }
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ac82b1' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#9f6eadbe', '#ac82b1c8', '#b61fbcb0']} style={{ flex: 1 }}>
      <ScrollView className="pt-10 px-5 pb-24" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Back Button */}
        <TouchableOpacity className="mb-5" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Header */}
        <View className="flex-row items-center justify-between mb-5">
          <Text className="text-white text-2xl font-bold">{safeStoreName}</Text>
          <TouchableOpacity onPress={() => orderSheetRef.current?.show()} className="bg-purple-600 rounded-full px-4 py-2 flex-row items-center">
            <Ionicons name="cart" size={20} color="white" />
            <Text className="text-white font-bold ml-2">{cartItems.length > 0 ? cartItems.length : 'Cart'}</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items List */}
        <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.8} className="bg-white rounded-2xl p-4 mb-4 flex-row items-center">
                <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} className="w-20 h-20 rounded-xl mr-4" />
                <View className="flex-1">
                  <Text className="text-lg font-bold text-black">{item.name}</Text>
                  <Text className="text-sm text-gray-600 mb-1">{item.description}</Text>
                  <Text className="text-base font-bold text-purple-700">${item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity className="bg-purple-600 p-3 rounded-full" onPress={() => addToCart(item)}>
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
      </ScrollView>

      {/* Cart Modal */}
      <OrderSheet
        ref={orderSheetRef}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout} 
      />
      
      {/* Loading Overlay */}
      {isPaymentProcessing && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
            <View className="bg-white p-6 rounded-2xl items-center w-64">
                <ActivityIndicator size="large" color="#9333ea" />
                <Text className="mt-4 font-bold text-gray-700 text-center">Processing Payment...</Text>
            </View>
        </View>
      )}
    </LinearGradient>
  );
}