import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";
import Button from "../ui/button";
import { primaryColor } from "@/lib/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { router } from "expo-router";
import { ThemedView } from "../ThemedView";
import { ReadEventDTO } from "@/types/event.types";
import {
  dateToReadableString,
  getDateComponent,
  getDateComponents,
} from "@/helpers";

type EventHorizontalCardProps = {
  event: ReadEventDTO;
  zoomToEvent: (event: ReadEventDTO) => void;
};
export default function EventHorizontalCard({
  event,
  zoomToEvent,
}: EventHorizontalCardProps) {
  return (
    <TouchableOpacity key={event?.id} onPress={() => zoomToEvent(event)}>
      <ThemedView style={styles.eventCard}>
        <View>
          <Image
            source={{ uri: event?.coverImage }}
            style={styles.eventImage}
          />

          <ThemedView
            style={{
              position: "absolute",
              top: 5,
              left: 5,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <ThemedText type="defaultSemiBold">
              {getDateComponent(event?.date, "day")}
            </ThemedText>
          </ThemedView>
        </View>
        <View style={styles.eventDetails}>
          <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ThemedText></ThemedText>

            <Button
              style={{
                backgroundColor: primaryColor,
              }}
              size="md"
              onPress={() => {
                router.navigate({
                  pathname: "/content/events-details",
                  params: { id: event.id, event: JSON.stringify(event) },
                });
              }}
            >
              <ThemedText>Join</ThemedText>
            </Button>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    padding: wp(2),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    marginBottom: wp(3),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 10,
    elevation: 2,
  },
  eventImage: {
    width: wp(30),
    height: wp(30),
    borderRadius: 10,
  },
  eventDetails: {
    flex: 1,
    gap: 30,
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
