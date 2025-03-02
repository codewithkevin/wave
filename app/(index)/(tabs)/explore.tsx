import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import MapView, { Marker, Callout, Region } from "react-native-maps";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import TextInput from "@/components/ui/text-input";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import EventHorizontalCard from "@/components/hoc/event-card-horizontal";
import { router } from "expo-router";
import { eventsMock } from "@/_mock/evebData.mock";
import {
  EventCategoryEnum,
  ReadEventCategoryDTO,
} from "@/types/category.types";
import { ReadEventDTO } from "@/types/event.types";
import { EventCategoryData } from "@/_mock/eventCategory";

const CategoryItem = ({
  category,
  isSelected,
  onSelect,
}: {
  category: ReadEventCategoryDTO;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const colorScheme = useColorScheme();

  const renderIcon = () => {
    if (category.iconType === "MaterialIcons") {
      return (
        <MaterialIcons
          name={category.iconName}
          size={24}
          color={isSelected ? "white" : category.color}
        />
      );
    } else if (category.iconType === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          name={category.iconName}
          size={24}
          color={isSelected ? "white" : category.color}
        />
      );
    } else {
      return (
        <Fontisto
          name={category.iconName}
          size={22}
          color={isSelected ? "white" : category.color}
        />
      );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        isSelected && { backgroundColor: category.color },
        {
          backgroundColor: colorScheme === "dark" ? "#15141A" : "#FDFDFD",
        },
      ]}
      onPress={onSelect}
    >
      {renderIcon()}
      <Text
        style={[
          styles.categoryName,
          isSelected && { color: "white" },
          {
            color: colorScheme === "dark" ? "#FDFDFD" : "#000",
          },
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const allCategory: any = {
  id: -1,
  iconName: "view-list",
  iconType: "MaterialIcons",
  name: "All",
  color: "#5D5FEF",
};

export default function CreateEvent() {
  const colorScheme = useColorScheme();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [region, setRegion] = useState<Region>({
    latitude: 5.6037,
    longitude: -0.187,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const [events, setEvents] = useState<ReadEventDTO[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ReadEventDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategoryEnum | -1
  >(-1);
  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ["25%", "40%"], []);

  useEffect(() => {
    loadEvents();

    const timer = setTimeout(() => {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.snapToIndex(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = events;

    if (selectedCategory !== -1) {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.location &&
            event.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredEvents(filtered);

    if (filtered.length > 0) {
      if (filtered.length === 1) {
        zoomToEvent(filtered[0]);
      } else {
        fitMapToEvents(filtered);
      }
    }
  }, [searchQuery, events, selectedCategory]);

  // Function to load events
  const loadEvents = async () => {
    try {
      setLoading(true);

      setEvents(eventsMock);
      setFilteredEvents(eventsMock);

      fitMapToEvents(eventsMock);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fitMapToEvents = (eventsToFit: ReadEventDTO[]) => {
    if (eventsToFit.length === 0 || !mapRef.current) return;

    const validEvents = eventsToFit.filter(
      (event) =>
        event.locationCordinates &&
        typeof event.locationCordinates.lat === "number" &&
        typeof event.locationCordinates.lng === "number"
    );

    if (validEvents.length === 0) return;

    if (validEvents.length === 1) {
      const event = validEvents[0];
      if (!event.locationCordinates) return;

      setRegion({
        latitude: event.locationCordinates.lat,
        longitude: event.locationCordinates.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      return;
    }

    // Find the bounds of all events
    const coordinates = validEvents.map((event) => ({
      latitude: event.locationCordinates!.lat,
      longitude: event.locationCordinates!.lng,
    }));

    setTimeout(() => {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }, 300);
  };

  // Function to zoom to a specific event
  const zoomToEvent = (event: ReadEventDTO) => {
    if (!event.locationCordinates || !mapRef.current) return;

    setRegion({
      latitude: event.locationCordinates.lat,
      longitude: event.locationCordinates.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    mapRef.current.animateToRegion(
      {
        latitude: event.locationCordinates.lat,
        longitude: event.locationCordinates.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      500
    );
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleCategorySelect = (categoryId: EventCategoryEnum | -1) => {
    setSelectedCategory(categoryId);
    const categoryEvents =
      categoryId === -1
        ? events
        : events.filter((event) => event.category === categoryId);

    if (bottomSheetRef.current && categoryEvents.length > 0) {
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Bottom sheet index changed:", index);
  }, []);

  const bottomSheetEvents = useMemo(() => {
    if (selectedCategory === -1) {
      return eventsMock.slice(0, 2);
    }
    return eventsMock
      .filter((event) => event.category === selectedCategory)
      .slice(0, 2);
  }, [selectedCategory]);

  const getCategoryNumericId = (categoryEnum: EventCategoryEnum): number => {
    return Number(categoryEnum);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colorScheme === "dark" ? "white" : "gray"}
          />
        </Pressable>
        <TextInput
          onChangeText={handleSearchChange}
          placeholder="Search for an event"
          size="md"
          returnKeyType="search"
          autoCapitalize="none"
          value={searchQuery}
          leftIcon={<MaterialIcons name="search" size={24} color="gray" />}
        />
      </View>

      {/* Categories List */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          <CategoryItem
            category={allCategory}
            isSelected={selectedCategory === -1}
            onSelect={() => handleCategorySelect(-1)}
          />
          {EventCategoryData.map((category: any) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onSelect={() =>
                handleCategorySelect(category.id as EventCategoryEnum)
              }
            />
          ))}
        </ScrollView>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        zoomTapEnabled
      >
        {/* Event Markers */}
        {filteredEvents
          .filter((event) => event.locationCordinates)
          .map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.locationCordinates!.lat,
                longitude: event.locationCordinates!.lng,
              }}
              title={event.title}
              description={event.location || ""}
              onPress={() => zoomToEvent(event)}
            >
              {/* Custom Marker */}
              <View style={styles.customMarker}>
                <Image
                  source={{
                    uri: event.coverImage,
                  }}
                  style={{
                    borderRadius: 80,
                    width: wp(10),
                    height: wp(10),
                  }}
                />
              </View>

              {/* Callout (Info Window) */}
              <Callout
                onPress={() =>
                  router.navigate({
                    pathname: "/content/events-details",
                    params: { id: event.id, event: JSON.stringify(event) },
                  })
                }
                tooltip
              >
                <View
                  style={[
                    styles.calloutContainer,
                    {
                      backgroundColor:
                        colorScheme === "dark" ? "#15141A" : "#fff",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.calloutTitle,
                      {
                        fontWeight: "bold",
                        color: colorScheme === "dark" ? "white" : "gray",
                      },
                    ]}
                  >
                    {event.title}
                  </Text>
                  <Image
                    source={{ uri: event.coverImage }}
                    style={styles.calloutImage}
                    resizeMode="cover"
                  />
                  <Text
                    style={[
                      styles.calloutLocation,
                      {
                        color: colorScheme === "dark" ? "white" : "gray",
                      },
                    ]}
                  >
                    {event.location || "No location specified"}
                  </Text>
                  <Text
                    style={[
                      styles.calloutDate,
                      {
                        color: colorScheme === "dark" ? "white" : "gray",
                      },
                    ]}
                  >
                    {event.date instanceof Date
                      ? event.date.toDateString()
                      : String(event.date)}
                  </Text>
                  {/* Show category name */}
                  <Text
                    style={[
                      styles.calloutCategory,
                      {
                        color:
                          EventCategoryData.find(
                            (c: any) =>
                              c.id === getCategoryNumericId(event.category)
                          )?.color || "#000",
                      },
                    ]}
                  >
                    {EventCategoryData.find(
                      (c: any) => c.id === getCategoryNumericId(event.category)
                    )?.name || "Other"}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>

      {/* If no results found, show a message */}
      {filteredEvents.length === 0 && !loading && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            {searchQuery.trim() !== ""
              ? `No events found matching "${searchQuery}"`
              : `No events found in this category`}
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery("");
              setSelectedCategory(-1);
            }}
          >
            <Text style={styles.resetButtonText}>Show all events</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        index={0}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        }}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          {/* Display events for the selected category in the bottom sheet */}
          {bottomSheetEvents.map((event) => (
            <EventHorizontalCard
              key={event.id}
              event={event}
              zoomToEvent={zoomToEvent}
            />
          ))}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    top: wp(15),
    width: "100%",
    zIndex: 1,
    paddingHorizontal: 16,
    gap: wp(2),
  },
  categoriesContainer: {
    position: "absolute",
    top: wp(30),
    width: "100%",
    zIndex: 1,
    paddingHorizontal: 8,
  },
  categoriesScrollContent: {
    paddingVertical: wp(7),
    paddingHorizontal: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    padding: 8,
    gap: 5,
    borderRadius: 7,
    minWidth: wp(18),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  calloutContainer: {
    width: 200,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  calloutLocation: {
    fontSize: 14,
    color: "#666",
  },
  calloutDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  calloutCategory: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 5,
  },
  noResultsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noResultsText: {
    fontSize: 16,
    marginBottom: 8,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FF5A5F",
    borderRadius: 5,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Bottom sheet styles
  bottomSheetView: {
    padding: wp(3),
  },

  handleIndicator: {
    backgroundColor: "#DDDDDD",
    width: 40,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: wp(3),
    marginLeft: wp(2),
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
  },
});
