import React from "react";
import { View, Text, StyleSheet } from "react-native";

import ShoppingListItem from "./ShoppingListItem";

export default ShoppingItems = ({
  items,
  onDeleteItem,
  onEditItem,
  onItemPicked,
}) => {
  const handleDeleteItem = (item) => {
    onDeleteItem(item);
  };
  const handleEditItem = (item) => {
    onEditItem(item);
  };
  const handleItemPicked = (item) => {
    onItemPicked(item);
  };

  return (
    <>
      {items.length === 0 && (
        <Text style={{ marginLeft: 25, marginTop: 10 }}>Nil.</Text>
      )}
      {items.map((item, index) => (
        <ShoppingListItem
          item={item}
          key={index}
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
          onItemPicked={handleItemPicked}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({});
