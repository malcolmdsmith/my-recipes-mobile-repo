import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";

const AppTextInput = React.forwardRef(
  (
    {
      icon,
      showClearButton,
      onFieldClear,
      textInputWidth,
      width = "100%",
      ...otherProps
    },
    ref
  ) => {
    return (
      <View style={[styles.container, { width }]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        )}
        <TextInput
          placeholderTextColor={defaultStyles.colors.medium}
          style={[
            defaultStyles.text,
            { marginLeft: 3 },
            { backgroundColor: defaultStyles.colors.beige },
            { width: textInputWidth == 0 ? "79%" : textInputWidth },
          ]}
          {...otherProps}
          ref={ref}
        />
        {showClearButton && (
          <MaterialCommunityIcons
            name="close-octagon-outline"
            size={24}
            color={defaultStyles.colors.medium}
            onPress={onFieldClear}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.beige,
    borderRadius: 25,
    flexDirection: "row",
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 20,
    paddingBottom: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default AppTextInput;
