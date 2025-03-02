import React from "react";
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { zincColors } from "@/lib/Colors";
import { ThemedText } from "../ThemedText";

type InputVariant = "default" | "filled" | "outlined" | "ghost";
type InputSize = "sm" | "md" | "lg";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconContainerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  variant = "default",
  size = "md",
  containerStyle,
  inputStyle,
  disabled = false,
  leftIcon,
  rightIcon,
  iconContainerStyle,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const sizeStyles: Record<
    InputSize,
    { height?: number; fontSize: number; padding: number }
  > = {
    sm: { fontSize: 16, padding: 8 },
    md: { height: 50, fontSize: 16, padding: 14 },
    lg: { height: 55, fontSize: 32, padding: 16 },
  };

  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      backgroundColor: isDark ? zincColors[900] : "#F9FAFB",
      flexDirection: "row",
      alignItems: "center",
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: isDark ? zincColors[700] : zincColors[100],
        };
      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDark ? zincColors[600] : zincColors[200],
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return isDark ? zincColors[500] : zincColors[400];
    }
    return isDark ? zincColors[50] : zincColors[900];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View style={[getVariantStyle(), disabled && styles.disabled]}>
        {leftIcon && (
          <View
            style={[styles.iconContainer, styles.leftIcon, iconContainerStyle]}
          >
            {leftIcon}
          </View>
        )}
        <RNTextInput
          style={[
            {
              height: sizeStyles[size].height,
              fontSize: sizeStyles[size].fontSize,
              padding: sizeStyles[size].padding,
              color: getTextColor(),
              flex: 1,
            },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={isDark ? zincColors[500] : zincColors[400]}
          editable={!disabled}
          {...props}
        />
        {rightIcon && (
          <View
            style={[styles.iconContainer, styles.rightIcon, iconContainerStyle]}
          >
            {rightIcon}
          </View>
        )}
      </View>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  error: {
    color: "#ef4444",
    marginTop: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
});

export default TextInput;
