import EventCard from "@/components/hoc/event-card";
import TrendingEvent from "@/components/hoc/trending-event";
import { ThemedText } from "@/components/ThemedText";
import { BodyFlatList } from "@/components/BodyFlatList";
import { ReadEventDTO } from "@/types/event.types";
import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { GlassHeader } from "@/components/GlassHeader";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { zincColors } from "@/lib/Colors";
import { useToast } from "react-native-toast-notifications";
import { useNetInfo } from "@/hooks/useNetInfo";
import { ThemedView } from "@/components/ThemedView";
import { eventsMock } from "@/_mock/evebData.mock";
import { useUserStore } from "@/store/auth";

const SectionHeader = React.memo<{ title: string; onSeeAll?: () => void }>(
  ({ title, onSeeAll }) => (
    <View style={styles.sectionHeader}>
      <ThemedText
        style={{
          fontSize: wp(4),
          fontWeight: "bold",
        }}
      >
        {title}
      </ThemedText>
      <ThemedView
        style={{
          padding: 3,
          borderRadius: 5,
        }}
      >
        <ThemedText style={styles.seeAllText} onPress={onSeeAll}>
          See All
        </ThemedText>
      </ThemedView>
    </View>
  )
);

const EventList = React.memo<{
  events: ReadEventDTO[];
  title: string;
  onSeeAll?: () => void;
}>(({ events, title, onSeeAll }) => {
  const renderEvent = useCallback(
    ({ item, index }: { item: ReadEventDTO; index: number }) => (
      <View
        style={index === 0 ? styles.firstEventContainer : styles.eventContainer}
      >
        <EventCard event={item} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: ReadEventDTO) => item.id, []);

  return (
    <View style={styles.section}>
      <SectionHeader title={title} onSeeAll={onSeeAll} />
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventListContainer}
      />
    </View>
  );
});

const HomeScreen: React.FC = () => {
  const trendingEvents = useMemo(
    () =>
      eventsMock
        .filter((event) => event)
        .sort(() => Math.random() - 0.5)
        .slice(0, 7),
    []
  );

  const upcomingEvents = useMemo(
    () =>
      eventsMock
        .filter((event) => new Date(event.date) > new Date())
        .slice(0, 5),
    []
  );

  const topRatedEvents = useMemo(
    () =>
      [...eventsMock]
        .sort(
          (a, b) =>
            b.ticketSold / b.numberOfTickets - a.ticketSold / a.numberOfTickets
        )
        .slice(0, 5),
    []
  );
  const { signOut } = useSignOut();
  const { logout } = useUserStore();
  const toast = useToast();
  const netInfo = useNetInfo();
  const [wasConnected, setWasConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (netInfo?.isConnected === false && wasConnected !== false) {
      toast.show("You are offline", {
        type: "warning",
      });
    }
    setWasConnected(netInfo?.isConnected ?? null);
  }, [netInfo]);

  const handleLogOut = async () => {
    Alert.alert("Are you sure you want to log out?", "", [
      {
        text: "Yes",
        onPress: async () => {
          await logout();
          signOut();
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  const handleSeeAllTrending = useCallback(() => {
    // Handle see all trending
  }, []);

  const handleSeeAllUpcoming = useCallback(() => {
    // Handle see all upcoming
  }, []);

  const handleSeeAllTopRated = useCallback(() => {
    // Handle see all top rated
  }, []);

  const ListHeaderComponent = useCallback(
    () => (
      <View style={styles.content}>
        <TrendingEvent events={trendingEvents} />
        <EventList
          events={upcomingEvents}
          title="Upcoming events"
          onSeeAll={handleSeeAllUpcoming}
        />
        <EventList
          events={topRatedEvents}
          title="Top Rated"
          onSeeAll={handleSeeAllTopRated}
        />
      </View>
    ),
    [
      trendingEvents,
      upcomingEvents,
      topRatedEvents,
      handleSeeAllUpcoming,
      handleSeeAllTopRated,
    ]
  );

  return (
    <>
      <GlassHeader
        leftComponent={
          <Pressable onPress={handleLogOut}>
            <ThemedText
              style={{
                fontWeight: "bold",
                fontSize: wp(4),
              }}
            >
              Logout
            </ThemedText>
          </Pressable>
        }
        centerComponent={<ThemedText type="defaultSemiBold">Wave</ThemedText>}
        rightComponent={() => {
          return (
            <TouchableOpacity
              onPress={() =>
                toast.show("under development", {
                  duration: 2000,
                  placement: "top",
                })
              }
              style={{
                backgroundColor: zincColors[200],
                padding: 8,
                borderRadius: 20,
              }}
            >
              <FontAwesome name="bell-o" size={22} color="black" />
            </TouchableOpacity>
          );
        }}
      />
      <BodyFlatList
        data={[]}
        keyExtractor={(item: any) => item.id}
        renderItem={() => null}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerTitleAccent: {
    color: "#FFD700",
  },
  content: {
    gap: wp(5),
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  seeAllText: {
    fontSize: wp(3.5),
    color: "#B9B28A",
    fontWeight: "600",
  },
  eventListContainer: {
    paddingRight: wp(5), // Add right padding to the container
  },
  eventContainer: {
    marginLeft: wp(5), // Add consistent spacing between items
  },
  firstEventContainer: {
    marginLeft: 10, // No left margin for the first item
  },
  mainContent: {
    paddingBottom: wp(20),
    paddingTop: wp(18),
  },
});

export default HomeScreen;
