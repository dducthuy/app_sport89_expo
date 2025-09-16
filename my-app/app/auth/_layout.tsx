import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          title: "Đăng nhập",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Đăng ký",
          presentation: "card",
        }}
      />
    </Stack>
  );
}