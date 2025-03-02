import { ReadEventDTO } from "@/types/event.types";
import React, { useCallback } from "react";
import { View, Pressable, Image, StyleSheet, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ThemedView } from "../ThemedView";
import Button from "../ui/button";
import { router } from "expo-router";
import { primaryColor } from "@/lib/Colors";
import { getDateComponent } from "@/helpers";

type EventCardProps = {
  event: ReadEventDTO;
};

const EventCard = React.memo<EventCardProps>(({ event }) => {
  const handlePress = useCallback(() => {
    router.push({
      pathname: "/content/events-details",
      params: { id: event.id, event: JSON.stringify(event) },
    });
  }, []);

  return (
    <Pressable style={styles.eventCard} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.coverImage }}
          style={styles.eventImage}
          resizeMode="cover"
        />
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
            <ThemedText
              style={{
                fontWeight: "bold",
              }}
            >
              {event?.eventType.toUpperCase()}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <ThemedText type="defaultSemiBold">
          {getDateComponent(event?.date, "day")}
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          {getDateComponent(event?.date, "month").slice(0, 3)}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  eventCard: {
    width: wp(70),
  },
  imageContainer: {
    width: wp(70),
    height: wp(80),
    borderRadius: 20,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  eventTitle: {
    color: "white",
    fontSize: 14,
    textAlign: "center", // Ensure text itself is centered
  },
});

export default EventCard;
