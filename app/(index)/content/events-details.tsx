import {
  View,
  useColorScheme,
  Dimensions,
  Pressable,
  StyleSheet,
  ColorSchemeName,
  SectionList,
  SectionListData,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInUp,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  heightPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemedText } from "@/components/ThemedText";
import { EventType, ReadEventDTO } from "@/types/event.types";
import { Ionicons } from "@expo/vector-icons";
import { primaryColor } from "@/lib/Colors";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/button";
import {
  getDateComponent,
  getDateComponents,
  truncatedString,
} from "@/helpers";
import { useBookmarkStore } from "@/store/bookmark";
import { ToastType, useToast } from "react-native-toast-notifications";
import TicketModal from "@/components/hoc/ticket-modal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface StackHeaderProps {
  title: string;
  event: ReadEventDTO;
  toggleBookmark: (event: ReadEventDTO) => void;
  addToRecentlyViewed: (eventId: string) => void;
  isBookmarked: (eventId: string) => boolean;
  toast: ToastType;
}

const renderStackHeader = ({
  title,
  event,
  toggleBookmark,
  addToRecentlyViewed,
  isBookmarked,
  toast,
}: StackHeaderProps) => {
  const handleToggleBookmark = (): void => {
    toggleBookmark(event);
    addToRecentlyViewed(event.id);

    if (isBookmarked(event.id)) {
      toast.show("Event added to bookmarks", {
        placement: "bottom",
        duration: 1000,
      });
      toast.hideAll();
    } else {
      toast.show("Event removed from bookmarks", {
        placement: "bottom",
        duration: 1000,
      });
      toast.hideAll();
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: wp(3),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: SCREEN_WIDTH,
      }}
    >
      <ThemedView
        style={{
          borderRadius: 99,
          padding: 5,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color={primaryColor} />
        </Pressable>
      </ThemedView>
      <ThemedText
        type="title"
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: primaryColor,
        }}
      >
        {title}
      </ThemedText>

      <ThemedView
        style={{
          borderRadius: 99,
          padding: 5,
        }}
      >
        <Pressable onPress={handleToggleBookmark}>
          {isBookmarked(event.id) ? (
            <Ionicons name="heart" size={30} color={primaryColor} />
          ) : (
            <Ionicons name="heart-outline" size={30} color={primaryColor} />
          )}
        </Pressable>
      </ThemedView>
    </View>
  );
};

// Section list data types
interface TabData {
  type: string;
  data: any[];
}

