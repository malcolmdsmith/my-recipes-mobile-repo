import React, { Component, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { isTablet } from "react-native-device-detection";

import CategoryCard from "./CategoryCard";
import CategoryEditor from "./CategoryEditor";
import {
  getRecipeCategories,
  deleteCategory,
} from "../../api/recipeCategoriesApi";
import colors from "../../config/colors";

export default CategoryManager = ({ onCategoryManagerDone }) => {
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
    onCategoryManagerDone();
  };

  const handleDeleteCategory = async (category) => {
    await deleteCategory(category.category_name);
    await loadCategories();
  };

  return (
    <ImageBackground
      style={styles.imageBackground}
      source={require("../../assets/paper-seamless-background-1380.jpg")}
    >
      <View style={styles.container}>
        <View style={styles.leftPanel}>
          <CategoryEditor
            onCategoryAdded={handleCategoryAdded}
            onCategoryCancel={handleCategoryCancel}
          />
        </View>
        <View style={styles.rightPanel}>
          {
            <ScrollView style={{ marginBottom: 50 }}>
              {categories.map((category, index) => (
                <CategoryCard
                  category={category}
                  key={index}
                  onDeleteCategory={handleDeleteCategory}
                />
              ))}
            </ScrollView>
          }
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: isTablet ? "row" : "column",
    //   flexWrap: isTablet ? "nowrap" : "wrap",
    // justifyContent: "center",
    // alignItems: "center",
    //backgroundColor: colors.paleLemon,
    paddingTop: 20,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  leftPanel: {
    // flex: 1,
    width: isTablet ? "50%" : "90%",
    //backgroundColor: "blue",
    //height: 100,
  },
  rightPanel: {
    // flex: 1,
    width: isTablet ? "50%" : "90%",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    marginTop: 40,
    //backgroundColor: "green",
    //height: isTablet ? "100%" : 400,
  },
});
