// app/product/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ProductLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false, // ẩn header mặc định, nếu bạn cần thì đổi true
          contentStyle: { backgroundColor: "#fff" }, // nền trắng
        }}
      />
    </SafeAreaProvider>
  );
}
