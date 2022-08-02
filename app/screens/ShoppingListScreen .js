import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  ImageBackground,
  TextInput,
  Text,
} from "react-native";
const { forEach } = require("p-iteration");

import ShoppingItems from "../components/ShoppingItems";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Screen from "../components/Screen";
import Picker from "../components/picker/Picker";
import {
  saveShoppingItem,
  getAllShoppingItems,
  deleteShoppingItemsByUser,
  deleteShoppingItem,
  getTotalCost,
  findIngredientShoppingList,
  clearPickedItems,
  updateMasterListToShoppingList,
} from "../api/shoppingItemsApi";
import {
  getAllShoppingLists,
  saveShoppingList,
  deleteShoppingList,
} from "../api/shoppingListsApi";
import { getMealsByUserId } from "../api/recipeListsApi";
import { getCurrentUser } from "../api/userApi";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";
import routes from "../navigation/routes";
import ShoppingItemEditor from "../components/ShoppingItemEditor";
import ShoppingListHeader from "../components/ShoppingListHeader";
import ShoppingListTotalPanel from "../components/ShoppingListTotalPanel";
import MealsListEditor from "../components/MealsListEditor";

export default function ShoppingListScreen({ navigation }) {
  const [item, setItem] = useState({});
  const [masterItems, setMasterItems] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shoppingDate, setShoppingDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [totalMasterCost, setTotalMasterCost] = useState(0);
  const [totalListCost, setTotalListCost] = useState(0);
  const [user, setUser] = useState({});
  const [showCostList, setShowCostList] = useState(true);
  const [listNames, setListNames] = useState([]);
  const [selectedShoppingList, setSelectedShoppingList] = useState("");
  const [shoplistTextInput, setShopListTextInput] = useState("");
  const [mealsEditorVisible, setMealsEditorVisible] = useState(false);
  const [mealsList, setMealsList] = useState(null);
  const [mealsYPos, setMealsYPos] = useState(0);
  const [time, setTime] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    console.info("useEffect...");
    (async () => await loadScreen())();
  }, []);

  const loadScreen = async () => {
    try {
      console.log("loadScreen...");

      setLoading(true);
      const user = await getCurrentUser();
      setUser(user);
      await loadItems("");
    } catch (e) {
      console.log("ERROR>>>", e);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (shoplist) => {
    try {
      const user = await getCurrentUser();
      const meals = await getMealsByUserId(user.id);
      //console.log("meals...", meals);
      setMealsList(meals);
      const names = await getAllShoppingLists(user.id, 0);
      setListNames(names.map((n) => n.shopping_list_name));

      if (shoplist === "") {
        if (names.length > 0) shoplist = names[0].shopping_list_name;
        setSelectedShoppingList(shoplist);
      }

      const items = await getAllShoppingItems(user.id, shoplist, true);
      const masterItems = items.filter((item) => item.master_list === 1);
      setMasterItems(masterItems);
      const listItems = items.filter((item) => item.master_list === 0);
      setListItems(listItems);

      let totalformatted = 0;
      if (masterItems.length > 0) {
        totalformatted = parseFloat(masterItems[0].totalCost)
          .toFixed(2)
          .toLocaleString();
        setTotalMasterCost(totalformatted);
      }
      if (listItems.length > 0) {
        totalformatted = parseFloat(listItems[0].totalCost)
          .toFixed(2)
          .toLocaleString();
        setTotalListCost(totalformatted);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClearItems = async () => {
    try {
      setLoading(true);
      await clearPickedItems(user.id, 1);
      await loadItems(selectedShoppingList);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (msg, func) => {
    Alert.alert("Confirm", msg, [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Yes", onPress: () => func() },
    ]);
  };

  const handleClearShoppingList = async () => {
    await deleteShoppingItemsByUser(user.id, 0, selectedShoppingList);
    await loadItems(selectedShoppingList);
  };

  const handleAddItem = () => {
    setItem({
      id: 0,
      shopping_list_name: "master",
      ingredientName: "",
      measure: "each",
      qty: "1",
      cost: "0.00",
      picked: false,
      shopping_list_date: new Date().toDateString(),
      owner_id: user.id,
      master_list: true,
    });
    setModalVisible(true);
  };
  const handleCancelItemEdit = () => {
    setModalVisible(false);
  };

  const handleListItemPicked = async (item) => {
    item.picked = !item.picked;
    try {
      await saveShoppingItem(item);

      await loadItems(selectedShoppingList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      await deleteShoppingItem(item.id);
      await loadItems(selectedShoppingList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditItem = (item) => {
    setItem(item);
    setModalVisible(true);
  };

  const handleItemUpdated = async () => {
    try {
      setModalVisible(false);
      await loadItems(selectedShoppingList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMasterItemPicked = async (item) => {
    if (item.picked) {
      item.picked = false;
      await saveShoppingItem(item);
      await loadItems(selectedShoppingList);
      return;
    }

    item.picked = !item.picked;
    try {
      await saveShoppingItem(item);

      await createShoppingListItem(item);
      await loadItems(selectedShoppingList);
    } catch (e) {
      console.log(e);
    }
  };

  const createShoppingListItem = async (masterItem) => {
    const masterItems = await findIngredientShoppingList(
      user.id,
      1,
      masterItem.ingredientName,
      selectedShoppingList
    );
    if (masterItems.length > 0) {
      Alert.alert(
        "Master ingredient",
        "Ths ingredient is already in your list."
      );
      return;
    }

    let item = {};
    item.shopping_list_name = selectedShoppingList;
    item.ingredientName = masterItem.ingredientName;
    item.measure = masterItem.measure;
    item.qty = masterItem.qty;
    item.picked = false;
    item.shopping_list_date = new Date().toDateString();
    item.owner_id = user.id;
    item.cost = masterItem.cost;
    item.master_list = false;
    await saveShoppingItem(item);
  };

  const handleDone = () => {
    navigation.navigate(routes.SEARCH_RECIPE);
  };

  const handleSelectedShoppingList = async (item) => {
    setSelectedShoppingList(item);
    await loadItems(item);
  };

  const handleShoppingListNameSubmit = async () => {
    if (shoplistTextInput === "") return;
    setListModalVisible(false);
    const item = {
      shopping_list_name: shoplistTextInput,
      owner_id: user.id,
      master_list: false,
    };
    await saveShoppingList(item);
    setSelectedShoppingList(shoplistTextInput);
    setShopListTextInput("");
    await loadItems(shoplistTextInput);
  };

  const handleTextChange = (text) => {
    setShopListTextInput(text);
  };

  const handleDeleteShoppingList = async () => {
    await deleteShoppingItemsByUser(user.id, 0, selectedShoppingList);
    await deleteShoppingList(user.id, selectedShoppingList);
    await loadItems("");
  };

  const handleAddToShoppingList = async (newItem) => {
    console.info("newItem...", newItem);
    setModalVisible(false);
    await createShoppingListItem(newItem);
    await loadItems(selectedShoppingList);
  };

  const handleCancelMealsEdit = () => {
    setMealsEditorVisible(false);
  };
  const handleMealsUpdated = (item) => {
    setMealsList(item);
    setMealsEditorVisible(false);
  };

  const showsMealsEditor = async () => {
    setMealsEditorVisible(true);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          ref={scrollViewRef}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Heading
              title="SHOPPING MANAGER"
              fontSize={24}
              color={colors.heading}
              icon="shopping-cart"
              iconSize={36}
              textAlign="center"
            />
          </View>
          <Heading
            title="MASTER LIST"
            color={colors.heading}
            fontSize={18}
            icon="clipboard-list"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 30,
            }}
          >
            <Button
              title="Unpick Items"
              onPress={() =>
                createAlert(
                  "Are you sure you wish to clear your selected master list items? ",
                  handleClearItems
                )
              }
              color="heading"
              fontSize={11}
              width={180}
              icon="list"
              iconSize={12}
            />
            <Button
              title="Add Item"
              onPress={handleAddItem}
              color="heading"
              fontSize={11}
              width={150}
              icon="plus"
              iconSize={12}
            />
          </View>
          <Button title="DONE" onPress={handleDone} color="greenDark" />
          <Button
            title="Go to Meals List"
            onPress={() => {
              scrollViewRef.current?.scrollTo({ y: mealsYPos });
            }}
            color="greenDark"
          />
          <View style={styles.headerContainer}>
            <ShoppingListTotalPanel total={totalMasterCost} />
          </View>
          <ShoppingListHeader />
          <View style={styles.itemsContainer}>
            <ShoppingItems
              items={masterItems}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
              onItemPicked={handleMasterItemPicked}
            />
          </View>
          <Button title="DONE" onPress={handleDone} color="greenDark" />
          <View
            style={styles.mealsList}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setMealsYPos(layout.y);
            }}
          >
            <Heading
              title="MEALS LIST"
              color={colors.heading}
              fontSize={22}
              icon="list"
              iconSize={24}
            />
            <Text>{mealsList && mealsList.recipe_list}</Text>
          </View>
          <Button
            title="Edit Meals"
            onPress={showsMealsEditor}
            color="greenMedium"
          />
          <View style={styles.button}>
            <Button
              title="TOP"
              onPress={() => {
                scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
              }}
              color="greenDark"
            />
          </View>
          <View style={styles.shoppingListContainer}>
            <Heading
              title="SHOPPING LIST"
              color={colors.heading}
              fontSize={22}
              icon="shopping-cart"
              iconSize={24}
            />
            <View style={styles.picker}>
              <Picker
                title=""
                items={listNames}
                selectedItem={selectedShoppingList}
                onSelectItem={handleSelectedShoppingList}
                width="94%"
                listWidth="85%"
              />
            </View>
            <View style={styles.listbuttonsContainer}>
              <Button
                title="New List"
                icon="plus"
                iconSize={12}
                width={155}
                color="heading"
                fontSize={11}
                onPress={() => setListModalVisible(true)}
              />
              <Button
                title="DELETE LIST"
                icon="trash-alt"
                iconSize={12}
                width={155}
                color="heading"
                fontSize={11}
                onPress={() =>
                  createAlert(
                    "Are you sure you wish to delete '" +
                      selectedShoppingList +
                      "' shopping list? ",
                    handleDeleteShoppingList
                  )
                }
              />
            </View>
            <View style={styles.totalListCostContainer}>
              <Button
                title="Clear List"
                onPress={() =>
                  createAlert(
                    "Are you sure you wish to clear all '" +
                      selectedShoppingList +
                      "' shopping list items? ",
                    handleClearShoppingList
                  )
                }
                color="heading"
                fontSize={11}
                width={155}
                icon="trash-alt"
                iconSize={12}
              />
              <ShoppingListTotalPanel total={totalListCost} />
            </View>
            <ShoppingListHeader />
            <View style={styles.itemsContainer}>
              <ShoppingItems
                items={listItems}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleEditItem}
                onItemPicked={handleListItemPicked}
              />
            </View>
            <Button title="DONE" onPress={handleDone} color="greenDark" />
            <Button
              title="TOP"
              onPress={() => {
                scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
              }}
              color="greenDark"
            />
          </View>
          <Modal visible={modalVisible}>
            <ImageBackground
              style={styles.imageBackground}
              source={require("../assets/cookbook-design.jpeg")}
            >
              <View style={styles.modalContainer}>
                <ShoppingItemEditor
                  item={item}
                  onCancel={handleCancelItemEdit}
                  onItemUpdated={handleItemUpdated}
                  onAddToShoppingList={handleAddToShoppingList}
                />
              </View>
            </ImageBackground>
          </Modal>
          <Modal visible={mealsEditorVisible}>
            <ImageBackground
              style={styles.imageBackground}
              source={require("../assets/cookbook-design.jpeg")}
            >
              <View style={styles.modalContainer}>
                <MealsListEditor
                  mealsList={mealsList}
                  onCancel={handleCancelMealsEdit}
                  onItemUpdated={handleMealsUpdated}
                />
              </View>
            </ImageBackground>
          </Modal>
          <Modal visible={listModalVisible}>
            <ImageBackground
              style={styles.imageBackground}
              source={require("../assets/cookbook-design.jpeg")}
            >
              <View style={styles.modalContainer}>
                <View style={styles.shoppinglistEditContainer}>
                  <TextInput
                    placeholder="Shopping list name"
                    onChangeText={handleTextChange}
                    value={shoplistTextInput}
                    width={200}
                    backgroundColor="white"
                    height={50}
                    borderColor="#000"
                    borderWidth={1}
                    maxLength={30}
                  />
                  <View style={{ marginTop: 30 }}>
                    <Button
                      title="OK"
                      color="heading"
                      onPress={handleShoppingListNameSubmit}
                    />
                    <Button
                      title="CANCEL"
                      color="heading"
                      onPress={() => setListModalVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </ImageBackground>
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
  button: {
    marginTop: 25,
  },
  costListContainer: {
    borderRadius: 25,
    padding: 15,
    marginTop: 20,
    backgroundColor: colors.white,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 40,
  },
  itemsContainer: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 10,
    paddingRight: 20,
    minHeight: 200,
    marginBottom: 10,
    borderColor: colors.greenMedium,
    borderWidth: 2,
    zIndex: -1000,
    elevation: -1000,
  },
  imageBackground: {
    flex: 1,
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listbuttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: -1000,
    elevation: -1000,
    marginBottom: 25,
  },
  mealsList: {
    backgroundColor: colors.white,
    paddingLeft: 20,
    borderRadius: 20,
    height: 300,
    marginTop: 30,
  },
  picker: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  shoppingListContainer: {
    marginTop: 40,
  },
  shoppinglistEditContainer: {
    height: 300,
    padding: 30,
    backgroundColor: colors.greenMedium,
    borderRadius: 25,
  },
  totalCostContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    marginRight: 20,
  },
  totalListCostContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    //alignItems: "baseline",
    marginRight: 20,
    zIndex: -100,
    elevation: -100,
  },
});
