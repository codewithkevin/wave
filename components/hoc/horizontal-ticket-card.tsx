import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Entypo } from "@expo/vector-icons";
import { primaryColor, zincColors } from "@/lib/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { router } from "expo-router";
import { ReadEventDTO } from "@/types/event.types";

type HorizontalTicketCardProps = {
  ticket: ReadEventDTO;
};

export default function HorizontalTicketCard({
  ticket,
}: HorizontalTicketCardProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/content/ticket-details",
          params: { id: ticket?.id, event: JSON.stringify(ticket) },
        });
      }}
    >
      <ThemedView
        style={{
          padding: 20,
          backgroundColor: colorScheme === "dark" ? "black" : "#EFEFEE",
          borderRadius: 10,
          gap: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              width: "80%", // Defines width for the text
              flexShrink: 1, // Allows text to shrink if needed
            }}
          >
            {ticket?.title}
          </ThemedText>
          <View
            style={{
              backgroundColor: "#887EF9",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Entypo name="video-camera" size={24} color="white" />
          </View>
        </View>

        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: zincColors[400],
            borderStyle: "dashed",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 14,
            }}
          >
            <View>
              <ThemedText>Time</ThemedText>
              <ThemedText type="defaultSemiBold">{ticket?.time}</ThemedText>
            </View>

            <View>
              <ThemedText>Seat</ThemedText>
              <ThemedText type="defaultSemiBold">No seat</ThemedText>
            </View>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#22C55E",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <ThemedText>Success</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView
        style={{
          position: "absolute",
          left: wp(-2),
          top: wp(15),
          width: 10,
          height: 2,
          transform: [{ translateX: -5 }],
          padding: wp(3.5),
          borderRadius: 20,
        }}
      />

      {/* Right Notch */}
      <ThemedView
        style={{
          position: "absolute",
          right: wp(-2),
          top: wp(15),
          width: 10,
          height: 2,
          transform: [{ translateX: 5 }],
          padding: wp(3.5),
          borderRadius: 20,
        }}
      />
    </TouchableOpacity>
  );
}
