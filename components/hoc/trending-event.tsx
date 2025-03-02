import { ReadEventDTO } from "@/types/event.types";
import { Link, router } from "expo-router";
import React, { useMemo, useCallback, useRef } from "react";
import {
  View,
  Animated as RNAnimated,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { primaryColor } from "@/lib/Colors";
import { getDateComponent } from "@/helpers";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = SCREEN_WIDTH * 0.7;
const SPACING = 65;
const SIDE_SPACING = (SCREEN_WIDTH - ITEM_WIDTH) / 5;

interface TrendingEventsProps {
  events: ReadEventDTO[];
}

interface AnimatedCardProps {
  event: ReadEventDTO;
  index: number;
  scrollX: RNAnimated.Value;
}

const getInputRanges = (index: number) => [
  (index - 1) * ITEM_WIDTH,
  index * ITEM_WIDTH,
  (index + 1) * ITEM_WIDTH,
];

const AnimatedCard = React.memo<AnimatedCardProps>(
  ({ event, index, scrollX }) => {
    const inputRange = useMemo(() => getInputRanges(index), [index]);

    const animatedStyle = useMemo(() => {
      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1, 0.8],
        extrapolate: "clamp",
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.6, 1, 0.6],
        extrapolate: "clamp",
      });

      return {
        transform: [{ scale }],
        opacity,
      };
    }, [scrollX, inputRange]);

    return (
      <RNAnimated.View style={[styles.trendingCard, animatedStyle]}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/content/events-details",
              params: { id: event.id, event: JSON.stringify(event) },
            });
          }}
        >
          <View style={styles.imageContainer}>
            <Animated.Image
              sharedTransitionTag={`image-${event.id}`}
              source={{ uri: event.coverImage }}
              style={styles.trendingImage}
              resizeMode="cover"
            />
            <View style={styles.dateCard}>
              <ThemedText style={styles.dateText}>
                {getDateComponent(event?.date, "day")}
              </ThemedText>
              <ThemedText style={styles.monthText}>
                {getDateComponent(event?.date, "month").slice(0, 3)}
              </ThemedText>
            </View>
          </View>

          <ThemedView
            style={{
              position: "absolute",
              borderRadius: 10,
              width: "90%",
              left: "5%",
              bottom: "5%",
              transform: [{ translateY: -wp(5) }],
              padding: 10,
              gap: 5,
            }}
          >
            <ThemedText type="defaultSemiBold">{event.title}</ThemedText>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ThemedText
                style={{
                  color: "#9CA3AF",
                }}
              >
                {event.location} {event?.time}
              </ThemedText>

              <View
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: 5,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                  }}
                >
                  {event.eventType.toLocaleUpperCase()}
                </Text>
              </View>
            </View>
          </ThemedView>
        </TouchableOpacity>
      </RNAnimated.View>
    );
  }
);

const TrendingEvents = React.memo<TrendingEventsProps>(({ events }) => {
  const scrollX = useRef(new RNAnimated.Value(0)).current;

  const renderItem = useCallback(
    ({ item, index }: { item: ReadEventDTO; index: number }) => (
      <AnimatedCard event={item} index={index} scrollX={scrollX} />
    ),
    [scrollX]
  );

  const keyExtractor = useCallback((item: ReadEventDTO) => item.id, []);

  const onScroll = useMemo(
    () =>
      RNAnimated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      }),
    [scrollX]
  );

  return (
    <View style={styles.container}>
      <RNAnimated.FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        onScroll={onScroll}
        snapToAlignment="center"
        contentContainerStyle={styles.list}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  trendingCard: {
    width: ITEM_WIDTH,
  },
  imageContainer: {
    position: "relative",
  },
  trendingImage: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.5,
    borderRadius: 16,
  },
  list: {
    paddingHorizontal: SIDE_SPACING - SPACING / 5,
  },
  dateCard: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  monthText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginTop: 2,
  },
});

TrendingEvents.displayName = "TrendingEvents";

export default TrendingEvents;