export default function EventDetails(): React.ReactNode {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const { id, event: eventString } = params;
  const { isBookmarked, toggleBookmark, addToRecentlyViewed } =
    useBookmarkStore();
  const toast = useToast();

  // Add state for modal visibility
  const [ticketModalVisible, setTicketModalVisible] = useState<boolean>(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<number>(0);
  const sectionListRef = useRef<SectionList>(null);

  const event = eventString
    ? (JSON.parse(eventString as string) as ReadEventDTO)
    : null;

  const gradientColor = useCallback(
    (colorScheme: ColorSchemeName): string[] => {
      if (colorScheme === "dark") {
        return ["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,1)"];
      }

      return ["transparent", "rgba(255,255,255,0.5)", "rgba(255,255,255,1)"];
    },
    []
  );

  // Create section data for the SectionList
  const getSections = useCallback(() => {
    if (!event) return [];

    // Create section data based on active tab
    const tabData: TabData[] = [
      {
        type: "Description",
        data: [{ content: event.description }],
      },
      {
        type: "Replies",
        data: [{ content: "Event replies will appear here" }],
      },
      {
        type: "Media",
        data: [{ content: "Event media gallery will appear here" }],
      },
      {
        type: "Likes",
        data: [{ content: "People who liked this event will appear here" }],
      },
    ];

    return [tabData[activeTab]];
  }, [event, activeTab]);

  // Header for the SectionList
  const ListHeaderComponent = useCallback(() => {
    if (!event) return null;

    return (
      <View>
        <View>
          <Animated.Image
            entering={FadeInUp.duration(1000).delay(300)}
            sharedTransitionTag={`image-${id}`}
            source={{ uri: event?.coverImage }}
            style={{
              width: SCREEN_WIDTH,
              height: hp(60),
            }}
          />
          <LinearGradient
            colors={gradientColor(colorScheme)}
            start={{ x: 0.6, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: "absolute",
              bottom: 0,
              width: SCREEN_WIDTH,
              height: hp("55"),
            }}
          />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: wp(-5),
            alignSelf: "center",
            gap: wp(3),
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <ThemedText
              style={{
                textAlign: "center",
                width: wp(35),
              }}
              type="title"
            >
              {event?.title}
            </ThemedText>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: wp(9),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedView style={styles.dateCard}>
              <ThemedText style={styles.dateText}>
                {getDateComponent(event?.date, "day")}
              </ThemedText>
              <ThemedText style={styles.monthText}>
                {getDateComponent(event?.date, "month")}
              </ThemedText>
            </ThemedView>

            <View>
              <ThemedText
                style={{
                  textAlign: "center",
                }}
                type="defaultSemiBold"
              >
                {getDateComponents(event?.date, {
                  month: true,
                  day: true,
                  year: true,
                })}
              </ThemedText>

              <ThemedText
                style={{
                  textAlign: "center",
                  width: wp(14),
                }}
                type="defaultSemiBold"
              >
                {event?.category}
              </ThemedText>
            </View>

            <Pressable
              style={{
                borderWidth: 1,
                padding: 5,
                borderRadius: 5,
                borderColor: primaryColor,
              }}
            >
              <Ionicons name="calendar" size={24} color={primaryColor} />
            </Pressable>
          </View>
        </View>

        {/* Spacing to account for the absolute positioned elements */}
        <View style={{ height: wp(15) }} />
      </View>
    );
  }, [event, colorScheme, id]);

  // Render the tab section header (this will stick to the top)
  const renderSectionHeader = useCallback(() => {
    return (
      <ThemedView style={styles.tabBarContainer}>
        {["Description", "Replies", "Media", "Likes"].map((tab, index) => (
          <Pressable
            key={`option-${index}`}
            style={styles.tabButton}
            onPress={() => {
              setActiveTab(index);
            }}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === index && { color: primaryColor },
              ]}
            >
              {tab}
            </ThemedText>
            {activeTab === index && (
              <View
                style={[
                  styles.blueUnderline,
                  { backgroundColor: primaryColor },
                ]}
              />
            )}
          </Pressable>
        ))}
      </ThemedView>
    );
  }, [activeTab]);

  // Render each item in the section
  const renderItem = useCallback(
    ({ item, section }: { item: any; section: SectionListData<any> }) => {
      return (
        <View style={styles.tabContent}>
          <ThemedText type="defaultSemiBold">{item.content}</ThemedText>
        </View>
      );
    },
    []
  );

  if (!event) return null;

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: false,
          animation: "slide_from_bottom",
          headerTitle: () =>
            renderStackHeader({
              title: truncatedString(event?.title as string, 12) || "",
              event,
              toggleBookmark,
              addToRecentlyViewed,
              isBookmarked,
              toast,
            }),
        }}
      />
      <SectionList
        ref={sectionListRef}
        sections={getSections()}
        keyExtractor={(item, index) => `tab-item-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={ListHeaderComponent}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: colorScheme === "dark" ? "#000" : "#ffffff",
        }}
      />

      <ThemedView
        style={{
          height: wp(10),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: wp(4),
        }}
      >
        <View style={{ gap: 10 }}>
          {event?.eventType === EventType.PAID ? (
            <ThemedText type="defaultSemiBold">
              {event?.ticketPrice?.currency} {event?.ticketPrice?.amount}
            </ThemedText>
          ) : (
            <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>
              Free
            </ThemedText>
          )}
        </View>

        <Button
          style={{
            backgroundColor: primaryColor,
          }}
          onPress={() => setTicketModalVisible(true)}
        >
          <ThemedText>
            {event?.eventType === EventType.PAID ? "Buy Ticket" : "Get Ticket"}
          </ThemedText>
        </Button>
      </ThemedView>

      {/* Add the TicketModal component */}
      <TicketModal
        visible={ticketModalVisible}
        onClose={() => setTicketModalVisible(false)}
        event={event}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dateCard: {
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dateText: {
    fontSize: 15,
    lineHeight: 15,
    fontWeight: "bold",
  },
  monthText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: wp(2),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150, 150, 150, 0.3)",
    paddingTop: wp(2),
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 5,
  },
  blueUnderline: {
    height: 2,
    width: "50%",
    borderRadius: 4,
  },
  tabContent: {
    padding: wp(4),
    paddingBottom: wp(20),
    minHeight: hp(30),
  },
});
