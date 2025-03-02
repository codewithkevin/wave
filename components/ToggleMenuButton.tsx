import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Colors, primaryColor } from "@/lib/Colors";

interface ToggleMenuButtonProps {
  onPress: () => void;
  isExpanded: boolean;
}

export function ToggleMenuButton(props: ToggleMenuButtonProps) {
  return (
    <TouchableOpacity style={styles.mainButton} onPress={props.onPress}>
      <View>
        <Ionicons name="menu" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: Colors.light.tabIconDefault,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
