import { Stack } from "expo-router";
import './Globals.css';


export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tab)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
