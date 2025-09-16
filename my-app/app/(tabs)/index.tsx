import {
  Bell,
  Filter,
  Heart,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";

import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  discount: string;
  isLiked: boolean;
};

export default function FashionAppHome() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>(
    {}
  );

  const categories = [
    { id: "1", name: "All", icon: "👕" },
    { id: "2", name: "Áo thun", icon: "👔" },
    { id: "3", name: "Quần jean", icon: "👖" },
    { id: "4", name: "Váy đầm", icon: "👗" },
    { id: "5", name: "Giày dép", icon: "👟" },
    { id: "6", name: "Phụ kiện", icon: "👜" },
  ];

  const featuredProducts: Product[] = [
    {
      id: "1",
      name: "Áo thun nam basic",
      price: "299.000đ",
      originalPrice: "399.000đ",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      rating: 4.5,
      discount: "25%",
      isLiked: false,
    },
    {
      id: "2",
      name: "Váy maxi nữ",
      price: "799.000đ",
      originalPrice: "999.000đ",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop",
      rating: 4.8,
      discount: "20%",
      isLiked: true,
    },
    {
      id: "3",
      name: "Quần jean slim fit",
      price: "599.000đ",
      originalPrice: "749.000đ",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
      rating: 4.3,
      discount: "20%",
      isLiked: false,
    },
    {
      id: "4",
      name: "Áo hoodie unisex",
      price: "899.000đ",
      originalPrice: "1.199.000đ",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
      rating: 4.7,
      discount: "25%",
      isLiked: false,
    },
  ];

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Moji</Text>
        <View style={styles.headerIcons}>
          <Bell size={24} color="black" style={styles.icon} />
          <ShoppingBag size={24} color="black" />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Search size={20} color="gray" style={{ marginHorizontal: 8 }} />
        <TextInput
          placeholder="Tìm kiếm sản phẩm..."
          style={styles.input}
        />
        <Filter size={20} color="gray" style={{ marginHorizontal: 8 }} />
      </View>

      {/* Banner */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=300&fit=crop",
        }}
        style={styles.banner}
      />

      {/* Categories */}
      <View>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.category,
                activeCategory === item.name && styles.categoryActive,
              ]}
              onPress={() => setActiveCategory(item.name)}
            >
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false} // ✅ disable scroll riêng
        />
      </View>

      {/* Featured Products */}
      <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
      <FlatList
        data={featuredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImg} />
            <TouchableOpacity
              style={styles.likeBtn}
              onPress={() => toggleLike(item.id)}
            >
              <Heart
                size={20}
                fill={likedProducts[item.id] ? "red" : "white"}
                color={likedProducts[item.id] ? "red" : "gray"}
              />
            </TouchableOpacity>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            <Text style={styles.productOldPrice}>{item.originalPrice}</Text>
            <View style={styles.ratingRow}>
              <Star size={14} fill="gold" color="gold" />
              <Text>{item.rating}</Text>
            </View>
          </View>
        )}
        scrollEnabled={false} // ✅ fix conflict
      />

      {/* Special Offers */}
      <Text style={styles.sectionTitle}>Ưu đãi đặc biệt</Text>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=800&h=200&fit=crop",
        }}
        style={styles.offer}
      />

      {/* Newsletter */}
      <Text style={styles.sectionTitle}>Đăng ký nhận tin</Text>
      <View style={styles.newsletterBox}>
        <TextInput placeholder="Nhập email của bạn" style={styles.newsletterInput} />
        <TouchableOpacity style={styles.newsletterBtn}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16 ,paddingTop:50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: { fontSize: 28, fontWeight: "bold", color: "#6366F1" },
  headerIcons: { flexDirection: "row" },
  icon: { marginLeft: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginBottom: 16,
  },
  input: { flex: 1, paddingVertical: 8 },
  banner: { width: "100%", height: 160, borderRadius: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  category: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginRight: 8,
  },
  categoryActive: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  productCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    margin: 6,
    padding: 8,
    elevation: 2,
  },
  productImg: { width: "100%", height: 120, borderRadius: 12 },
  likeBtn: { position: "absolute", top: 12, right: 12 },
  productName: { fontWeight: "600", marginTop: 8 },
  productPrice: { color: "#EF4444", fontWeight: "bold" },
  productOldPrice: {
    color: "gray",
    textDecorationLine: "line-through",
    fontSize: 12,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  offer: { width: "100%", height: 120, borderRadius: 12, marginBottom: 16 },
  newsletterBox: { flexDirection: "row", marginBottom: 30 },
  newsletterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
  },
  newsletterBtn: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
