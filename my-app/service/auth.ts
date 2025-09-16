import AsyncStorage from "@react-native-async-storage/async-storage";
import request from "../utils/request";

export const AuthService = {
  // Đăng nhập
  login: async (taiKhoan: string, matKhau: string) => {
    try {
      const response = await request.post("auth/login", {
        identifier: taiKhoan,
        matKhau,
      });

      console.log("API Response:", response.data);

      // Lưu token & user vào AsyncStorage - Sửa từ token thành accessToken
      if (response.data?.accessToken) {
        await AsyncStorage.setItem("token", response.data.accessToken);
        if (response.data?.user) {
          await AsyncStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }
      }

  
      return {
        success: true,
        data: {
          ...response.data,
          token: response.data.accessToken, 
        },
      };
    } catch (error: any) {
      console.error("Login API Error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng nhập thất bại!",
      };
    }
  },

  // Kiểm tra trạng thái đăng nhập
  checkAuthStatus: async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("Token check:", !!token); // Debug log
    return !!token;
  },

  // Đăng xuất
  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    return { success: true };
  },

  // Làm mới token
  refreshToken: async () => {
    try {
      const response = await request.post("auth/refresh-token");
      if (response.data?.accessToken) {
        await AsyncStorage.setItem("token", response.data.accessToken);
      }
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Làm mới token thất bại!",
      };
    }
  },
};