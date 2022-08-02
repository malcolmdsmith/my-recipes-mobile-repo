import React, { Component, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  FormPicker,
  SubmitButton,
} from "../components/forms";
import QuantityIncrementor from "./QuantityIncrementor";
import Button from "../components/Button";
import colors from "../config/colors";
import { updateCost, saveShoppingItem } from "../api/shoppingItemsApi";
import { isTablet } from "react-native-device-detection";
import { getCurrentUser } from "../api/userApi";

const validationSchema = Yup.object().shape({
  id: Yup.number().label("Id"),
  shopping_list_name: Yup.string()
    .required()
    .max(30)
    .label("Shopping List Name"),
  ingredientName: Yup.string().required().max(100).label("Ingredient"),
  measure: Yup.string().required().label("Size"),
  qty: Yup.number().required().label("Qty"),
  cost: Yup.number().required().label("Price"),
  owner_id: Yup.number().label("Owner ID"),
  picked: Yup.bool().required().label("Picked"),
  shopping_list_date: Yup.date().label("Date"),
  master_list: Yup.bool().required().label("Master List"),
});

export default ShoppingItemEditor = ({
  item,
  onCancel,
  onItemUpdated,
  onAddToShoppingList,
}) => {
  const [newItem, setNewItem] = useState(null);
  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = (formdata) => {
    SubmitItem(formdata);
  };

  const SubmitItem = async (item) => {
    try {
      let isNew = false;
      if (item.id === 0) isNew = true;
      if (!item.owner_id) {
        const user = await getCurrentUser();
        item.owner_id = user.id;
      }
      let savedItem = await saveShoppingItem(item);
      if (savedItem.cost > 0) updateCost(savedItem);

      if (isNew) onAddToShoppingList(savedItem);
      else onItemUpdated(savedItem);
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Form
          initialValues={{
            id: item.id,
            shopping_list_name: item.shopping_list_name,
            ingredientName: item.ingredientName,
            qty: item.qty.toString(),
            measure: item.measure,
            cost: item.cost.toString(),
            picked: item.picked,
            owner_id: item.owner_id,
            shopping_list_date: item.shopping_list_date,
            master_list: item.master_list,
          }}
          resetValues={{
            id: 0,
            shopping_list_name: "",
            ingredientName: "",
            qty: "1",
            measure: "",
            cost: "0.00",
            picked: false,
            shopping_list_date: "",
            master_list: true,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <FormField
            autoCorrect={false}
            icon="bread-slice-outline"
            name="ingredientName"
            placeholder="Ingredient Name"
          />
          <FormField
            autoCorrect={false}
            name="measure"
            icon="scale"
            placeholder="Size"
            selectTextOnFocus
          />
          <QuantityIncrementor
            autoCorrect={false}
            icon="counter"
            name="qty"
            placeholder="Qty"
            width={140}
            keyboardType="number-pad"
          />
          <FormField
            autoCorrect={false}
            icon="currency-usd"
            name="cost"
            placeholder="Price $0.00"
            width={140}
            keyboardType="number-pad"
            selectTextOnFocus
          />
          <View style={styles.submit}>
            <SubmitButton title="DONE" color="greenDark" />
            <Button title="CANCEL" color="greenDark" onPress={handleCancel} />
          </View>
        </Form>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    width: isTablet ? "40%" : "90%",
    backgroundColor: colors.greenMedium,
    borderRadius: 20,
    padding: 15,
  },
  submit: {},
});
