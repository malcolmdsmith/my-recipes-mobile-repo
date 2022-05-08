import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import Text from "./Text";

function PickerItem({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>{item}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 10,
    fontWeight: "bold",
  },
});

export default PickerItem;
