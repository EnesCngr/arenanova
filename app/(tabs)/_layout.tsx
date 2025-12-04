import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: '#7c3aed', // Aktif renk (Mor)
        tabBarInactiveTintColor: 'gray',  // Pasif renk
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5, 
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 65, 
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      }}
    >
      {/* 1. Main Page */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={25} color={color} />
          ),
        }}
      />

      {/* 2. Events */}
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={25} color={color} />
          ),
        }}
      />

      {/* 3. MENU */}
      <Tabs.Screen
        name="MENU"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "fast-food" : "fast-food-outline"} size={25} color={color} />
          ),
        }}
      />

      {/* 4. Orders Tracking */}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "bag" : "bag-outline"} size={25} color={color} />
          ),
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={26} color={color} />
          ),
        }}
      />

      {/* Timetables Gizle */}
      <Tabs.Screen
        name="timetables"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}