import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { isTablet } from "react-native-device-detection";

import colors from "../config/colors";

function RecipeTitleLink({
  title,
  icon,
  onPress,
  fontSize = 18,
  color = colors.tertiary,
}) {
  return (
    <TouchableOpacity style={[styles.button]} onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons name={icon} color={color} size={18} />
        <Text style={[styles.text, { fontSize: fontSize }, { color: color }]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: colors.heading,
    //fontSize: isTablet ? 20 : 16,
    marginLeft: 10,
  },
});

export default RecipeTitleLink;
