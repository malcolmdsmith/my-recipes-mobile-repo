import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";

export default function ListImageViewIcon({ onPress, selected, bgcolor }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          { borderColor: selected ? colors.tertiary : bgcolor },
        ]}
      >
        <View style={styles.box}></View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 34,
    height: 34,
    borderWidth: 1,
    marginLeft: 5,
  },
  box: {
    width: 30,
    height: 30,
    margin: 1,
    borderColor: colors.black,
    borderWidth: 1,
  },
});
