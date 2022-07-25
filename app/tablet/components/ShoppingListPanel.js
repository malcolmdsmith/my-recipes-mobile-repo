import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  ImageBackground,
  TextInput,
} from "react-native";

import ShoppingItemEditor from "../../components/ShoppingItemEditor";
import {
  saveShoppingItem,
  getAllShoppingItems,
  deleteShoppingItemsByUser,
  deleteShoppingItem,
  findIngredientShoppingList,
} from "../../api/shoppingItemsApi";
import {
  getAllShoppingLists,
  saveShoppingList,
  deleteShoppingList,
} from "../../api/shoppingListsApi";

import { getCurrentUser } from "../../api/userApi";
import ActivityIndicator from "../../components/ActivityIndicator";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import colors from "../../config/colors";
import { getScreenWidth } from "../../utility/dimensions";
import Picker from "../../components/picker/Picker";
import { isTablet } from "react-native-device-detection";

export default ShoppingListPanel = () => {
  const [item, setItem] = useState({});
  const [masterItems, setMasterItems] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({});
  const [totalListCost, setTotalListCost] = useState(0);
  const [totalMasterCost, setTotalMasterCost] = useState(0);
  const [listNames, setListNames] = useState([]);
  const [selectedShoppingList, setSelectedShoppingList] = useState("");
  const [listModalVisible, setListModalVisible] = useState(false);
  const [shoplistTextInput, setShopListTextInput] = useState("");

  useEffect(() => {
    (async () => await loadScreen())();
  }, []);

  const loadScreen = async () => {
    try {
      setLoading(true);
      await loadItems("");
    } catch (e) {
      console.log("ERROR>>>", e);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (shoplist) => {
    try {
      console.info("loadItems...");
      setLoading(true);
      const user = await getCurrentUser();
      setUser(user);
      const names = await getAllShoppingLists(user.id, 0);
      setListNames(names.map((n) => n.shopping_list_name));

      if (shoplist === "") {
        shoplist = names[0].shopping_list_name;
        setSelectedShoppingList(shoplist);
      }

      // console.info("StartProcess...");
      const items = await getAllShoppingItems(user.id, shoplist, true);
      const masterItems = []; //items.filter((item) => item.master_list === 1);
      for (let i = 0; i < items.length; i++) {
        if (items[i].master_list === 1) masterItems.push(items[i]);
      }
      // console.info("EndProcess...", masterItems.length);
      setMasterItems(masterItems);

      const listItems = items.filter((item) => item.master_list === 0);
      setListItems(listItems);
      let totalformatted = 0;
      if (masterItems.length > 0) {
        totalformatted = parseFloat(masterItems[0].totalCost)
          .toFixed(2)
          .toLocaleString();
        setTotalMasterCost(totalformatted);
      } else setTotalMasterCost(0);
      if (listItems.length > 0) {
        totalformatted = parseFloat(listItems[0].totalCost)
          .toFixed(2)
          .toLocaleString();
        setTotalListCost(totalformatted);
      } else setTotalListCost(0);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
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

  const handleDeleteItem = async (item) => {
    try {
      await deleteShoppingItem(item.id);
      await loadItems(selectedShoppingList);
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
      await loadItems(selectedShoppingList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClearShoppingList = async () => {
    await deleteShoppingItemsByUser(user.id, 0, selectedShoppingList);
    await loadItems(selectedShoppingList);
  };

  const handleItemPicked = async (item) => {
    item.picked = !item.picked;
    try {
      await saveShoppingItem(item);
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
    if (masterItems.legth > 0) {
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

  const handleListItemPicked = async (item) => {
    item.picked = !item.picked;
    try {
      await saveShoppingItem(item);

      await loadItems(selectedShoppingList);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectedShoppingList = async (item) => {
    setSelectedShoppingList(item);
    await loadItems(item);
  };

  const handleShoppingListNameSubmit = async () => {
    if (shoplistTextInput === "") return;
    setLoading(true);
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
    setLoading(false);
  };

  const handleTextChange = (text) => {
    setShopListTextInput(text);
  };

  const handleDeleteShoppingList = async () => {
    setLoading(true);
    await deleteShoppingItemsByUser(user.id, 0, selectedShoppingList);
    await deleteShoppingList(user.id, selectedShoppingList);
    await loadItems("");
    setLoading(false);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <View style={styles.container}>
        <View style={styles.masterContainer}>
          <Heading
            title="MASTER LIST"
            fontSize={20}
            color={colors.white}
            icon="clipboard-list"
          />
          <View style={styles.buttonsContainer}>
            <Button
              title="Unpick Items"
              onPress={() =>
                createAlert(
                  "Are you sure you wish to unpick all master items?",
                  handleClearItems
                )
              }
              color="heading"
              fontSize={12}
              width={165}
              icon="trash-alt"
              iconSize={12}
            />
            <Button
              title="Add Item"
              onPress={handleAddItem}
              color="heading"
              fontSize={12}
              width={135}
              icon="plus-square"
              iconSize={12}
            />
          </View>

          <View style={styles.masterHeaderContainer}>
            <ShoppingListTotalPanel total={totalMasterCost} />
          </View>

          <ShoppingListHeader />
          <ScrollView>
            <View style={styles.itemsContainer}>
              <ShoppingItems
                items={masterItems}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleEditItem}
                onItemPicked={handleMasterItemPicked}
              />
            </View>
          </ScrollView>
        </View>
        <View style={styles.listContainer}>
          <Heading
            title="SHOPPING LISTS"
            fontSize={20}
            color={colors.white}
            icon="shopping-cart"
          />
          <Picker
            title=""
            items={listNames}
            selectedItem={selectedShoppingList}
            onSelectItem={handleSelectedShoppingList}
            width="94%"
            listWidth="85%"
          />
          <View style={styles.buttonsContainer}>
            <Button
              title="DELETE LIST"
              onPress={() =>
                createAlert(
                  "Are you sure you wish to delete '" +
                    selectedShoppingList +
                    "' shopping list?",
                  handleDeleteShoppingList
                )
              }
              color="heading"
              fontSize={12}
              width={150}
              icon="trash-alt"
              iconSize={12}
            />
            <Button
              title="NEW LIST"
              onPress={() => setListModalVisible(true)}
              color="heading"
              fontSize={12}
              width={150}
              icon="plus"
              iconSize={12}
            />
          </View>

          <View style={styles.listHeaderContainer}>
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
          <ScrollView>
            <View style={styles.itemsContainer}>
              <ShoppingItems
                items={listItems}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleEditItem}
                onItemPicked={handleListItemPicked}
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <Modal visible={modalVisible}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../../assets/cookbook-design.jpeg")}
        >
          <ShoppingItemEditor
            item={item}
            onCancel={handleCancelItemEdit}
            onItemUpdated={handleItemUpdated}
          />
        </ImageBackground>
      </Modal>
      <Modal visible={listModalVisible}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../../assets/cookbook-design.jpeg")}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    flexDirection: "row",
    elevation: -1000,
    zIndex: -1000,
  },
  masterHeaderContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 40,
    elevation: -1000,
    zIndex: -1000,
  },
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 40,
    elevation: -1000,
    zIndex: -1000,
  },
  itemsContainer: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.greenMedium,
    padding: 10,
    elevation: -1000,
    zIndex: -1000,
  },
  totalCostContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
  listContainer: {
    flexDirection: "column",
    marginTop: 10,
    width: "49%",
  },
  list: {
    alignSelf: "stretch",
    width: getScreenWidth(80) * (0.7 / 2),
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: 20,
    //marginRight: 20,
    padding: 10,
  },
  masterContainer: {
    width: "49%",
  },
  imageBackground: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
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
    padding: 50,
    backgroundColor: colors.greenMedium,
    borderRadius: 25,
  },
});
