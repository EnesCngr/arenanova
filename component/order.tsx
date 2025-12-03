import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface OrderSheetProps {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

const OrderSheet = forwardRef<ActionSheetRef, OrderSheetProps>(
  ({ cartItems, onRemoveItem, onUpdateQuantity, onCheckout }, ref) => {
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return total + price * item.quantity;
      }, 0).toFixed(2);
    };

    return (
      <ActionSheet
        ref={ref}
        gestureEnabled={true}
        containerStyle={{ borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingBottom: 40 }}
        indicatorStyle={{ backgroundColor: 'gray', width: 100 }}
      >
        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Cart</Text>

          {cartItems.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="cart-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-400 mt-4 text-lg">Your cart is empty</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                style={{ maxHeight: 300 }}
                renderItem={({ item }) => (
                  <View className="bg-gray-50 rounded-xl p-3 mb-3 flex-row items-center">
                    <Image
                      source={{ uri: item.image }}
                      className="w-16 h-16 rounded-lg mr-3"
                    />
                    
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-800">
                        {item.name}
                      </Text>
                      <Text className="text-sm font-semibold text-purple-600">
                        {item.price}
                      </Text>
                    </View>

                    {/* Quantity Controls */}
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                      >
                        <Ionicons name="remove" size={16} color="black" />
                      </TouchableOpacity>
                      
                      <Text className="mx-3 text-base font-bold">{item.quantity}</Text>
                      
                      <TouchableOpacity
                        onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="bg-purple-600 w-8 h-8 rounded-full items-center justify-center"
                      >
                        <Ionicons name="add" size={16} color="white" />
                      </TouchableOpacity>
                    </View>

                    {/* Remove Button */}
                    <TouchableOpacity
                      onPress={() => onRemoveItem(item.id)}
                      className="ml-3"
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
              />

              {/* Total & Checkout */}
              <View className="mt-6 border-t border-gray-200 pt-4">
                <View className="flex-row justify-between mb-4">
                  <Text className="text-lg font-bold text-gray-800">Total:</Text>
                  <Text className="text-lg font-bold text-purple-600">${calculateTotal()}</Text>
                </View>

                <TouchableOpacity
                  onPress={onCheckout}
                  className="bg-purple-600 h-14 rounded-xl items-center justify-center"
                >
                  <Text className="text-white text-lg font-bold">Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ActionSheet>
    );
  }
);

export default OrderSheet;