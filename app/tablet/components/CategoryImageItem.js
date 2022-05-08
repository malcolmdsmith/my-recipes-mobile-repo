import React, { Component, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import colors from "../../config/colors";

export default function CategoryImageItem({
  category,
  onShowRecipesForCategory,
}) {
  const onPress = () => {
    onShowRecipesForCategory(category);
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: category.imageUrl,
          }}
        />
        <Text style={styles.text}>{category.category_name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    width: 250,
    height: 50,
    margin: 10,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 50,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  text: {
    fontWeight: "bold",
    marginLeft: 20,
  },
});
