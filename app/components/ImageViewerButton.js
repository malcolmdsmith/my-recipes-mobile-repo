import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { isTablet } from "react-native-device-detection";

import colors from "../config/colors";

export default function ImageViewerButton({ title, onPress, icon, iconAfter }) {
  const getButton = (iconAfter, title, icon) => {
    if (iconAfter)
      return (
        <Text style={styles.text}>
          <FontAwesome5 name={icon} size={16} />
        </Text>
      );
    else
      return (
        <Text style={styles.text}>
          <FontAwesome5 name={icon} size={16} />
        </Text>
      );
  };

  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.container}>
      {getButton(iconAfter, title, icon)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 15,
    backgroundColor: colors.tertiary,
    width: isTablet
      ? Dimensions.get("window").width / 4 - 13
      : Dimensions.get("window").width / 4 - 13,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: isTablet ? 13 : 9,
    marginLeft: 10,
    textAlign: "center",
  },
});
