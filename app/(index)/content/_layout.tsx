import { Stack } from "expo-router";
import React from "react";

export default function ContentLayout() {
  return (
    <Stack
      screenOptions={{
        ...(process.env.EXPO_OS !== "ios"
          ? {}
          : {
              headerLargeTitle: true,
              headerTransparent: true,
              headerBlurEffect: "systemChromeMaterial",
              headerLargeTitleShadowVisible: false,
              headerShadowVisible: true,
              headerLargeStyle: {
                // NEW: Make the large title transparent to match the background.
                backgroundColor: "transparent",
              },
            }),
      }}
    >
      <Stack.Screen
        name="events-details"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ticket-details"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
