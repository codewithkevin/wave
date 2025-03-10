import * as React from "react";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { BodyScrollView } from "@/components/BodyScrollView";
import TextInput from "@/components/ui/text-input";
import Button from "@/components/ui/button";
import {
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Alert, Image, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { validateFormHandler } from "../../helpers/index";
import { useWarmUpBrowser } from "@/hooks/auth/useWarmUpBrowser";
import { primaryColor, zincColors } from "@/lib/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "@/store/auth";
import { RoleEnum } from "@/types/user.types";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  useWarmUpBrowser();
  const createUser = useUserStore((state) => state.createUser);
  const login = useUserStore((state) => state.login);

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailAddress || !emailRegex.test(emailAddress)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!validateForm()) {
      if (process.env.EXPO_OS === "ios") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    if (process.env.EXPO_OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLoading(true);
    setFormError("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));

      let errorMessage = "Registration failed. Please try again.";

      if (isClerkAPIResponseError(err)) {
        const messages = err.errors.map(
          (error) => error.longMessage || error.message
        );
        errorMessage = messages.join("\n");
      }

      setFormError(errorMessage);
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    if (process.env.EXPO_OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLoading(true);
    setFormError("");

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        console.log("SignUpAttempt ", signUpAttempt.createdSessionId);

        try {
          const userData = {
            email: emailAddress,
            role: RoleEnum.USER,
          };

          const newUser = await createUser(userData);

          if (newUser) {
            login(signUpAttempt.createdSessionId!!, newUser);
            Alert.alert("WELCOME TO Wave");
            router.replace("/");
          } else {
            setFormError("Failed to create user account.");
            Alert.alert(
              "Account Verification Failed",
              "Failed to create your account."
            );
          }
        } catch (error) {
          console.error("Failed to save user to Firebase:", error);
          setFormError(
            "Your account was verified, but we couldn't save your profile."
          );
          Alert.alert(
            "Account Verification Success",
            "Your account was verified, but we couldn't save your profile. Please try logging in again."
          );
        }
      } else {
        console.error(
          "Failed to SignUp",
          JSON.stringify(signUpAttempt, null, 2)
        );
        setFormError("Verification failed. Please try again.");
        Alert.alert(
          "Verification Failed",
          "Please check your verification code and try again."
        );
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));

      let errorMessage = "Verification failed. Please try again.";

      if (isClerkAPIResponseError(err)) {
        const messages = err.errors.map(
          (error) => error.longMessage || error.message
        );
        errorMessage = messages.join("\n");
      }

      setFormError(errorMessage);
      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Stack.Screen
          options={{ title: "Verify Account", headerLargeTitle: false }}
        />
        <BodyScrollView
          contentContainerStyle={{
            padding: 16,
            justifyContent: "center",
            gap: widthPercentageToDP(10),
          }}
        >
          <View style={{ alignItems: "center", gap: wp(8) }}>
            <Image
              source={require("../../assets/images/_mock/illustration-4.png")}
            />
            <ThemedText type="title">Verification Code</ThemedText>
            <ThemedText
              type="default"
              style={{
                color: zincColors[500],
              }}
            >
              We sent a verification code to {emailAddress}.
            </ThemedText>
          </View>
          <TextInput
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
          />
          {formError ? (
            <ThemedText
              style={{
                color: "red",
              }}
            >
              {formError}
            </ThemedText>
          ) : null}
          <Button
            onPress={onVerifyPress}
            disabled={!code || isLoading}
            loading={isLoading}
            size="lg"
            style={{
              backgroundColor: primaryColor,
            }}
          >
            <ThemedText>Verify</ThemedText>
          </Button>
        </BodyScrollView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Create an account" }} />
      <BodyScrollView
        style={{
          padding: 16,
        }}
      >
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          keyboardType="email-address"
          leftIcon={<MaterialIcons name="email" size={24} color="gray" />}
          onChangeText={(email) => {
            setEmailAddress(email);
            setValidationErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={validationErrors.email}
        />

        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={!showPassword}
          onChangeText={(password) => {
            setPassword(password);
            setValidationErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={validationErrors.password}
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

        <TextInput
          value={confirmPassword}
          placeholder="Confirm password"
          secureTextEntry={!showConfirmPassword}
          onChangeText={(confirmedPassword) => {
            setConfirmPassword(confirmedPassword);
            setValidationErrors((prev) => ({
              ...prev,
              confirmPassword: undefined,
            }));
          }}
          error={validationErrors.confirmPassword}
          leftIcon={
            <MaterialIcons name="lock-outline" size={24} color="gray" />
          }
          rightIcon={
            <MaterialIcons
              name={showConfirmPassword ? "visibility-off" : "visibility"}
              size={24}
              color="gray"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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

        <Button
          onPress={onSignUpPress}
          disabled={!emailAddress || !password || !confirmPassword || isLoading}
          loading={isLoading}
          size="lg"
          style={{
            marginTop: wp(10),
            backgroundColor: primaryColor,
          }}
        >
          <ThemedText>Continue</ThemedText>
        </Button>
      </BodyScrollView>
    </>
  );
}
