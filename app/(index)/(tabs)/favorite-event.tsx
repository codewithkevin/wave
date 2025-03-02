import React from "react";
import { BodyScrollView } from "@/components/BodyScrollView";
import { useBookmarkStore } from "@/store/bookmark";
import BookmarkEventCard from "@/components/hoc/bookmark-event-card";

export default function FavoriteEventScreen() {
  const { bookmarkedEvents, recentlyViewed, isBookmarked, removeBookmark } =
    useBookmarkStore();

  const visibleEvents = recentlyViewed
    .filter((eventId) => isBookmarked(eventId))
    .map((eventId) => bookmarkedEvents[eventId]);

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
