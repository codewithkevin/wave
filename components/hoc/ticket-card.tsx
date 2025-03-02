import { View, Text, Image, useColorScheme } from "react-native";
import React from "react";
import { primaryColor, zincColors } from "@/lib/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ReadEventDTO } from "@/types/event.types";
import { dateToReadableString } from "@/helpers";

type TicketCardProps = {
  event: ReadEventDTO;
};
export default function TicketCard({ event }: TicketCardProps) {
  const colorScheme = useColorScheme();
  const BarcodeElement = () => {
    const bars = [];
    for (let i = 0; i < 40; i++) {
      const width = Math.random() * 3 + 1;
      bars.push(
        <View
          key={i}
          style={{
            width: width,
            height: 50,
            backgroundColor: colorScheme === "dark" ? "white" : "black",
            marginHorizontal: 1,
          }}
        />
      );
    }
    return (
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          marginBottom: 8,
          height: 50,
        }}
      >
        {bars}
      </ThemedView>
    );
  };
  return (
    <View
      style={{
        backgroundColor: primaryColor,
        padding: 10,
        borderRadius: 30,
        height: wp(150),
        alignItems: "center",
        gap: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 3,
          borderRadius: 20,
        }}
      >
        <Image
          source={{
            uri: event?.coverImage,
          }}
          style={{
            height: wp(50),
            width: wp(80),
            borderRadius: 20,
          }}
          resizeMode="cover"
        />
      </View>
      <ThemedView
        style={{
          borderRadius: 20,
          padding: wp(7),
          width: wp(80),
          height: wp(85),
          gap: 20,
        }}
      >
        <View>
          <ThemedText
            style={{
              fontWeight: "bold",
              fontSize: wp(5),
            }}
          >
            {event?.title}
          </ThemedText>
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
            width: "100%",
          }}
        >
          <View>
            <ThemedText>Date</ThemedText>
            <ThemedText type="defaultSemiBold">
              {dateToReadableString(event?.date)}
            </ThemedText>
          </View>

          <View>
            <ThemedText>Time</ThemedText>
            <ThemedText type="defaultSemiBold">{event?.time}</ThemedText>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View>
            <ThemedText>Venue</ThemedText>
            <ThemedText type="defaultSemiBold">{event?.venue}</ThemedText>
          </View>

          <View>
            {/* <ThemedText>Time</ThemedText>
            <ThemedText type="defaultSemiBold">10:00 PM</ThemedText> */}
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
            marginTop: wp(4),
          }}
        />

        <BarcodeElement />
      </ThemedView>

      {/* Left Notch */}
      <View
        style={{
          position: "absolute",
          left: wp(3),
          top: wp(115),
          width: 10,
          height: 2,
          transform: [{ translateX: -5 }],
          backgroundColor: primaryColor,
          padding: wp(3.5),
          borderRadius: 20,
        }}
      />

      {/* Right Notch */}
      <View
        style={{
          position: "absolute",
          right: wp(3),
          top: wp(115),
          width: 10,
          height: 2,
          transform: [{ translateX: 5 }],
          backgroundColor: primaryColor,
          padding: wp(3.5),
          borderRadius: 20,
        }}
      />
    </View>
  );
}
