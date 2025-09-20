import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native"; // Import Text

// Custom middle button
function CustomTabBarButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      style={{
        top: -25,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 75,
          height: 75,
          borderRadius: 37.5,
          backgroundColor: "#2b5288",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2b5288",
        tabBarInactiveTintColor: "#A8A29E",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: "#e5e0d9",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="thongbao"
        options={{
          title: "Thông báo",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={24}
              name="building.columns"
              color={focused ? "#2b5288" : color}
            />
          ),
          // Fix: Wrap the title in a Text component
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ 
              fontSize: 12, 
              fontWeight: "600", 
              color: focused ? "#2b5288" : color 
            }}>
              Thông báo
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: () => (
            <IconSymbol size={28} name="paperplane.fill" color="#e5e0d9" />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          // Fix: Wrap the title in a Text component
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ 
              fontSize: 12, 
              fontWeight: "600", 
              color: focused ? "#2b5288" : color 
            }}>
              Trang chủ
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="caidat"
        options={{
          title: "Cài đặt",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={24}
              name="gearshape"
              color={focused ? "#2b5288" : color}
            />
          ),
          // Fix: Wrap the title in a Text component
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ 
              fontSize: 12, 
              fontWeight: "600", 
              color: focused ? "#2b5288" : color 
            }}>
              Cài đặt
            </Text>
          ),
        }}
      />
        <Tabs.Screen
        name="product"
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}