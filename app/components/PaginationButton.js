import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors";
import DropShadow from "./DropShadow";

function PaginationButton({
  onPress,
  width,
  color = "primary",
  icon = "",
  iconSize = 18,
}) {
  return (
    <DropShadow>
      <TouchableOpacity
        style={[styles.button]}
        //   { backgroundColor: colors[color] },
        //   { width: width },
        //   { height: 40 },
        // ]}
        onPress={onPress}
      >
        <FontAwesome5 name={icon} size={iconSize} color={colors.white} />
      </TouchableOpacity>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    height: 40,
    padding: 5,
  },
});

export default PaginationButton;
