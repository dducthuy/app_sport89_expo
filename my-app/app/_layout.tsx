import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import "../global.css";
import { AuthService } from "../service/auth";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  const checkAuthState = async () => {
    try {

      
      const isLoggedIn = await AuthService.checkAuthStatus();

      const inAuthGroup = segments[0] === "auth";
      const inTabsGroup = segments[0] === "(tabs)";

      if (isLoggedIn) {
        if (inAuthGroup) {
          router.replace("/(tabs)");
        }
      } else {
        if (inTabsGroup || (segments as string[]).length === 0) {
          router.replace("/auth/login");
        }
      }
    } catch (error) {
      router.replace("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FB923C" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
       
      </Stack>
      {/* thông báo */}
      <Toast />
    </>
  );
}