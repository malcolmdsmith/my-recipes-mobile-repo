import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Text,
} from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import ActivityIndicator from "../../components/ActivityIndicator";
import colors from "../../config/colors";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import { getRecipes } from "../../api/recipesApi";
import RecipeListItem from "../../components/RecipeListItem";
import CategoryManager from "./CategoryManager";
import RecipeIcon from "../../components/RecipeIcon";
import { getCurrentUser } from "../../api/userApi";
import DropShadow from "../../components/DropShadow";

export default LeftSideBar = ({
  refreshHome,
  onRecipeSelect,
  onNewRecipe,
  onRefreshed,
  onShowShoppingList,
  onHomePress,
  onSearchButton,
}) => {
  const [recipes, setRecipes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const searchRef = useRef();

  useEffect(() => {
    loadRecipes("");
  }, [refreshHome, keywords]);

  const loadRecipes = async (keywords) => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setUser(user);
      const result = await getRecipes(keywords, 1, 1000);
      setRecipes(result.recipes);
      onRefreshed();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleHomePress = () => {
    handleClearSearch();
    onHomePress();
  };

  const handleClearSearch = () => {
    searchRef.current.clear();
    setKeywords("");
    onSearchButton("");
  };

  const handleSubmit = async () => {
    //

    await loadRecipes(keywords);
    onSearchButton(keywords);
  };

  const handleNewRecipe = () => {
    onNewRecipe();
  };
  const handleShoppingList = () => {
    onShowShoppingList();
  };
  const handleRecipeSelect = (recipe) => {
    onRecipeSelect(recipe);
  };
  const handleAddEntry = () => {
    setModalVisible(true);
  };
  const handleCategoryManagerDone = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ImageBackground
        style={styles.imageBackground}
        source={require("../../assets/paper-seamless-background-1380.jpg")}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={handleHomePress}>
            <View style={styles.heading}>
              <Image
                style={styles.banner}
                source={require("../../assets/my-meal-ideas-banner.png")}
              />
              {/* <RecipeIcon />
              <Heading
                title="My Meal IDEAS"
                color={colors.white}
                fontSize={24}
              /> */}
            </View>
            <DropShadow>
              <Image
                style={styles.image}
                source={require("../../assets/cookbook-design.jpeg")}
              />
            </DropShadow>
          </TouchableOpacity>
          <ScrollView style={styles.scroll}>
            <DropShadow>
              <View style={styles.searchBox}>
                <FontAwesome5
                  name="pencil-alt"
                  color={colors.medium}
                  size={16}
                />
                <TextInput
                  autoCorrect={false}
                  icon="pencil"
                  name="search"
                  placeholder="search keywords..."
                  onChangeText={(keywords) => setKeywords(keywords)}
                  ref={searchRef}
                  style={styles.searchText}
                />
                <MaterialCommunityIcons
                  name="close-octagon-outline"
                  size={20}
                  color={colors.medium}
                  onPress={handleClearSearch}
                />
              </View>
            </DropShadow>
            <Button title="SEARCH" icon="search" onPress={handleSubmit} />
            {user.AllowEdits && (
              <View>
                <Button
                  title="NEW RECIPE"
                  onPress={handleNewRecipe}
                  color="heading"
                  icon="plus"
                  fontSize={16}
                />
                <Button
                  title="SHOPPING LIST"
                  onPress={handleShoppingList}
                  color="heading"
                  icon="shopping-cart"
                  fontSize={16}
                />
              </View>
            )}
            <ActivityIndicator visible={loading} />
            <DropShadow>
              <View style={styles.listHeader}>
                <Text style={styles.text}>
                  {recipes.length + " meals found."}
                </Text>
              </View>
            </DropShadow>
            <DropShadow>
              <View style={styles.recipesContainer}>
                {recipes.map((recipe, index) => (
                  <RecipeListItem
                    recipe={recipe}
                    key={index}
                    onRecipeSelect={() => handleRecipeSelect(recipe)}
                    fontColor={colors.heading}
                  />
                ))}
              </View>
            </DropShadow>
          </ScrollView>
        </View>
      </ImageBackground>
      <Modal visible={modalVisible} style={{ margin: 0 }}>
        <View style={styles.categoryManager}>
          <CategoryManager onCategoryManagerDone={handleCategoryManagerDone} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 60,
  },
  container: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "stretch",
    paddingLeft: 20,
    paddingRight: 20,
  },
  categoryManager: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "green",
  },
  image: {
    borderRadius: 20,
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  listHeader: {
    backgroundColor: colors.greenDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 50,
    padding: 15,
    marginTop: 10,
  },
  recipesContainer: {
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 50,
    borderWidth: 2,
    borderColor: colors.greenDark,
  },
  scroll: {
    marginBottom: 100,
    padding: 8,
  },
  searchBox: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.white,
    height: 45,
    borderRadius: 25,
    marginBottom: 5,
  },
  searchText: {
    marginLeft: 5,
    width: 200,
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
  },
});
