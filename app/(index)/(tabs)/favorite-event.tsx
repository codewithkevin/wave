import React from "react";
import { BodyScrollView } from "@/components/BodyScrollView";
import { useBookmarkStore } from "@/store/bookmark";
import BookmarkEventCard from "@/components/hoc/bookmark-event-card";
import { ThemedText } from "@/components/ThemedText";
import { Image, View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function FavoriteEventScreen() {
  const { bookmarkedEvents, recentlyViewed, isBookmarked, removeBookmark } =
    useBookmarkStore();

  const visibleEvents = recentlyViewed
    .filter((eventId) => isBookmarked(eventId))
    .map((eventId) => bookmarkedEvents[eventId]);

  if (visibleEvents.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: wp(10),
        }}
      >
        <Image
          source={require("@/assets/images/empty.png")}
          style={{ width: 200, height: 200 }}
        />
        <ThemedText type="subtitle">No bookmarked events</ThemedText>
      </View>
    );
  }
  return (
    <BodyScrollView
      style={{
        padding: 20,
      }}
      contentContainerStyle={{
        paddingBottom: 50,
      }}
      showsVerticalScrollIndicator={false}
    >
      {visibleEvents.map((event) => (
        <BookmarkEventCard
          key={event?.id}
          event={event}
          isBookmarked={isBookmarked}
          removeBookmark={removeBookmark}
        />
      ))}
    </BodyScrollView>
  );
}
