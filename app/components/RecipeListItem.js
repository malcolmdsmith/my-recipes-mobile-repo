import React from "react";
import { View, StyleSheet } from "react-native";

import RecipeTitleLink from "../components/RecipeTitleLink";

function RecipeListItem({ recipe, onRecipeSelect, fontColor = "white" }) {
  return (
    <>
      <View style={styles.container}>
        <RecipeTitleLink
          title={recipe.recipeTitle}
          icon="chef-hat"
          color={fontColor}
          onPress={() => onRecipeSelect(recipe.id)}
          fontSize={15}
        ></RecipeTitleLink>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginRight: 10,
  },
});

export default RecipeListItem;
