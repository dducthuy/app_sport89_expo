import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import "../../global.css";
import { AuthService } from '../../service/auth';

export default function User() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      Toast.show({
        type: 'success',
        text1: 'Đăng xuất thành công',
        text2: 'Bạn đã đăng xuất khỏi hệ thống.',
      });
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể đăng xuất. Vui lòng thử lại.',
      });
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#d8d3cb' }}>
      <ScrollView className="px-4 pt-4">
        {/* Header - Cài đặt */}
        <Text className="text-3xl font-bold mb-6" style={{ color: '#2b5288' }}>Cài đặt</Text>

        {/* Thông tin người dùng */}
        <View className="flex-row items-center mb-8">
          <View className="w-16 h-16 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: '#2b5288' }}>
            <Text className="text-white text-3xl font-bold">T</Text>
          </View>
          <View>
            <Text className="text-xl font-semibold" style={{ color: '#2b5288' }}>Thụy Đỗ</Text>
            <Text className="text-gray-600">dodocthuy18052000@gmail.com</Text>
          </View>
        </View>

        {/* Phần Cài đặt */}
        <Text className="text-2xl font-bold mb-4" style={{ color: '#2b5288' }}>Cài đặt</Text>
        <View className="rounded-lg shadow-sm mb-8" style={{ backgroundColor: '#ffffff' }}>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={24} color="#2b5288" />
              <Text className="ml-2 text-base" style={{ color: '#2b5288' }}>Thông tin tài khoản</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#2b5288" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Ionicons name="wallet-outline" size={24} color="#2b5288" />
              <Text className="ml-2 text-base" style={{ color: '#2b5288' }}>Ví mặc định</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#2b5288" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="language-outline" size={24} color="#2b5288" />
              <Text className="ml-2 text-base" style={{ color: '#2b5288' }}>Ngôn ngữ</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#2b5288" />
          </TouchableOpacity>
        </View>

        {/* Phần Trợ giúp */}
        <Text className="text-2xl font-bold mb-4" style={{ color: '#2b5288' }}>Trợ giúp</Text>
        <View className="rounded-lg shadow-sm mb-8" style={{ backgroundColor: '#ffffff' }}>
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={24} color="#2b5288" />
              <Text className="ml-2 text-base" style={{ color: '#2b5288' }}>Liên hệ chúng tôi</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#2b5288" />
          </TouchableOpacity>
        </View>

        {/* Nút Đăng xuất */}
        <TouchableOpacity onPress={handleLogout} className="mb-4">
          <Text className="text-red-500 text-base">Đăng xuất</Text>
        </TouchableOpacity>

        {/* Hoàn thành checklist của bạn! - Thanh tiến độ */}
        <View className="rounded-lg py-3 px-4 flex-row items-center justify-between mb-20" style={{ backgroundColor: '#2b5288' }}>
          <Text className="text-white font-semibold">Hoàn thành checklist của bạn!</Text>
          <View className="flex-row items-center">
            <Text className="text-white mr-2">20%</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="white" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}