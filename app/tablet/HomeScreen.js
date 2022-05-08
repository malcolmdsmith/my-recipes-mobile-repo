import React, { Component, useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

import colors from "../config/colors";
import LeftSideBar from "./components/LeftSideBar";
import RightSideBar from "./components/RightSideBar";
import {
  PANEL_IMAGES,
  VIEW_RECIPE,
  SHOPPING_LIST,
  CATEGORY_IMAGE_PICKER,
} from "./components/constants";
import SignInRegisterToolbar from "../components/SignInRegisterToolbar";
import { getCurrentUser } from "../api/userApi";
import ActivityIndicator from "../components/ActivityIndicator";
import DropdownMenu from "../components/DropdownMenu";

export default HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [recipe, setRecipe] = useState({});
  const [panelType, setPanelType] = useState(PANEL_IMAGES);
  const [refreshHome, setRefreshHome] = useState(false);
  const [showSearching, setShowSearching] = useState(false);
  const [keywords, setKeywords] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      loadScreen();
    });
    return subscribe;
  }, [navigation]);

  const loadScreen = async () => {
    try {
      const user = await getCurrentUser();

      setUser(user);
      setRefreshHome(true);
    } catch (err) {
      console.log("...", err);
    } finally {
    }
  };

  const handleSignInRegoUpdate = async () => {
    const user = await getCurrentUser();
    //
    setUser(user);
    setRefreshHome(true);
    setPanelType(PANEL_IMAGES);
  };

  const handleHomePressed = () => {
    setCurrentPage(0);
    setKeywords(null);
    setRefreshHome(true);
    setPanelType(PANEL_IMAGES);
  };
  const handleRecipeSelect = (recipe, currentPage) => {
    //
    setShowSearching(true);
    setRecipe(recipe);
    setCurrentPage(currentPage);
    setRefreshHome(true);
    setPanelType(VIEW_RECIPE);
  };
  const handleRecipeDeleted = () => {
    setKeywords(null);
    setPanelType(PANEL_IMAGES);
    setRefreshHome(true);
  };
  const handleRecipeAdded = (recipe) => {
    setRecipe(recipe);
    setPanelType(VIEW_RECIPE);
    setRefreshHome(true);
  };
  const handleShowShoppingList = () => {
    setPanelType(SHOPPING_LIST);
  };
  const handleShowCategoriesImagePicker = () => {
    setPanelType(CATEGORY_IMAGE_PICKER);
  };
  const handleShowRecipesForCategory = (keywords) => {
    setShowSearching(true);
    setKeywords(keywords);
    setPanelType(PANEL_IMAGES);
  };

  const handleSearchButton = (keywords) => {
    //
    setShowSearching(true);
    setKeywords(keywords);
    setPanelType(PANEL_IMAGES);
  };

  const handleNavBack = () => {
    setPanelType(PANEL_IMAGES);
  };

  const handleRefreshed = () => {
    setRefreshHome(false);
    setShowSearching(false);
  };

  const handleNewRecipe = () => {
    let recipe = {
      id: 0,
      recipeTitle: "",
      category: "",
      recipeSource: "",
      recipeSourceData: "",
      prepTime: "",
      cookTime: "",
      method: "",
      rating: "",
      comments: "",
      owner_id: 0,
    };
    setRecipe(recipe);
    setPanelType(VIEW_RECIPE);
  };

  const handleMenuUpdate = async () => {
    const user = await getCurrentUser();

    setUser(user);
    setShowMenu(false);
    setRefreshHome(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftPanel}>
        <LeftSideBar
          onRecipeSelect={handleRecipeSelect}
          onNewRecipe={handleNewRecipe}
          refreshHome={refreshHome}
          onRefreshed={() => setRefreshHome(false)}
          onShowShoppingList={handleShowShoppingList}
          onHomePress={handleHomePressed}
          onSearchButton={handleSearchButton}
        />
      </View>
      <View style={styles.rightPanel}>
        <ActivityIndicator visible={showSearching} />
        <View style={styles.header}>
          <DropdownMenu
            user={user}
            showMenu={showMenu}
            onShowMenuDone={(show) => setShowMenu(show)}
            onUpdate={handleMenuUpdate}
          />
        </View>
        <View style={styles.rightContent}>
          <RightSideBar
            recipe={recipe}
            panelType={panelType}
            keywords={keywords}
            currentPage={currentPage}
            refreshPanels={refreshHome}
            onRefreshed={handleRefreshed}
            onRecipeDeleted={handleRecipeDeleted}
            onRecipeAdded={handleRecipeAdded}
            onShowShoppingList={handleShowShoppingList}
            onShowCategoriesImagePicker={handleShowCategoriesImagePicker}
            onShowRecipesForCategory={handleShowRecipesForCategory}
            onRecipeSelect={handleRecipeSelect}
            onNavBack={handleNavBack}
            onSearchLoadDone={() => setShowSearching(false)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  header: {
    backgroundColor: colors.greenMedium,
    height: 40,
    width: "100%",
    padding: 5,
    elevation: 1000,
    zIndex: 1000,
  },
  leftPanel: {
    width: "30%",
    backgroundColor: colors.paleLemon,
  },
  rightPanel: {
    width: "70%",
    backgroundColor: colors.black,
  },
  rightContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
