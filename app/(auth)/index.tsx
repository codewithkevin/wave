import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
  PanResponder,
} from "react-native";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");

// Sample onboarding data
const onboardingData = [
  {
    id: "1",
    title: "Hand CLASH",
    subtitle: "Events",
    description:
      "Master rock, paper and scissors. Predict moves and winning strategies!",
    image: require("../.././assets/images/_mock/cover11.jpeg"),
    ctaText: "CONTINUE",
  },
  {
    id: "2",
    title: "Hand CLASH",
    subtitle: "E-VOTING",
    description:
      "Collect unique characters with special abilities to dominate the game.",
    image: require("../.././assets/images/_mock/cover14.jpeg"),
    ctaText: "CONTINUE",
  },
  {
    id: "3",
    title: "Hand CLASH",
    subtitle: "COMMUNITY",
    description:
      "Challenge players worldwide and climb the global leaderboard.",
    image: require("../.././assets/images/_mock/cover15.jpeg"),
    ctaText: "GET STARTED",
  },
];

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const swipeAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Only allow right to left swipe
        if (gestureState.dx < 0) {
          swipeAnim.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50 && currentIndex < onboardingData.length - 1) {
          // Swipe completed - move to next card
          Animated.timing(swipeAnim, {
            toValue: { x: -width, y: 0 },
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            swipeAnim.setValue({ x: 0, y: 0 });
            handleNext();
          });
        } else {
          // Return to original position
          Animated.spring(swipeAnim, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(currentIndex + 1);
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Handle onboarding completion
      console.log("Onboarding completed!");
      // You would typically navigate to the main app here
    }
  };

  return (
    <View style={styles.container}>
      {/* Background with blur effect using current card image */}
      <ImageBackground
        source={onboardingData[currentIndex].image}
        style={styles.backgroundImage}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />

        {/* Main content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: swipeAnim.x }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              gap: wp(10),
            }}
          >
            <View>
              <Image
                source={onboardingData[currentIndex].image}
                style={{
                  width: wp(80),
                  height: wp(120),
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />

              {/* <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>
                  {onboardingData[currentIndex].subtitle}
                </Text>
              </View> */}
            </View>

            <View
              style={{
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* Description below card */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  {onboardingData[currentIndex].description}
                </Text>
              </View>

              {/* CTA Button */}
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>
                  {onboardingData[currentIndex].ctaText}
                </Text>
              </TouchableOpacity>

              <View style={styles.indicatorContainer}>
                {onboardingData.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentIndex && styles.activeIndicator,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </ImageBackground>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  coinText: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: 5,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameButtonContainer: {
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  gameButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  gameButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "500",
  },
  card: {
    width: "100%",
    height: height * 0.5,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginVertical: 20,
    position: "relative",
  },
  cardImage: {
    width: wp(50),
    height: wp(50),
  },
  cardTitleContainer: {
    position: "absolute",
    bottom: wp(-5),
    width: "100%",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: wp(10),
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    maxWidth: wp(70),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    lineHeight: wp(11),
  },
  descriptionContainer: {
    width: "100%",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  button: {
    backgroundColor: "#FFDE59",
    paddingVertical: wp(5),
    paddingHorizontal: wp(25),
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#fff",
    width: 20,
  },
});

export default OnboardingScreen;
