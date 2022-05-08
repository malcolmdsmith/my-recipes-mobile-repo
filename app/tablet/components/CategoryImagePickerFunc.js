import React, { Component, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { isTablet } from "react-native-device-detection";

import { getRecipeCategories } from "../../api/recipeCategoriesApi";
import CategoryImageItem from "./CategoryImageItem";
import { getS3Image, deleteS3Image } from "../../utility/amplify";

export default CategoryImagePickerFunc = ({ onShowRecipesForCategory }) => {
  const [categoriesx, setCategories] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    console.log("lodaCats");
    let res = await fetch("http://192.168.1.4:4000/api/recipe_categories");
    let cats = await res.json();
    //const cats = await getRecipeCategories();
    for (const category of cats) {
      //console.log("1...", category.category_image);
      const imgUrl = await getS3Image(category.category_image);
      //console.log("2");
      category.imageUrl = imgUrl.split("?")[0];
      //console.log(category);
    }
    console.log("returned");
    setData(cats);
    console.log("set done...", cats);
  };

  const loadViews = () => {
    let i = 0;
    let rowType = "odd";
    let viewRows = [];

    // console.log("lodaCats");
    // let res = await fetch("http://192.168.1.4:4000/api/recipe_categories");
    // let categories = await res.json();
    // //const cats = await getRecipeCategories();
    // for (const category of categories) {
    //   //console.log("1...", category.category_image);
    //   const imgUrl = await getS3Image(category.category_image);
    //   //console.log("2");
    //   category.imageUrl = imgUrl.split("?")[0];
    //   //console.log(category);
    // }

    console.log(data.length);
    while (i < data.length) {
      console.log("//", i);
      if (isTablet) {
        switch (rowType) {
          case "odd":
            if (i == data.length - 1) {
              viewRows.push(renderEvenRow(i, data[i]));
            } else {
              viewRows.push(renderOddRow(i, data[i], data[i + 1]));
              rowType = "even";
              i += 2;
            }
            break;
          case "even":
            viewRows.push(renderEvenRow(i, data[i]));
            rowType = "odd";
            i += 1;
            break;
          default:
            break;
        }
      } else {
        viewRows.push(renderEvenRow(i, data[i]));
      }
    }

    return viewRows;
  };

  const renderOddRow = (i, categoryLeft, categoryRight) => {
    return (
      <View style={styles.oddRow} key={i}>
        <CategoryImageItem
          category={categoryLeft}
          onShowRecipesForCategory={onShowRecipesForCategory}
        />
        <CategoryImageItem
          category={categoryRight}
          onShowRecipesForCategory={onShowRecipesForCategory}
        />
      </View>
    );
  };

  const renderEvenRow = (i, category) => {
    return (
      <View style={styles.evenRow} key={i}>
        <CategoryImageItem
          category={category}
          onShowRecipesForCategory={onShowRecipesForCategory}
        />
      </View>
    );
  };

  return <View style={styles.container}>{loadViews()}</View>;
};

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "red",
    justifyContent: "center",
    padding: 40,
  },
  oddRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  evenRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
