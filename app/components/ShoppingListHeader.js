import React from "react";
import { View, StyleSheet, Text } from "react-native";

import colors from "../config/colors";

export default ShoppingListHeader = () => {
  return (
    <View style={styles.row}>
      <Text style={[styles.qty, styles.text]}>Qty</Text>
      <Text style={[styles.measure, styles.text]}>Size</Text>
      <Text style={[styles.ingredient, styles.text]}>Ingredient</Text>
      <Text style={[styles.cost, styles.text]}>Cost</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingLeft: 25,
    backgroundColor: colors.greenMedium,
    height: 40,
    alignItems: "center",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: -1000,
    elevation: -1000,
  },
  ingredient: {
    width: "46%",
  },
  measure: {
    width: "17%",
  },
  qty: {
    width: "12%",
  },
  cost: {},
  text: {
    fontSize: 10,
    color: colors.white,
    backgroundColor: colors.greenMedium,
    fontWeight: "bold",
  },
});
