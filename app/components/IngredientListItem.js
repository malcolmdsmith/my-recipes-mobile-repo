import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";

import colors from "../config/colors";

export default function IngredientListItem({
  item,
  showDelete,
  onIngredientDelete,
  showShoppingCart,
  onAddToShoppingCart,
}) {
  return (
    <View>
      <Text style={styles.text}>
        {showDelete && (
          <TouchableOpacity onPress={() => onIngredientDelete(item)}>
            <FontAwesome5 name="trash-alt" color={colors.tertiary} size={19} />
          </TouchableOpacity>
        )}
        {showShoppingCart && (
          <TouchableOpacity onPress={() => onAddToShoppingCart(item)}>
            <FontAwesome5
              name="shopping-cart"
              color={colors.tertiary}
              size={19}
            />
          </TouchableOpacity>
        )}
        <Entypo name="dot-single" size={16} />
        {item.qty + " x " + item.measure + " " + item.ingredientName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: { marginBottom: 10, marginRight: 10 },
});
