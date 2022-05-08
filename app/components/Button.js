import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors";
import DropShadow from "./DropShadow";

function AppButton({
  onPress,
  width,
  title = "",
  color = "primary",
  fontSize = 16,
  icon = "",
  iconAfter = false,
  iconSize = 18,
}) {
  const getButton = (iconAfter, title, icon) => {
    //
    if (icon === "" && title === "") return "error";
    if (icon === "") return title;
    if (iconAfter)
      return (
        <Text>
          {title} <FontAwesome5 name={icon} size={iconSize} />
        </Text>
      );
    else
      return (
        <Text>
          <FontAwesome5 name={icon} size={iconSize} /> {title}
        </Text>
      );
  };

  return (
    <DropShadow>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors[color] },
          { width: width },
          { height: Platform.OS === "ios" ? 40 : 50 },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.text, { fontSize: fontSize }]}>
          {getButton(iconAfter, title, icon)}
        </Text>
      </TouchableOpacity>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginVertical: 5,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
  },
  text: {
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
