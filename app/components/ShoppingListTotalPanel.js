import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

export default ShoppingListTotalPanel = ({ total }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>TOTAL</Text>
      </View>
      <View style={styles.total}>
        <Text style={styles.totalText}>$ {total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 100 },
  header: {
    backgroundColor: colors.greenMedium,
    padding: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerText: {
    color: colors.white,
    textAlign: "center",
  },
  total: {
    backgroundColor: colors.beige,
    borderLeftWidth: 1,
    borderLeftColor: colors.greenMedium,
    borderRightWidth: 1,
    borderRightColor: colors.greenMedium,
  },
  totalText: {
    color: colors.black,
    padding: 5,
    textAlign: "center",
  },
});
