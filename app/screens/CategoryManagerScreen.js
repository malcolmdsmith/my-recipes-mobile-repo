import React, { Component, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from "react-native";

import CategoryEditor from "../tablet/components/CategoryEditor";
import CategoryCard from "../tablet/components/CategoryCard";
import {
  getRecipeCategories,
  deleteCategory,
} from "../api/recipeCategoriesApi";
import routes from "../navigation/routes";

export default function CategoryManagerScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => await loadCategories())();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await getRecipeCategories();
      setCategories(cats);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCategoryAdded = async () => {
    await loadCategories();
    //onCategoryManagerDone();
  };

  const handleCategoryCancel = () => {
    //onCategoryManagerDone();
    navigation.navigate(routes.SEARCH_RECIPE);
  };

  const handleDeleteCategory = async (category) => {
    await deleteCategory(category.category_name);
    await loadCategories();
  };

  return (
    <ImageBackground
      style={styles.imageBackground}
      source={require("../assets/paper-seamless-background-1380.jpg")}
    >
      <SafeAreaView
        style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 30 }}
      >
        {/* <View style={styles.container}> */}
        <ScrollView style={{ marginBottom: 0 }}>
          <View style={styles.editor}>
            <CategoryEditor
              onCategoryAdded={handleCategoryAdded}
              onCategoryCancel={handleCategoryCancel}
            />
          </View>
          <View style={styles.cards}>
            {categories.map((category, index) => (
              <CategoryCard
                category={category}
                key={index}
                onDeleteCategory={handleDeleteCategory}
              />
            ))}
          </View>
        </ScrollView>
        {/* </View> */}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cards: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editor: {
    //flexGrow: 1,
    marginTop: 30,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
});
