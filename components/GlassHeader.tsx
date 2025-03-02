import React from "react";
import { View, StyleSheet, Platform, useColorScheme } from "react-native";
import { BlurView } from "expo-blur";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ThemedText } from "@/components/ThemedText";

interface GlassHeaderProps {
  leftComponent?: React.ReactNode | (() => React.ReactNode);
  centerComponent?: React.ReactNode | (() => React.ReactNode);
  rightComponent?: React.ReactNode | (() => React.ReactNode);
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  leftComponent,
  centerComponent,
  rightComponent,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const renderComponent = (
    component: React.ReactNode | (() => React.ReactNode)
  ) => {
    if (typeof component === "function") {
      return component();
    }
    return component;
  };

  const HeaderContent = () => (
    <View style={styles.content}>
      <View style={[styles.headerItem, styles.leftItem]}>
        {renderComponent(leftComponent)}
      </View>
      <View style={[styles.headerItem, styles.centerItem]}>
        {renderComponent(centerComponent)}
      </View>
      <View style={[styles.headerItem, styles.rightItem]}>
        {renderComponent(rightComponent)}
      </View>
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={isDark ? 40 : 20}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.5)"
              : "rgba(255, 255, 255, 0.5)",
          },
        ]}
      >
        <HeaderContent />
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.androidContainer,
        {
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.75)"
            : "rgba(255, 255, 255, 0.9)",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      ]}
    >
      <HeaderContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: wp(13),
    paddingBottom: wp(4),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  androidContainer: {
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  headerItem: {
    flex: 1,
  },
  leftItem: {
    alignItems: "flex-start",
  },
  centerItem: {
    alignItems: "center",
  },
  rightItem: {
    alignItems: "flex-end",
  },
});
