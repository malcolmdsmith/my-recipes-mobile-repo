import React, { Component, useState } from "react";
import { View, StyleSheet, Text, Linking, Alert } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import Heading from "../components/Heading";
import Link from "../components/Link";
import IngredientListItem from "./IngredientListItem";
import colors from "../config/colors";

export function RecipeOtherCard({ recipe, ingredients }) {
  const getSourceData = () => {
    if (recipe.recipeSource === "Web Link")
      return (
        <Link
          title={recipe.recipeTitle}
          onPress={() => {
            Linking.openURL(recipe.recipeSourceData);
          }}
        />
      );
    else return <Text>{recipe.recipeSourceData}</Text>;
  };

  const handleAddToShoppingCart = async (item) => {
    //console.log("item...", item);
    const user = await getCurrentUser();
    const cartItem = {
      ingredientName: item.ingredientName,
      measure: item.measure,
      qty: item.qty,
      shopping_list_date: new Date().toDateString(),
      picked: false,
      owner_id: user.id,
      cost: 0,
    };
    //
    await saveShoppingItem(cartItem);
    Alert.alert("Added", item.ingredientName + " added successfully!");
  };

  return (
    <View>
      <View style={styles.category}>
        <Heading title={recipe.category} />
      </View>
      <View style={styles.section}>
        <Text>{recipe.recipeSource}</Text>
      </View>
      {recipe.recipeSourceData != "" && (
        <View style={styles.sourceData}>{getSourceData()}</View>
      )}
      {ingredients.length > 0 ? (
        <View style={styles.ingredientsContainer}>
          <Heading title="Ingredients" />
          {ingredients.map((ing, index) => (
            <IngredientListItem
              key={index}
              item={ing}
              showDelete={false}
              showShoppingCart={true}
              onAddToShoppingCart={handleAddToShoppingCart}
            />
          ))}
        </View>
      ) : null}
      {recipe.comments != "" && (
        <View style={styles.comments}>
          <Heading title="Comments" />
          <Text>{recipe.comments}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  category: {
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientsContainer: {
    borderRadius: 25,
    marginTop: 10,
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sourceData: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: 10,
    height: 50,
  },
  comments: {
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
});
