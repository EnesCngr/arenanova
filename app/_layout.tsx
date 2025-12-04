import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from "expo-router";
import "./Globals.css";

export default function RootLayout() {
  return (
    
    <StripeProvider 
      publishableKey="pk_test_51SUupzAouzJdpNyvQVI49Nz7QnAOkxYs1HpVIf5qMNYU3uhytuUdANcTTeOVHzdTUWLCdzhrFDwmGUWEF0axAUn800GIAY8GFg"
     
    >
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="signup" 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="auth/authlog" 
          options={{ headerShown: false }} 
        />
        
        {/* Eğer yeni eklediğimiz sipariş sonuç sayfasını da stack'e tanıtmak istersen buraya ekleyebilirsin, 
            ama Expo Router otomatik de tanıyabilir. Garanti olsun dersen: */}
        <Stack.Screen 
          name="order-success" 
          options={{ headerShown: false, presentation: 'modal' }} 
        />
      </Stack>
    </StripeProvider>
  );
}