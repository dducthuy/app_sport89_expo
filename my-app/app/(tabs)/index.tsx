import {
  Bell,
  Filter,
  Heart,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

// ---- TYPE ----
type Product = {
  id: string;
  ten_san_pham: string;
  gia_ban: string;
  gia_khuyen_mai?: string;
  so_luot_danh_gia: number;
  trung_binh_sao: number;
  isLiked?: boolean;
  danh_muc: { ten_danh_muc: string };
  thuong_hieu: { ten_thuong_hieu: string };
  anh_sp: { id: string; url: string }[];
};

export default function FashionAppHome() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>(
    {}
  );
  const [categories, setCategories] = useState<string[]>([]);

  // ---- FETCH PRODUCTS ----
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://172.20.10.6:4000/api/san-pham/getall`);
      const data: Product[] = await res.json();

      setProducts(data);

      const uniqueCats: string[] = Array.from(
        new Set(data.map((p) => p.danh_muc.ten_danh_muc))
      );
      setCategories(uniqueCats);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  // ---- LIKE ----
  const toggleLike = (productId: string) => {
    setLikedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // ---- PRODUCT CARD ----
  const renderProductCard = (item: Product) => {
    // fallback ảnh
    const imageUri =
      item.anh_sp && item.anh_sp.length > 0
        ? `http://172.20.10.6:4000${item.anh_sp[0].url}`
        : "https://via.placeholder.com/150";

    return (
      <View
        key={item.id}
        className="w-[48%] m-1 bg-white p-2 rounded-lg shadow-sm"
      >
        <Image
          source={{ uri: imageUri }}
          className="w-full h-40 rounded-lg"
        />
        <TouchableOpacity
          className="absolute top-2 right-2 p-1"
          onPress={() => toggleLike(item.id)}
        >
          <Heart
            size={22}
            fill={likedProducts[item.id] ? "#EF4444" : "white"}
            color={likedProducts[item.id] ? "#EF4444" : "gray"}
          />
        </TouchableOpacity>

        <Text className="font-semibold mt-2 text-sm">{item.ten_san_pham}</Text>
        <Text className="text-red-500 font-bold">
          {item.gia_khuyen_mai ? item.gia_khuyen_mai : item.gia_ban}đ
        </Text>
        {item.gia_khuyen_mai && (
          <Text className="text-gray-500 text-xs line-through">
            {item.gia_ban}đ
          </Text>
        )}
        <View className="flex-row items-center mt-1">
          <Star size={14} fill="#D9B382" color="#D9B382" />
          <Text className="text-gray-700 ml-1 text-xs">
            {item.trung_binh_sao || 0}
          </Text>
        </View>
      </View>
    );
  };

  // ---- UI ----
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4 pt-12">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-bold text-[#2b5288]">post</Text>
          <View className="flex-row gap-x-4">
            <Bell size={24} color="black" />
            <ShoppingBag size={24} color="black" />
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-[#e5e0d9] rounded-lg p-2 mb-4">
          <Search size={20} color="gray" className="mx-2" />
          <TextInput
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 text-base"
          />
          <Filter size={20} color="gray" className="mx-2" />
        </View>

        {/* Banner */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=300&fit=crop",
          }}
          className="w-full h-40 rounded-lg mb-4"
        />
      </View>

      {/* Sản phẩm nổi bật */}
      <View className="px-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold">Sản phẩm nổi bật</Text>
          <TouchableOpacity onPress={() => router.push("/product/sanpham")}>
            <Text className="text-[#2b5288] font-semibold">Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap">
          {products
            .filter((item) => item.trung_binh_sao >= 4)
            .slice(0, 4)
            .map((item) => renderProductCard(item))}
        </View>
      </View>

      {/* Các khối danh mục */}
      {categories.map((cat) => {
        const catProducts = products.filter(
          (p) => p.danh_muc.ten_danh_muc === cat
        );
        if (catProducts.length === 0) return null;

        return (
          <View key={cat} className="px-4 mt-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-semibold">{cat}</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/product/sanpham",
                    params: { category: cat },
                  })
                }
              >
                <Text className="text-[#2b5288] font-semibold">
                  Xem tất cả
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap">
              {catProducts.slice(0, 4).map((item) => renderProductCard(item))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
