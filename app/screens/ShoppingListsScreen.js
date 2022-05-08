import React, { Component, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Modal } from "react-native";
const { forEach } = require("p-iteration");

import ShoppingItems from "../components/ShoppingItems";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Screen from "../components/Screen";
import { getIngredients } from "../api/ingredientsApi";
import {
  saveShoppingItem,
  getAllShoppingItems,
  deleteShoppingItemsByUser,
  deleteShoppingItem,
  getTotalCost,
} from "../api/shoppingItemsApi";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import routes from "../navigation/routes";
import ShoppingItemEditor from "../components/ShoppingItemEditor";
import { getCurrentUser } from "../api/userApi";

export default function ShoppingListsScreen({ route, navigation }) {
  const [item, setItem] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shoppingDate, setShoppingDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [showCostList, setShowCostList] = useState(false);

  useEffect(() => {
    (async () => await loadScreen())();
  }, []);

  const loadScreen = async () => {
    try {
      setLoading(true);
      if (route.params) {
        const result = await getIngredients(route.params.id);
        const user = await getCurrentUser();
        await forEach(result, async (ing) => {
          let item = {};
          item.ingredientName = ing.ingredientName;
          item.measure = ing.measure;
          item.qty = ing.qty;
          item.picked = false;
          item.shopping_list_date = new Date().toDateString();
          item.owner_id = user.id;
          item.cost = 0;
          let savedItem = await saveShoppingItem(item);
        });
      }
      await loadItems();
    } catch (e) {
      console.log("ERROR>>>", e);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      const allItems = await getAllShoppingItems(getUserName());
      setItems(allItems);
      const result = await getTotalCost(getUserName());
      console.log(result);
      let total = 0;
      if (result[0].totalCost) total = result[0].totalCost;
      const totalformatted = parseFloat(total).toFixed(2).toLocaleString();
      setTotalCost(totalformatted);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClearItems = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      await deleteShoppingItemsByUser(user.id);
      setItems([]);
      setTotalCost("0.00");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    let msg = "";
    msg = "Are you sure you wish to clear your shopping list? ";

    Alert.alert("Confirm", msg, [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Yes", onPress: () => handleClearItems() },
    ]);
  };

  const handleAddItem = () => {
    setItem({
      id: 0,
      ingredientName: "",
      measure: "each",
      qty: "1",
      cost: "0.00",
      picked: false,
      shopping_list_date: new Date().toDateString(),
      username: getUserName(),
    });
    setModalVisible(true);
  };
  const handleCancelItemEdit = () => {
    setModalVisible(false);
  };
  const handleDeleteItem = async (item) => {
    try {
      await deleteShoppingItem(item.id);
      await loadItems();
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditItem = (item) => {
    //console.log(item);
    setItem(item);
    setModalVisible(true);
  };

  const handleItemUpdated = async () => {
    try {
      setModalVisible(false);
      await loadItems();
    } catch (e) {
      console.log(e);
    }
  };

  const handleItemPicked = async (item) => {
    item.picked = !item.picked;
    try {
      await saveShoppingItem(item);
      await loadItems();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDone = () => {
    navigation.navigate(routes.SEARCH_RECIPE);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen>
        <ScrollView>
          <Heading
            title="Shopping List"
            fontSize={20}
            color={colors.heading}
            icon="shopping-cart"
          />
          <View style={styles.buttonsContainer}>
            <Button
              title="Clear Items"
              onPress={createAlert}
              color="heading"
              fontSize={12}
              width="150"
              icon="trash-alt"
              iconSize={12}
            />
            <Button
              title="Add Item"
              onPress={handleAddItem}
              color="heading"
              fontSize={12}
              width="150"
              icon="plus-square"
              iconSize={12}
            />
          </View>
          <View style={styles.totalCostContainer}>
            <Heading title="TOTAL: " color={colors.heading} fontSize={16} />
            <Heading
              title={totalCost}
              icon="dollar-sign"
              fontSize={16}
              color={colors.heading}
            />
          </View>
          <View style={styles.itemsContainer}>
            <ShoppingItems
              items={items}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
              onItemPicked={handleItemPicked}
            />
          </View>
          <Button title="DONE" onPress={handleDone} color="greenDark" />
          <Modal visible={modalVisible}>
            <ShoppingItemEditor
              item={item}
              onCancel={handleCancelItemEdit}
              OnItemUpdated={handleItemUpdated}
            />
          </Modal>
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemsContainer: {
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  totalCostContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
  },
});
