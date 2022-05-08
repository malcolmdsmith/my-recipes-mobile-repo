import React, { Component, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function StarRatingViewer({ rating, color, backgroundColor }) {
  const getStars = () => {
    const stars = [];
    for (let i = 5; i >= 0, i--; ) {
      if (i >= rating) {
        stars.push("star-outline");
      } else {
        if (i + 0.5 === parseFloat(rating)) {
          stars.push("star-half-full");
        } else {
          stars.push("star");
        }
      }
    }
    return stars;
  };

  return (
    <View style={[styles.container, color, backgroundColor]}>
      {getStars()
        .reverse()
        .map((star, index) => (
          <MaterialCommunityIcons
            key={index}
            name={star}
            size={24}
            color={color}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
