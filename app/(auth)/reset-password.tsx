import * as React from "react";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { BodyScrollView } from "@/components/BodyScrollView";
import { useUserStore } from "@/store/auth";
import { encodeEmail } from "@/services/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert } from "react-native";

export default function ResetPassword() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [showPassword, setShowPassword] = React.useState(false);

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const login = useUserStore((state) => state.login);

  const onResetPasswordPress = React.useCallback(async () => {
    if (!isLoaded) return;
    setErrors([]);
    setIsLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });

      setPendingVerification(true);
      setIsLoading(false);
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, emailAddress, signIn]);

  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (signInAttempt.status === "complete") {
        const encodedEmail = encodeEmail(emailAddress);
        const user = await fetchUser(encodedEmail);

        if (user) {
          await setActive({ session: signInAttempt.createdSessionId });
          await login(signInAttempt.createdSessionId!!, user);
          Alert.alert("Password Reset Successfully");
          router.replace("/(index)/(tabs)");
        }
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }

      setIsLoading(false);
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, code, password, signIn, setActive, router, fetchUser]);

  if (pendingVerification) {
    return (
      <BodyScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          value={code}
          label={`Enter the verification code we sent to ${emailAddress}`}
          placeholder="Enter your verification code"
          onChangeText={setCode}
        />
        <TextInput
          value={password}
          label="Enter your new password"
          placeholder="Enter your new password"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
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
        {errors.map((error) => (
          <ThemedText key={error.longMessage} style={{ color: "red" }}>
            {error.longMessage}
          </ThemedText>
        ))}
        <Button onPress={onVerifyPress} disabled={!code || !password}>
          {isLoading ? "Loading..." : "Reset password"}
        </Button>
      </BodyScrollView>
    );
  }

  return (
    <BodyScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        keyboardType="email-address"
        onChangeText={setEmailAddress}
      />
      <Button onPress={onResetPasswordPress} disabled={!emailAddress}>
        {isLoading ? "Loading..." : "Continue"}
      </Button>
      {errors.map((error) => (
        <ThemedText key={error.longMessage} style={{ color: "red" }}>
          {error.longMessage}
        </ThemedText>
      ))}
    </BodyScrollView>
  );
}
