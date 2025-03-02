import { Tabs, usePathname } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { primaryColor } from "@/lib/Colors";
import { FontAwesome, Fontisto, MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const pathname = usePathname();
  const [shouldHideTabBar, setShouldHideTabBar] = React.useState(false);

  React.useEffect(() => {
    setShouldHideTabBar(pathname === "/explore");
    console.log("Current pathname:", pathname);
  }, [pathname]);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
          display: shouldHideTabBar ? "none" : "flex",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="wpexplorer" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite-event"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: "Tickets",
          tabBarIcon: ({ color }) => (
            <Fontisto name="plane-ticket" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
