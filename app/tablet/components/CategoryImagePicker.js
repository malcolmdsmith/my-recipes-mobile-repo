import React, { Component, setState } from "react";
import { View, StyleSheet } from "react-native";
import { isTablet } from "react-native-device-detection";

import { getRecipeCategories } from "../../api/recipeCategoriesApi";
import CategoryImageItem from "./CategoryImageItem";
import { getS3Image, deleteS3Image } from "../../utility/amplify";

class CategoryImagePicker extends Component {
  state = {
    categories: [],
  };

  componentDidMount() {
    this.getCategories();
  }

  getCategories = async () => {
    console.log("loadCats");
    let res = await fetch("http://192.168.1.4:4000/api/recipe_categories");
    let categories = await res.json();
    for (const category of categories) {
      const imgUrl = await getS3Image(category.category_image);
      category.imageUrl = imgUrl.split("?")[0];
    }
    console.log("returned");
    //this.setState({ categories });
    console.log("set done...", categories);
  };

  loadViews() {
    let i = 0;
    let rowType = "odd";
    let viewRows = [];

    const { categories } = this.state;

    console.log(categories.length);
    while (i < categories.length) {
      console.log("//", i);
      if (isTablet) {
        switch (rowType) {
          case "odd":
            if (i == categories.length - 1) {
              viewRows.push(this.renderEvenRow(i, categories[i]));
            } else {
              viewRows.push(
                this.renderOddRow(i, categories[i], categories[i + 1])
              );
              rowType = "even";
              i += 2;
            }
            break;
          case "even":
            viewRows.push(this.renderEvenRow(i, categories[i]));
            rowType = "odd";
            i += 1;
            break;
          default:
            break;
        }
      } else {
        viewRows.push(this.renderEvenRow(i, categories[i]));
      }
    }

    return viewRows;
  }

  handleShowRecipesForCategory = (category) => {
    this.props.onShowRecipesForCategory(category);
  };

  renderOddRow(i, categoryLeft, categoryRight) {
    return (
      <View style={styles.oddRow} key={i}>
        <CategoryImageItem
          category={categoryLeft}
          onShowRecipesForCategory={() =>
            this.handleShowRecipesForCategory(categoryLeft)
          }
        />
        <CategoryImageItem
          category={categoryRight}
          onShowRecipesForCategory={() =>
            this.handleShowRecipesForCategory(categoryRight)
          }
        />
      </View>
    );
  }

  renderEvenRow(i, category) {
    return (
      <View style={styles.evenRow} key={i}>
        <CategoryImageItem
          category={category}
          onShowRecipesForCategory={() =>
            this.handleShowRecipesForCategory(category)
          }
        />
      </View>
    );
  }

  render() {
    return <View style={styles.container}>{this.loadViews()}</View>;
  }
}

export default CategoryImagePicker;

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
