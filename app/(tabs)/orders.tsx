import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebasedConfig';

interface Order {
  id: string;
  restaurantName: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  items: any[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((doc) => {
        ordersList.push({
          id: doc.id,
          restaurantName: doc.data().restaurantName || 'Unknown Restaurant',
          totalAmount: doc.data().totalAmount || 0,
          status: doc.data().status || 'Pending',
          createdAt: doc.data().createdAt,
          items: doc.data().items || [],
        });
      });
      // Sort by createdAt on the client side
      ordersList.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      setOrders(ordersList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'preparing':
        return '#f59e0b'; // Amber
      case 'ready':
        return '#10b981'; // Green
      case 'delivered':
        return '#3b82f6'; // Blue
      case 'cancelled':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <FlatList
        contentContainerStyle={{ padding: 20, paddingTop: 40 }}
        ListHeaderComponent={
          <Text className="text-white text-3xl font-bold mb-6">My Orders</Text>
        }
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-white rounded-2xl mb-4 overflow-hidden shadow-lg"
          >
            {/* Restaurant Info & Status */}
            <View className="p-4 flex-row items-center justify-between border-b border-gray-200">
              <View className="flex-1">
                <Text className="text-lg font-bold text-black">{item.restaurantName}</Text>
                <Text className="text-xs text-gray-500 mt-1">{formatDate(item.createdAt)}</Text>
              </View>
              <View
                style={{ backgroundColor: getStatusColor(item.status) }}
                className="px-3 py-1 rounded-full"
              >
                <Text className="text-white text-xs font-bold">{item.status}</Text>
              </View>
            </View>

            {/* Order Items */}
            <View className="p-4">
              {item.items.length > 0 && (
                <>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Items:</Text>
                  {item.items.slice(0, 2).map((orderItem, idx) => (
                    <View key={idx} className="flex-row items-center mb-2">
                      <Text className="text-xs text-gray-600">
                        • {orderItem.name} x{orderItem.quantity}
                      </Text>
                    </View>
                  ))}
                  {item.items.length > 2 && (
                    <Text className="text-xs text-gray-500">
                      + {item.items.length - 2} more item(s)
                    </Text>
                  )}
                </>
              )}

              {/* Order Total */}
              <View className="mt-4 pt-4 border-t border-gray-200 flex-row justify-between">
                <Text className="font-semibold text-gray-700">Total:</Text>
                <Text className="font-bold text-purple-600">${item.totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="bag-outline" size={64} color="white" />
            <Text className="text-white text-lg mt-4">No orders yet</Text>
            <Text className="text-white/70 text-sm mt-2">Start ordering to see your orders here</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}
