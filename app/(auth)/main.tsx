import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StyleSheet,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";

const images = [
  require("../../assets/images/_mock/main.avif"),
  require("../../assets/images/_mock/cover0.jpeg"),
  require("../../assets/images/_mock/cover13.jpeg"),
];
export default function MainScreen() {
  const [selectedImage, setSelectedImage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={images[selectedImage]}
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View
          style={{
            bottom: wp(40),
            padding: wp(6),
            gap: wp(4),
            position: "absolute",
          }}
        >
          <View
            style={{
              gap: 7,
            }}
          >
            <ThemedText lightColor="white" type="extremeTitle">
              Let's Get
            </ThemedText>
            <ThemedText lightColor="white" type="title">
              Started
            </ThemedText>
          </View>

          <View style={{ gap: wp(1) }}>
            <ThemedText lightColor="white" type="subtitle">
              Welcome to WAVE
            </ThemedText>
            <ThemedText lightColor="white" type="defaultSemiBold">
              solution for all your event cravings!
            </ThemedText>
          </View>

          <Pressable
            onPress={() => {
              router.push("/(auth)/sign-up");
            }}
            style={styles.button}
          >
            <ThemedText lightColor="white" style={styles.buttonText}>
              Join Now
            </ThemedText>
          </Pressable>

          <View style={styles.loginContainer}>
            <ThemedText
              lightColor="white"
              style={styles.loginText}
              type="subtitle"
            >
              Already have an account?
            </ThemedText>
            <Pressable
              onPress={() => {
                router.push("/(auth)/login");
              }}
            >
              <ThemedText
                lightColor="white"
                style={[styles.loginText, styles.boldText]}
              >
                Login
              </ThemedText>
            </Pressable>
          </View>

          {/* <Pressable onPress={() => router.push("/(tabs)")}>
            <ThemedText type="link" style={styles.loginText}>
              Continue with account
            </ThemedText>
          </Pressable> */}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: wp("10%"),
    alignItems: "center",
  },
  title: {
    fontSize: wp("8%"),
    fontWeight: "800",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  descriptionContainer: {
    marginBottom: hp("3%"),
    alignItems: "center",
  },
  description: {
    fontSize: wp("4%"),
    textAlign: "center",
  },
  button: {
    paddingVertical: wp("3%"),
    paddingHorizontal: wp("5%"),
    backgroundColor: "white",
    borderRadius: wp("5%"),
    marginBottom: hp("2%"),
  },
  buttonText: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    fontSize: wp("4"),
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
    marginLeft: wp("1%"),
  },
});
