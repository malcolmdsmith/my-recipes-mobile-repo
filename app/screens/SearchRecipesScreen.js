import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  ImageBackground,
  SafeAreaView,
  TextInput,
  Text,
} from "react-native";
import DropdownMenu from "../components/DropdownMenu";
import { isTablet } from "react-native-device-detection";
import localStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import { getRecipes } from "../api/recipesApi";
import { getCurrentUser } from "../api/userApi";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import Heading from "../components/Heading";
import Screen from "../components/Screen";
import RecipeListItem from "../components/RecipeListItem";
import routes from "../navigation/routes";
import colors from "../config/colors";
import { getImageWidth, getImageHeight } from "../utility/dimensions";
import RecipeIcon from "../components/RecipeIcon";
import DropShadow from "../components/DropShadow";

function SearchRecipesScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [user, setUser] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [text, setText] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const searchRef = useRef();

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      loadScreen();
    });
    //(async () => await loadScreen())();
    return subscribe;
  }, [navigation]);

  const loadScreen = async () => {
    try {
      setLoading(true);
      setShowMenu(false);
      const user = await getCurrentUser();
      setUser(user);
      const results = await getRecipes(keywords, 1, 1000);
      setRecipes(results.recipes);
      setTotalItems(results.totalCount);
    } catch (err) {
      console.log("...", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await loadScreen();
    } catch (err) {
      console.log("...", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuUpdate = async () => {
    const user = await getCurrentUser();
    setUser(user);
    setShowMenu(false);
  };

  const handleRecipeSelect = (id) => {
    //console.log(id);
    setShowMenu(false);
    localStorage.setItem("recipeId", id.toString());
    navigation.navigate(routes.VIEW_RECIPE);
  };

  const handleNewRecipe = () => {
    setShowMenu(false);
    localStorage.removeItem("recipeId");
    navigation.navigate(routes.NEW_RECIPE);
  };

  const handleShoppingList = () => {
    setShowMenu(false);
    navigation.navigate(routes.SHOPPING_LISTS);
  };

  const handleClearSearch = () => {
    setShowMenu(false);
    searchRef.current.clear();
    setKeywords("");
    //onSearchButton("");
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <View style={styles.header}>
        <DropdownMenu
          user={user}
          showMenu={showMenu}
          onShowMenuDone={(show) => setShowMenu(show)}
          onUpdate={handleMenuUpdate}
        />
      </View>
      <Screen>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={styles.banner}
            source={require("../assets/my-meal-ideas-banner.png")}
          />
          {/* <RecipeIcon />
          <Heading title="My Meal IDEAS" fontSize={24} color={colors.heading} /> */}
        </View>
        <ScrollView style={{ marginBottom: 0 }}>
          <Image
            style={styles.image}
            source={require("../assets/cookbook-design.jpeg")}
          />
          <View style={styles.searchContainer}>
            <FontAwesome5 name="pencil-alt" color={colors.medium} size={16} />
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
          <Button title="SEARCH" icon="search" onPress={handleSubmit} />
          {user.loggedIn && (
            <Button
              title="NEw RECIPE"
              onPress={handleNewRecipe}
              color="heading"
              icon="plus"
            />
          )}
          {user.loggedIn && (
            <Button
              title="SHOPPING LIST"
              onPress={handleShoppingList}
              color="heading"
              icon="shopping-cart"
            />
          )}
          <View style={styles.recipeListHeader}>
            <Text style={styles.text}>{totalItems} meals found.</Text>
          </View>
          <DropShadow>
            <View style={styles.recipeListContainer}>
              {recipes.map((recipe, index) => (
                <RecipeListItem
                  recipe={recipe}
                  key={index}
                  onRecipeSelect={handleRecipeSelect}
                  fontColor={colors.heading}
                />
              ))}
            </View>
          </DropShadow>
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "80%",
    height: 60,
    marginBottom: 10,
  },
  recipeListContainer: {
    flex: 1,
    paddingLeft: isTablet ? 20 : 10,
    backgroundColor: colors.beige,
    //borderRadius: 25,
    paddingTop: 20,
    paddingRight: 40,
    marginBottom: 40,
    borderWidth: 2,
    marginLeft: 10,
    marginRight: 10,
    borderColor: colors.greenMedium,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 50,
    marginBottom: 5,
    padding: 5,
    width: "100%",
  },
  categoryText: {
    color: colors.medium,
    flex: 1,
  },
  closeCategory: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  image: {
    //borderRadius: 25,
    width: getImageWidth(1, 40, 720, 422),
    height: getImageHeight(1, 40, 720, 422, 0),
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.greenDark,
  },
  imageBackground: {
    flex: 1,
    opacity: 1,
    //justifyContent: "center",
    //alignItems: "center",
  },
  header: {
    backgroundColor: colors.greenMedium,
    height: 60,
    paddingTop: 30,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    elevation: 10,
    zIndex: 10,
  },
  submit: {},
  searchContainer: {
    backgroundColor: colors.beige,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.black,
  },
  searchText: {
    marginLeft: 5,
    width: "86%",
  },
  text: {
    color: colors.white,
  },
  recipeListHeader: {
    backgroundColor: colors.greenMedium,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 40,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SearchRecipesScreen;
