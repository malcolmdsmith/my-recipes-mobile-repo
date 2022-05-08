import React, { Component, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import Heading from "../components/Heading";
import IngredientListItem from "../components/IngredientListItem";
import { getCurrentUser } from "../api/userApi";
import { saveShoppingItem } from "../api/shoppingItemsApi";
import colors from "../config/colors";

export function ManualEntryCard({ recipe, ingredients }) {
  const getTime = (timetype, time) => {
    return timetype + ": " + time;
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
      <View style={styles.cookTime}>
        <Heading
          title={getTime("Prep-Time", recipe.prepTime)}
          bold="normal"
          fontSize={10}
        >
          <MaterialCommunityIcons name="timer-sand" />
        </Heading>
        <Heading
          title={getTime("Cook-Time", recipe.cookTime)}
          bold="normal"
          fontSize={10}
        >
          <MaterialCommunityIcons name="timer-sand" />
        </Heading>
      </View>
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
      <View style={styles.method}>
        <Heading title="Method" />
        <Text>{recipe.method}</Text>
      </View>
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
  text: { marginBottom: 10 },
  cookTime: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: 10,
  },
  method: {
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: 10,
    paddingTop: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
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
