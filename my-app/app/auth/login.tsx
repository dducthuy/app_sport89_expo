import { IconSymbol } from "@/components/ui/IconSymbol";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from "react";


import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (): Promise<void> => {
    setEmailError("");
    setPasswordError("");
    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email không được để trống");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Email không đúng định dạng");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Mật khẩu không được để trống");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
     const response = await fetch(`http://172.20.10:4000/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, mat_khau: password }),
});

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Lỗi", data.message || "Đăng nhập thất bại");
        return;
      }

      await AsyncStorage.setItem('token', data.token);
      Alert.alert("Thành công", "Đăng nhập thành công!", [
        { text: "OK", onPress: () => router.replace('/') }
      ]);
      console.log("Token:", data.token);

    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể kết nối tới server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert("Thông báo", `Đăng nhập với ${provider}`);
  };

  const handleNavigateToRegister = () => router.push('/auth/register');
  const handleForgotPassword = () => Alert.alert("Quên mật khẩu", "Tính năng đang được phát triển");

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#e5e0d9' }}>
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-16 pb-8 items-center">
          <View className="w-24 h-24 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#2b5288' }}>
            <IconSymbol name="person.circle.fill" size={50} color="#e5e0d9" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</Text>
          <Text className="text-gray-700 text-center">Đăng nhập để tiếp tục mua sắm</Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <View className={`flex-row items-center rounded-xl px-4 py-3 ${emailError ? "border border-red-500" : "border border-gray-300"}`} style={{ backgroundColor: '#f7f5f0' }}>
              <IconSymbol name="envelope" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                placeholder="Nhập email của bạn"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {emailError && <Text className="text-red-500 text-sm mt-1">{emailError}</Text>}
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Mật khẩu</Text>
            <View className={`flex-row items-center rounded-xl px-4 py-3 ${passwordError ? "border border-red-500" : "border border-gray-300"}`} style={{ backgroundColor: '#f7f5f0' }}>
              <IconSymbol name="lock" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                <IconSymbol name={showPassword ? "eye.slash" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            {passwordError && <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="self-end mb-6" onPress={handleForgotPassword} disabled={isLoading}>
            <Text className="text-[#2b5288] font-medium">Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`rounded-xl py-4 items-center mb-6`}
            style={{ backgroundColor: '#2b5288', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="#e5e0d9" size="small" />
                <Text className="text-[#e5e0d9] font-bold text-lg ml-2">Đang đăng nhập...</Text>
              </View>
            ) : (
              <Text className="text-[#e5e0d9] font-bold text-lg">Đăng nhập</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500">Hoặc</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login */}
          <View className="space-y-3 mb-8">
            <TouchableOpacity onPress={() => handleSocialLogin("Google")} disabled={isLoading} className={`flex-row items-center justify-center bg-white border border-gray-300 rounded-xl py-3 ${isLoading ? "opacity-70" : ""}`}>
              <Text className="text-2xl mr-3">🔍</Text>
              <Text className="text-gray-700 font-medium">Tiếp tục với Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSocialLogin("Facebook")} disabled={isLoading} className={`flex-row items-center justify-center bg-[#2b5288] rounded-xl py-3 ${isLoading ? "opacity-70" : ""}`}>
              <Text className="text-2xl mr-3">📘</Text>
              <Text className="text-[#e5e0d9] font-medium">Tiếp tục với Facebook</Text>
            </TouchableOpacity>

            {Platform.OS === "ios" && (
              <TouchableOpacity onPress={() => handleSocialLogin("Apple")} disabled={isLoading} className={`flex-row items-center justify-center bg-black rounded-xl py-3 ${isLoading ? "opacity-70" : ""}`}>
                <IconSymbol name="apple.logo" size={20} color="white" />
                <Text className="text-white font-medium ml-3">Tiếp tục với Apple</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Footer */}
        <View className="pb-8">
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={handleNavigateToRegister} disabled={isLoading}>
              <Text className="text-[#2b5288] font-medium">Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
