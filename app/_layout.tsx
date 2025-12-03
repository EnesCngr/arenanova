import { Stack } from "expo-router";
import "./Globals.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="(signup)" 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}


