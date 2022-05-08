import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import Text from "./Text";

function PickerItem({ item, onPress, textProperty }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>{item[textProperty]}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 10,
  },
});

export default PickerItem;
