import React, { Component, useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  FormPicker,
  SubmitButton,
} from "./forms";
import { saveRecipeList, getMealsByUserId } from "../api/recipeListsApi";
import { getCurrentUser } from "../api/userApi";
import Button from "../components/Button";
const validationSchema = Yup.object().shape({
  id: Yup.number().label("Id"),
  recipe_list: Yup.string().required().max(1000).label("Recipe List"),
  owner_id: Yup.number().label("Owner ID"),
});

export default MealsListEditor = ({ mealsList, onCancel, onItemUpdated }) => {
  const ref = useRef(null);

  const handleSubmit = async (item) => {
    try {
      if (!item.owner_id) {
        const user = await getCurrentUser();
        item.owner_id = user.id;
      }
      let savedItem = await saveRecipeList(item);

      onItemUpdated(item);
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Form
        initialValues={{
          id: mealsList.id,
          recipe_list: mealsList.recipe_list,
          owner_id: mealsList.owner_id,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          autoCorrect={false}
          icon="format-list-bulleted"
          name="recipe_list"
          placeholder="Meals List"
          multiline={true}
          height={300}
          textAlignVertical="top"
          ref={ref}
        ></FormField>
        <View style={styles.submit}>
          <SubmitButton title="DONE" color="greenDark" />
          <Button
            title="CANCEL"
            color="greenMedium"
            onPress={() => onCancel()}
          />
        </View>
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
