import React from "react";
import * as Haptics from "expo-haptics";
import { Href, useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { BodyScrollView } from "@/components/BodyScrollView";
import { ClerkAPIError } from "@clerk/types";
import { zincColors } from "@/lib/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "@/store/auth";
import { encodeEmail } from "@/services/auth";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const fetchUser = useUserStore((state) => state.fetchUser);
  const login = useUserStore((state) => state.login);
  const [showPassword, setShowPassword] = React.useState(false);

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    if (process.env.EXPO_OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsSigningIn(true);
    setFormError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        const encodedEmail = encodeEmail(emailAddress);
        const user = await fetchUser(encodedEmail);

        if (user) {
          await setActive({ session: signInAttempt.createdSessionId });
          await login(signInAttempt.createdSessionId!!, user);
          router.replace("/(index)/(tabs)");
        } else {
          setFormError("User account not found. Please sign up first.");
          Alert.alert(
            "Account Error",
            "User account not found. Please sign up first."
          );
        }
      } else {
        console.error("SignInAttempt", JSON.stringify(signInAttempt, null, 2));
        setFormError("Sign in incomplete. Please try again.");
        Alert.alert("Sign In Error", "Sign in incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));

      let errorMessage = "Failed to sign in. Please try again.";

      if (isClerkAPIResponseError(err)) {
        const messages = err.errors.map(
          (error) => error.longMessage || error.message
        );
        errorMessage = messages.join("\n");
      }

      setFormError(errorMessage);
      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  }, [isLoaded, emailAddress, password, fetchUser, login, router, setActive]);

  const onNavigatePress = React.useCallback(
    async (path: Href) => {
      if (process.env.EXPO_OS === "ios") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push(path);
    },
    [router]
  );

  return (
    <BodyScrollView
      contentContainerStyle={{
        padding: 16,
        justifyContent: "center",
        flex: 1,
        gap: 26,
      }}
    >
      <View
        style={{
          alignItems: "center",
          marginBottom: 34,
        }}
      >
        <ThemedText type="title">Hello Again!</ThemedText>
        <ThemedText
          type="default"
          style={{
            color: zincColors["400"],
            textAlign: "center",
          }}
        >
          Welcome back, you've been missed
        </ThemedText>
      </View>

      <View>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          label="Email"
          keyboardType="email-address"
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          leftIcon={<MaterialIcons name="email" size={24} color="gray" />}
        />
        <TextInput
          value={password}
          label="Password"
          placeholder="Enter password"
          secureTextEntry={!showPassword}
          onChangeText={(password) => setPassword(password)}
          leftIcon={
            <MaterialIcons name="lock-outline" size={24} color="gray" />
          }
          rightIcon={
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={24}
              color="gray"
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        {formError ? (
          <ThemedText
            style={{
              color: "red",
              marginTop: 8,
            }}
          >
            {formError}
          </ThemedText>
        ) : null}
        <ThemedText
          onPress={() => router.push("/(auth)/reset-password")}
          type="defaultSemiBold"
          style={{
            textAlign: "right",
            marginTop: 8,
          }}
        >
          Forgot Password?
        </ThemedText>
      </View>

      <Button
        onPress={onSignInPress}
        loading={isSigningIn}
        disabled={!emailAddress || !password || isSigningIn}
        size="lg"
      >
        {isSigningIn ? "Signing in..." : "Sign in"}
      </Button>
      <View style={{ marginTop: 16, alignItems: "center" }}>
        <ThemedText>Don't have an account?</ThemedText>
        <Button onPress={() => onNavigatePress("/sign-up")} variant="ghost">
          Sign up
        </Button>
      </View>
    </BodyScrollView>
  );
}
