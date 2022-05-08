import React, { Component, useState } from "react";
import { View, StyleSheet } from "react-native";

import colors from "../../config/colors";
import IngredientListItem from "../../components/IngredientListItem";
import Heading from "../../components/Heading";

export default IngredientsPanel = ({ ingredients }) => {
  return (
    <View style={styles.container}>
      <Heading title="Ingredients" />
      {ingredients.map((ing, index) => (
        <IngredientListItem key={index} item={ing} showDelete={false} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
});
