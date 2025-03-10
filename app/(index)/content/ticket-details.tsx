import { View, TouchableOpacity, Platform, Alert } from "react-native";
import React, { useRef } from "react";
import { BodyScrollView } from "@/components/BodyScrollView";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import TicketCard from "@/components/hoc/ticket-card";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import { primaryColor } from "@/lib/Colors";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { ReadEventDTO } from "@/types/event.types";

export default function TicketDetails() {
  const router = useRouter();
  const ticketRef = useRef();
  const params = useLocalSearchParams();
  const { id, event } = params;

  const ticket = event ? (JSON.parse(event as string) as ReadEventDTO) : null;

  console.log("ticket", ticket);

  const renderLeftHeader = () => {
    return (
      <TouchableOpacity onPress={() => router.back()}>
        <ThemedText
          style={{
            fontWeight: "bold",
          }}
        >
          Back
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const captureAndDownloadTicket = async () => {
    try {
      // Request permissions for saving to media library (Android)
      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need media library permissions to save the image!");
          return;
        }
      }

      // Capture the view as an image
      const uri = await ticketRef?.current.capture();

      // Save or share based on platform
      if (Platform.OS === "android") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("Download", asset, false);
        Alert.alert("Ticket image saved to gallery!");
      } else {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Download Ticket Image",
          UTI: "public.png",
        });
        Alert.alert("Ticket image saved to gallery!");
      }
    } catch (error) {
      console.error("Error capturing view:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ticket",
          headerLargeTitle: false,
          headerLeft: () => renderLeftHeader(),
        }}
      />
      <BodyScrollView contentContainerStyle={{ padding: 20, gap: 30 }}>
        <ViewShot
          ref={ticketRef}
          options={{ format: "png", quality: 0.9 }}
          style={{ backgroundColor: "transparent" }}
        >
          <TicketCard event={ticket as ReadEventDTO} />
        </ViewShot>

        <Button
          style={{
            backgroundColor: primaryColor,
          }}
          size="lg"
          onPress={captureAndDownloadTicket}
        >
          <ThemedText
            style={{
              color: "white",
            }}
          >
            Download Ticket
          </ThemedText>
        </Button>
      </BodyScrollView>
    </>
  );
}
