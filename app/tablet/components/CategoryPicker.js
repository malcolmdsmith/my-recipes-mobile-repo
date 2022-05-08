import React, { Component, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Form, FormPicker } from "../../components/forms";
import { getRecipeCategoryNames } from "../../api/recipeCategoriesApi";

export default CategoryPicker = ({ onCategoryPicked, onAddEntry }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    (async function () {
      const list = await getRecipeCategoryNames();
      const categories = list.map((item) => item.category_name);
      setCategories(categories);
    })();
  }, []);

  const handleSubmit = (category) => {
    onCategoryPicked(category);
  };

  return (
    <View style={styles.container}>
      <Form
        initialValues={{ category: "" }}
        onSubmit={handleSubmit}
        showClearButton={false}
      >
        <FormPicker
          items={categories}
          name="category"
          icon="clipboard-list-outline"
          numberOfColumns={1}
          placeholder="Category"
          submitOnSelect={true}
          onAddEntry={onAddEntry}
        />
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
