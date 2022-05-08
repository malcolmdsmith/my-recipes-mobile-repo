import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AlphabetLink({ char, onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPress(char)}>
        <Text style={styles.text}>{char}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 15,
    //backgroundColor: "red",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
