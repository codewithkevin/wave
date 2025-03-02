import { Stack } from "expo-router";
import React from "react";

export default function ContentLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="content" options={{ headerShown: false }} />
    </Stack>
  );
}
