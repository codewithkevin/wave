import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

// Define the data structure
interface OnboardingItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: any;
  ctaText: string;
}

// Sample onboarding data
const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Hand CLASH",
    subtitle: "Event Discovery & Booking",
    description:
      "Discover exciting events near you and secure your spot with just a few taps. Browse by category, location, or trending events, and enjoy a seamless ticket booking experience.",
    image: require("../.././assets/images/_mock/cover11.jpeg"),
    ctaText: "CONTINUE",
  },
  {
    id: "2",
    title: "Hand CLASH",
    subtitle: "Hassle-Free Event Management",
    description:
      "Effortlessly create, manage, and track your events. From ticket sales to attendee check-ins, our all-in-one platform ensures smooth event execution with powerful tools at your fingertips.",
    image: require("../.././assets/images/_mock/cover14.jpeg"),
    ctaText: "CONTINUE",
  },
  {
    id: "3",
    title: "Hand CLASH",
    subtitle: "Social & Community Engagement",
    description:
      "Connect with attendees, share event updates, and build a vibrant community. Engage with posts, discussions, and exclusive content, making every event a shared experience.",
    image: require("../.././assets/images/_mock/cover15.jpeg"),
    ctaText: "GET STARTED",
  },
];

const CARD_WIDTH = wp(90);
const CARD_HEIGHT = wp(120);
const SPACING = wp(5);

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<OnboardingItem> | null>(null);

  // Add empty items at beginning and end to show partial cards
  const extendedData: OnboardingItem[] = [
    { ...onboardingData[onboardingData.length - 1], id: "start" },
    ...onboardingData,
    { ...onboardingData[0], id: "end" },
  ];

  useEffect(() => {
    // Initialize scroll position to show the first real item
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
    }, 100);
  }, []);

  const handleNext = () => {
    if (currentIndex < onboardingData.length) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push("/main");
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: OnboardingItem;
    index: number;
  }) => {
    // Calculate card size and opacity based on position
    const inputRange = [
      (index - 2) * (CARD_WIDTH + SPACING * 2),
      (index - 1) * (CARD_WIDTH + SPACING * 2),
      index * (CARD_WIDTH + SPACING * 2),
    ];

    // Reversed logic: active card is at full scale (1) and inactive cards are smaller (0.8)
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    // Reversed logic: active card is fully opaque (1) and inactive cards are dimmed (0.6)
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    // Additional shadow for active card
    const shadowOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.1, 0.5, 0.1],
      extrapolate: "clamp",
    });

    // Additional elevation for active card
    const elevation = scrollX.interpolate({
      inputRange,
      outputRange: [2, 8, 2],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }],
            opacity,
            shadowOpacity,
            // @ts-ignore - elevation is a valid style prop for Android
            elevation,
          },
        ]}
      >
        <Image
          source={item.image}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </Animated.View>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: CARD_WIDTH + SPACING * 2,
    offset: (CARD_WIDTH + SPACING * 2) * index,
    index,
  });

  // Handle scroll events to update current index
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / (CARD_WIDTH + SPACING * 2));

        // Adjust for the extended data array (starting from index 1)
        const adjustedIndex = newIndex - 1;

        if (
          adjustedIndex >= 0 &&
          adjustedIndex < onboardingData.length &&
          adjustedIndex !== currentIndex - 1
        ) {
          setCurrentIndex(adjustedIndex + 1);
        }
      },
    }
  );

  // Handle momentum end to snap to the nearest card
  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (CARD_WIDTH + SPACING * 2));

    // Prevent going out of bounds
    if (newIndex <= 0) {
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: true,
      });
    } else if (newIndex >= extendedData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: extendedData.length - 2,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Background with blur effect using current card image */}
      <ImageBackground
        source={
          onboardingData[Math.min(currentIndex - 1, onboardingData.length - 1)]
            .image
        }
        style={styles.backgroundImage}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />

        {/* Main content */}
        <View style={styles.contentContainer}>
          {/* Carousel of cards */}
          <View style={styles.carouselContainer}>
            <Animated.FlatList
              ref={flatListRef}
              data={extendedData}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContent}
              snapToInterval={CARD_WIDTH + SPACING * 2}
              decelerationRate="fast"
              bounces={false}
              onScroll={handleScroll}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              scrollEventThrottle={16}
              getItemLayout={getItemLayout}
              pagingEnabled={false}
              // Remove initialScrollIndex - we'll handle initial scroll with setTimeout
            />
          </View>

          {/* Content below the carousel */}
          <View style={styles.bottomContentContainer}>
            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.subtitle}>
                {
                  onboardingData[
                    Math.min(currentIndex - 1, onboardingData.length - 1)
                  ].subtitle
                }
              </Text>
              <Text style={styles.description}>
                {
                  onboardingData[
                    Math.min(currentIndex - 1, onboardingData.length - 1)
                  ].description
                }
              </Text>
            </View>

            {/* CTA Button */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>
                {
                  onboardingData[
                    Math.min(currentIndex - 1, onboardingData.length - 1)
                  ].ctaText
                }
              </Text>
            </TouchableOpacity>

            {/* Indicators */}
            <View style={styles.indicatorContainer}>
              {onboardingData.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentIndex - 1 && styles.activeIndicator,
                  ]}
                  onPress={() => {
                    flatListRef.current?.scrollToIndex({
                      index: index + 1,
                      animated: true,
                    });
                  }}
                />
              ))}
            </View>
          </View>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    height: CARD_HEIGHT + wp(1),
    justifyContent: "center",
  },
  flatListContent: {
    alignItems: "center",
    paddingHorizontal: (width - CARD_WIDTH) / 2 - SPACING,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: SPACING,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: "#fff",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  bottomContentContainer: {
    marginTop: wp(1),
    alignItems: "center",
    paddingHorizontal: wp(10),
  },
  descriptionContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: wp(5),
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: wp(2),
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
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
    marginVertical: wp(5),
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: wp(2),
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
