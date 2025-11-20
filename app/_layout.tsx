
import { Stack } from "expo-router";
import './Globals.css';


export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
