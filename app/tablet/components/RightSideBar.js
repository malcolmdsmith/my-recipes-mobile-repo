import React, { Component, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import ViewRecipePanel from "./ViewRecipePanel";
import RecipeImageViewer from "../../components/RecipeImageViewer";
import ImagesPanel from "./ImagesPanel";
import {
  PANEL_IMAGES,
  VIEW_RECIPE,
  SHOPPING_LIST,
  CATEGORY_IMAGE_PICKER,
} from "./constants";
import ShoppingListPanel from "./ShoppingListPanel";
import CategoryImagePicker from "./CategoryImagePicker";

export default RightSideBar = ({
  recipe,
  panelType,
  keywords,
  refreshPanels,
  onRefreshed,
  onRecipeDeleted,
  onRecipeAdded,
  onShowShoppingList,
  onShowCategoriesImagePicker,
  onShowRecipesForCategory,
  onRecipeSelect,
  onNavBack,
  onSearchLoadDone,
  currentPage,
}) => {
  const panel = () => {
    switch (panelType) {
      case PANEL_IMAGES:
        return (
          <ImagesPanel
            keywords={keywords}
            onShowCategoriesImagePicker={onShowCategoriesImagePicker}
            onRecipeSelect={onRecipeSelect}
            currentPage={currentPage}
            onSearchLoadDone={onSearchLoadDone}
          />
        );
      case VIEW_RECIPE:
        return (
          <ViewRecipePanel
            recipe={recipe}
            refreshPanels={refreshPanels}
            onRefreshed={onRefreshed}
            onRecipeDeleted={onRecipeDeleted}
            onRecipeAdded={onRecipeAdded}
            onShowShoppingList={onShowShoppingList}
            onNavBack={onNavBack}
          />
        );
      case SHOPPING_LIST:
        return <ShoppingListPanel />;
      case CATEGORY_IMAGE_PICKER:
        return (
          <CategoryImagePicker
            onShowRecipesForCategory={onShowRecipesForCategory}
          />
        );
      default:
        return null;
    }
  };
  return <View style={styles.container}>{panel()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
});
