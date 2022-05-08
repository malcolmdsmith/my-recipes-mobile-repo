import React, { Component, useState } from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Heading from "../../components/Heading";
import colors from "../../config/colors";

export default CookPrepTimePanel = ({ recipeCard }) => {
  const getTime = (timetype, time) => {
    return timetype + ": " + time;
  };

  return (
    <View style={styles.container}>
      <Heading
        title={getTime("Prep-Time", recipeCard.prepTime)}
        bold="normal"
        fontSize={12}
      >
        <MaterialCommunityIcons name="timer-sand" />
      </Heading>
      <Heading
        title={getTime("Cook-Time", recipeCard.cookTime)}
        bold="normal"
        fontSize={12}
      >
        <MaterialCommunityIcons name="timer-sand" />
      </Heading>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: 10,
  },
});
