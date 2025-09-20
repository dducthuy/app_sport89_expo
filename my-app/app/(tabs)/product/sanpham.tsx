import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const itemWidth = (width - 48) / 2; // trừ padding, margin => 2 item/row

export default function SanPham() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // data giả lập
  const categories = ["Tất cả", "Xe địa hình", "Xe đua", "Xe gấp", "Xe điện"];
  const products = [
    { id: 1, name: "Jeep MTB 26", img: "https://via.placeholder.com/300x200" },
    { id: 2, name: "Jeep Road 700C", img: "https://via.placeholder.com/300x200" },
    { id: 3, name: "Jeep Folding 20", img: "https://via.placeholder.com/300x200" },
    { id: 4, name: "Jeep Electric 27", img: "https://via.placeholder.com/300x200" },
    { id: 5, name: "Jeep City Bike", img: "https://via.placeholder.com/300x200" },
  ];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-3">
        {/* ô tìm kiếm */}
        <TextInput
          placeholder="Tìm kiếm sản phẩm..."
          value={q}
          onChangeText={setQ}
          className="bg-white p-3 rounded-lg mb-3"
        />

        {/* khối trượt danh mục */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((c, i) => (
            <TouchableOpacity
              key={i}
              className="bg-white px-4 py-2 rounded-full mr-2 border border-gray-300"
            >
              <Text>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* danh sách sản phẩm (2 cột) */}
      <FlatList
        data={filtered.slice(0, page * 4)} // mỗi lần tải thêm 4 sản phẩm
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <View
            className="bg-white rounded-xl mb-4 overflow-hidden shadow"
            style={{ width: itemWidth }}
          >
            <Image source={{ uri: item.img }} className="w-full h-32" />
            <View className="p-2">
              <Text className="font-bold text-sm">{item.name}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            onPress={() => setPage((p) => p + 1)}
            className="bg-gray-800 p-3 m-4 rounded-lg items-center"
          >
            <Text className="text-white">Xem thêm</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
