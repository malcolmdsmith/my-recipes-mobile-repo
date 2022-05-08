import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors";

function BoxButton({
  title,
  onPress,
  width,
  color = "primary",
  fontSize = 18,
  icon = "",
  iconAfter = false,
  iconSize = 18,
}) {
  const getButton = (iconAfter, title, icon) => {
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
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors[color] },
        { width: width },
      ]}
      onPress={onPress}
    >
      {icon != "" ? (
        <Text style={[styles.text, { fontSize: fontSize }]}>
          {getButton(iconAfter, title, icon)}
        </Text>
      ) : (
        <Text style={[styles.text, { fontSize: fontSize }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: colors.black,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginVertical: 13,
    marginRight: 5,
    marginLeft: 5,
  },
  text: {
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "normal",
  },
});

export default BoxButton;
