import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React from "react";
import { ReadEventDTO } from "@/types/event.types";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import Button from "../ui/button";
import { router } from "expo-router";
import { primaryColor } from "@/lib/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontAwesome, Fontisto, Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";

type BookmarkEventCardProps = {
  event: ReadEventDTO;
  isBookmarked: (eventId: string) => boolean;
  removeBookmark: (eventId: string) => void;
};
export default function BookmarkEventCard({
  event,
  isBookmarked,
  removeBookmark,
}: BookmarkEventCardProps) {
  const toast = useToast();
  const handleToggleBookmark = () => {
    if (isBookmarked(event.id)) {
      removeBookmark(event.id);
      toast.show("Event removed from bookmarks", {
        placement: "top",
        duration: 1000,
      });
    }
  };
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/content/events-details",
          params: { id: event.id, event: JSON.stringify(event) },
        });
      }}
      key={event?.id}
    >
      <ThemedView style={styles.eventCard}>
        <View>
          <Image
            source={{
              uri: event?.coverImage,
            }}
            style={styles.eventImage}
            // resizeMode="contain"
          />

          <View style={{ padding: 10, gap: 10 }}>
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "bold",
                lineHeight: 25,
              }}
            >
              {event?.title}
            </ThemedText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Fontisto name="date" size={20} color={primaryColor} />
                <ThemedText type="defaultSemiBold">Jul 6 8:00PM</ThemedText>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <FontAwesome name="ticket" size={24} color={primaryColor} />
                <ThemedText type="defaultSemiBold">
                  {event?.eventType?.toLocaleUpperCase()}
                </ThemedText>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              left: 10,
            }}
            onPress={handleToggleBookmark}
          >
            <ThemedView
              style={{
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Ionicons name="heart" size={30} color={primaryColor} />
            </ThemedView>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
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
    width: wp(91),
    height: wp(90),
    elevation: 2,
  },
  eventImage: {
    width: wp(91),
    height: wp(60),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  eventDetails: {
    flex: 1,
    gap: wp(13),
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
