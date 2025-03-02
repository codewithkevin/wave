import { Link, Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  useColorScheme,
  Image,
  ImageSourcePropType,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  SlideOutLeft,
  SlideInRight,
  Layout,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { ThemedView } from "@/components/ThemedView";
import { primaryColor } from "@/lib/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

// Define interface for onboarding step
interface OnboardingStep {
  icon: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

const onboardingSteps: OnboardingStep[] = [
  {
    icon: "snowflake",
    title: "Welcome JOOEVENTS",
    description: "Daily Events",
    image: require("../../assets/images/_mock/illustration-2.png"),
  },
  {
    icon: "people-arrows",
    title: "Create and monitor events",
    description: "Party, connect with amazing people",
    image: require("../../assets/images/_mock/illustration.png"),
  },
  {
    icon: "book-reader",
    title: "Buy Event Tickets",
    description: "No hustle for event hunt",
    image: require("../../assets/images/_mock/illustration-3.png"),
  },
];

let colorScheme;

export default function OnboardingScreen() {
  colorScheme = useColorScheme();
  const [screenIndex, setScreenIndex] = useState(0);
  const data = onboardingSteps[screenIndex];

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const endOnboarding = () => {
    setScreenIndex(0);
    router.replace("/(auth)/main");
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack)
  );

  return (
    <SafeAreaView
      style={[
        styles.page,
        {
          backgroundColor: colorScheme === "dark" ? "#1A1D23" : "#FDFDFD",
        },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <View style={styles.stepIndicatorContainer}>
        {onboardingSteps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              {
                backgroundColor: index === screenIndex ? primaryColor : "grey",
              },
            ]}
          />
        ))}
      </View>
      <GestureDetector gesture={swipes}>
        <View style={styles.pageContent}>
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut}
            layout={Layout.springify()}
          >
            <Image
              style={styles.image}
              source={data.image}
              resizeMode="contain"
            />
          </Animated.View>
          <Animated.View
            style={styles.footer}
            layout={Layout.springify()}
            entering={FadeIn.duration(500).delay(100)}
          >
            <Animated.Text
              entering={SlideInRight.duration(500).delay(200)}
              exiting={SlideOutLeft}
              style={[
                styles.title,
                {
                  color: colorScheme === "dark" ? "#FDFDFD" : "#15141A",
                },
              ]}
            >
              {data.title}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight.duration(500).delay(300)}
              exiting={SlideOutLeft}
              style={styles.description}
            >
              {data.description}
            </Animated.Text>
            <View style={styles.buttonsRow}>
              <Text
                onPress={endOnboarding}
                style={[
                  styles.buttonText,
                  {
                    color: colorScheme === "dark" ? "#FDFDFD" : "#15141A",
                  },
                ]}
              >
                Skip
              </Text>
              <Pressable
                onPress={onContinue}
                style={[
                  styles.button,
                  {
                    backgroundColor: primaryColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: "#fff",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Continue
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    flex: 1,
  },
  pageContent: {
    padding: wp(5),
    flex: 1,
  },
  image: {
    alignSelf: "center",
    marginTop: wp(20),
    width: wp(70),
    height: wp(70),
  },
  title: {
    fontSize: wp(10),
    fontFamily: "InterBlack",
    letterSpacing: 1.3,
    marginVertical: wp(4),
  },
  description: {
    color: "gray",
    fontSize: wp(5),
    fontFamily: "Inter",
    lineHeight: wp(5),
  },
  footer: {
    marginTop: "auto",
  },
  buttonsRow: {
    marginTop: wp(4),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
  },
  button: {
    borderRadius: 50,
    alignItems: "center",
    padding: wp(5),
    flex: 1,
  },
  buttonText: {
    color: colorScheme === "dark" ? "#FDFDFD" : "#15141A",
    fontFamily: "InterSemi",
    fontSize: wp(4),
    paddingHorizontal: wp(5),
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: wp(4),
  },
  stepIndicator: {
    flex: 1,
    height: 3,
    backgroundColor: "gray",
    borderRadius: wp(3),
  },
});
