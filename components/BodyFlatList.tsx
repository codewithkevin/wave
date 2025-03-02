import { forwardRef, memo } from "react";
import { FlatList, FlatListProps, ViewStyle } from "react-native";

interface BodyFlatListProps extends FlatListProps<any> {
  containerStyle?: ViewStyle;
}

export const BodyFlatList = memo(
  forwardRef<FlatList, BodyFlatListProps>((props, ref) => {
    const { containerStyle, ...restProps } = props;

    return (
      <FlatList
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior="automatic"
        contentInset={{ bottom: 0 }}
        scrollIndicatorInsets={{ bottom: 0 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        removeClippedSubviews={false}
        windowSize={3}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        style={[{ flex: 1 }, containerStyle]}
        {...restProps}
        ref={ref}
      />
    );
  })
);

BodyFlatList.displayName = "BodyFlatList";
