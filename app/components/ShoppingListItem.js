import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

import Link from "../components/Link";
import colors from "../config/colors";

export default ShoppingListItem = ({
  item,
  onDeleteItem,
  onEditItem,
  onItemPicked,
}) => {
  const handleDelete = () => {
    onDeleteItem(item);
  };
  const handleEdit = () => {
    onEditItem(item);
  };
  const handleItemPicked = () => {
    onItemPicked(item);
  };

  const createAlert = async () => {
    let msg = "";
    msg = "Are you sure you wish to delete " + item.ingredientName + "?";

    Alert.alert("Confirm", msg, [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Yes", onPress: () => handleDelete() },
    ]);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          marginRight: 6,
          alignItems: "flex-start",
          backgroundColor: colors.beige,
        }}
      >
        <View>
          <Link
            title=""
            icon="trash-alt"
            iconSize={16}
            onPress={createAlert}
            color={colors.tertiary}
          />
        </View>
        <View>
          <TouchableOpacity onPress={handleItemPicked}>
            <View style={styles(item).row}>
              <View style={styles(item).qty}>
                <Text style={styles(item).text}>{item.qty}</Text>
              </View>
              <View style={styles(item).measure}>
                <Text style={styles(item).text}>{item.measure}</Text>
              </View>
              <View style={styles(item).ingredient}>
                <Text style={styles(item).text}>{item.ingredientName}</Text>
              </View>
              <View style={styles(item).cost}>
                <Text style={styles(item).text}>{item.cost}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Link title="" icon="pencil-alt" onPress={handleEdit} iconSize={14} />
        </View>
      </View>
    </>
  );
};

const styles = (item) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: colors.beige,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 5,
    },
    qty: {
      width: "10%",
      marginLeft: 5,
    },
    measure: {
      width: "20%",
    },
    ingredient: {
      width: "43%",
    },
    cost: {
      width: "17%",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    text: {
      fontSize: 10,
      color: item.picked
        ? colors.medium
        : item.master_list
        ? colors.tertiary
        : "red",
      textDecorationLine: item.picked ? "line-through" : null,
      textDecorationStyle: item.picked ? "solid" : null,
      textDecorationColor: item.picked ? colors.medium : colors.black,
    },
  });
