import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useUserStore } from "@/store/auth";

export default function AuthRoutesLayout() {
  // const { isLoaded, isSignedIn } = useAuth();
  const { user, isAuthenticated, authToken, sessionId } = useUserStore();

  // console.log("user", JSON.stringify(user, null, 5));
  // console.log("isAuthenticated", isAuthenticated);
  // console.log("isSignedIn", authToken);
  // console.log("sessionId", sessionId);

  // if (!isLoaded) return null;

  if (isAuthenticated) return <Redirect href="/(index)/(tabs)" />;

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
                backgroundColor: "transparent",
              },
            }),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="main"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
