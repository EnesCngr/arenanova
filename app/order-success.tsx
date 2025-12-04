import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore'; // Real-time listener
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebasedConfig'; // Your database connection

export default function OrderSuccess() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- LIVE TRACKING SYSTEM ---
  useEffect(() => {
    if (!orderId) return;

    // We start "listening" to this order in the database.
    // If the backend team changes anything, this updates instantly.
    const unsub = onSnapshot(doc(db, "orders", String(orderId)), (doc) => {
      if (doc.exists()) {
        setOrder(doc.data());
      }
      setLoading(false);
    });

    return () => unsub(); // Stop listening when leaving the screen
  }, [orderId]);

  // Determine color, icon, and text based on status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Preparing':
        return { color: '#f59e0b', icon: 'restaurant', text: 'Preparing your order...', step: 1 };
      case 'Ready':
        return { color: '#3b82f6', icon: 'bicycle', text: 'On the way / Ready', step: 2 };
      case 'Completed':
        return { color: '#22c55e', icon: 'checkmark-circle', text: 'Delivered', step: 3 };
      default:
        // Default state (Placed)
        return { color: '#9333ea', icon: 'receipt', text: 'Order Received', step: 0 };
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={{ marginTop: 10, color: 'gray' }}>Loading order details...</Text>
      </View>
    );
  }

  // If order not found or error
  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Order not found.</Text>
        <ActivityIndicator size="small" color="#9333ea" />
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={{ marginTop: 20 }}>
          <Text style={{ color: '#9333ea' }}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order.status || 'Preparing');

  return (
    <LinearGradient
      colors={['#ffffff', '#f3e8ff']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        
        {/* Top Section: Status Icon & Message */}
        <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 30 }}>
            <View style={{ backgroundColor: statusInfo.color + '20', padding: 20, borderRadius: 100 }}>
                <Ionicons name={statusInfo.icon as any} size={64} color={statusInfo.color} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginTop: 16, textAlign: 'center' }}>
                {statusInfo.text}
            </Text>
            <Text style={{ color: '#6b7280', marginTop: 4 }}>
                Order No: #{String(orderId).slice(0, 6).toUpperCase()}
            </Text>
        </View>

        {/* --- Progress Bar --- */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, paddingHorizontal: 10 }}>
            {[1, 2, 3].map((step) => (
                <View key={step} style={{ alignItems: 'center', flex: 1 }}>
                    {/* Line */}
                    <View style={{ 
                        height: 4, 
                        width: '100%', 
                        backgroundColor: step <= statusInfo.step ? statusInfo.color : '#e5e7eb',
                        borderRadius: 2,
                        marginBottom: 8
                    }} />
                    {/* Text */}
                    <Text style={{ fontSize: 10, color: step <= statusInfo.step ? '#374151' : '#9ca3af', fontWeight: 'bold' }}>
                        {step === 1 ? 'Preparing' : step === 2 ? 'On the way' : 'Delivered'}
                    </Text>
                </View>
            ))}
        </View>

        {/* Receipt Card (Order Details) */}
        <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, borderBottomWidth: 1, borderColor: '#f3f4f6', paddingBottom: 10 }}>
                Order Details
            </Text>
            
            {/* List Items */}
            {order.items?.map((item: any, index: number) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', color: '#9333ea', marginRight: 8 }}>{item.quantity}x</Text>
                        <Text style={{ color: '#374151', flex: 1 }} numberOfLines={1}>{item.name}</Text>
                    </View>
                    <Text style={{ fontWeight: '600', color: '#374151' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                </View>
            ))}

            <View style={{ height: 1, backgroundColor: '#e5e7eb', marginVertical: 15 }} />

            {/* Total Price */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>Total</Text>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#9333ea' }}>
                    ${order.totalAmount?.toFixed(2)}
                </Text>
            </View>
        </View>

        {/* Continue Shopping Button */}
        <TouchableOpacity
            onPress={() => router.push('/(tabs)/home')}
            style={{ backgroundColor: '#9333ea', padding: 18, borderRadius: 15, marginTop: 30, shadowColor: '#9333ea', shadowOpacity: 0.3, shadowRadius: 10 }}
        >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                Continue Shopping
            </Text>
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
}