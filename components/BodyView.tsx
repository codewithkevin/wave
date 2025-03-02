import React from "react";
import { View, ViewProps } from "react-native";

export const BodyView = React.forwardRef<View, ViewProps>((props, ref) => {
  return (
    <View
      ref={ref}
      style={[{ flex: 1, backgroundColor: "white" }, props.style]}
      {...props}
    />
  );
});
