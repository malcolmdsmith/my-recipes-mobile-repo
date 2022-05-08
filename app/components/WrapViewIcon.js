import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";

export default function WrapViewIcon({ onPress, selected, bgcolor }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          { borderColor: selected ? colors.tertiary : bgcolor },
        ]}
      >
        <View style={styles.box}></View>
        <View style={styles.box}></View>
        <View style={styles.box}></View>
        <View style={styles.box}></View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    width: 36,
    height: 36,
    borderWidth: 1,
    marginLeft: 5,
  },
  box: {
    width: 15,
    height: 15,
    margin: 1,
    borderColor: colors.black,
    borderWidth: 1,
  },
});
