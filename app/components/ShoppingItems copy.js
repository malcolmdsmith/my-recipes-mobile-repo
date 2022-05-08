import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import Button from "../components/Button";
import Link from "../components/Link";
import Screen from "../components/Screen";
import {
  getByDate,
  saveShoppingItem,
  deleteShoppingItem,
} from "../api/shoppingItemsApi";

export default ShoppingItems = ({ items, navigation }) => {
  //const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //const subscribe = navigation.addListener("focus", () => {
    //(async () => await loadScreen())();
    //});
    //return subscribe;
  }, [navigation]);

  //   const loadScreen = async () => {
  //     try {
  //       setLoading(true);
  //       const items = await getByDate(date);
  //       setItems(items.data);
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleIncreaseQty = () => {};
  const handleDecreaseQty = () => {};
  const handleDelete = () => {};
  const handleEdit = () => {};

  return (
    <>
      <Screen>
        {items.map((item, index) => (
          <View style={styles.row} key={index}>
            <View style={styles.ingredient}>
              <Text>{item.ingredientName}</Text>
            </View>
            <View style={styles.measure}>
              <Text>{item.measure}</Text>
            </View>
            <View style={styles.qty}>
              <Text>{item.qty}</Text>
            </View>
            <View style={styles.addminus}>
              {/* <Button title="+" onPress={handleIncreaseQty} />
              <Button title="-" onPress={handleDecreaseQty} /> */}
              <Link
                title=""
                icon="trash-alt"
                iconSize={10}
                onPress={handleDelete}
              />
              <Link
                title=""
                icon="pencil-alt"
                iconSize={10}
                onPress={handleEdit}
              />
            </View>
          </View>
        ))}
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  ingredient: {
    width: "50%",
  },
  measure: {
    width: "20%",
  },
  qty: {
    width: "10%",
  },
  addminus: {
    flexDirection: "row",
    width: "20%",
  },
});
