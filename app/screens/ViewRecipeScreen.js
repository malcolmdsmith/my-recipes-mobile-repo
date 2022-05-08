import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  ImageBackground,
} from "react-native";
import localStorage from "@react-native-async-storage/async-storage";
import ActivityIndicator from "../components/ActivityIndicator";

import Screen from "../components/Screen";
import Button from "../components/Button";
import Link from "../components/Link";
import Heading from "../components/Heading";
import { getRecipeById } from "../api/recipesApi";
import { getIngredients } from "../api/ingredientsApi";
import { getRecipeImages } from "../api/recipeImagesApi";
import { getRecipeCategoryImage } from "../api/recipeCategoriesApi";
import { getCurrentUser } from "../api/userApi";
import { findOne } from "../api/shoppingItemsApi";
import routes from "../navigation/routes";
import { ManualEntryCard } from "../components/ManualEntryCard";
import { RecipeOtherCard } from "../components/RecipeOtherCard";
import RecipeImageViewer from "../components/RecipeImageViewer";
import colors from "../config/colors";
import StarRatingViewer from "../components/StarRatingViewer";
import RecipeIcon from "../components/RecipeIcon";

function ViewRecipeScreen({ navigation }) {
  const [recipe, setRecipe] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showManualEntryCard, setShowManualEntryCard] = useState(false);
  const [images, setImages] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      loadScreen();
    });
    return subscribe;
  }, [navigation]);

  const loadScreen = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setUser(user);

      const id = await localStorage.getItem("recipeId");
      if (id) {
        const result = await getRecipeById(id);
        setRecipe(result);
        if (result.recipeSource == "Manual Entry") setShowManualEntryCard(true);
        const ingredients = await getIngredients(id);
        setIngredients(ingredients);
        let images = await getRecipeImages(id);
        if (images.length == 0) {
          const catimg = await getRecipeCategoryImage(result.category);
          images.push(catimg);
        }
        //console.log(images);
        setImages(images);
      }
    } catch (e) {
      console.log("ERROR>>>", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecipe = async () => {
    await localStorage.setItem("recipeId", recipe.id.toString());
    navigation.navigate(routes.NEW_RECIPE);
  };

  const handleAddShopping = () => {
    navigation.navigate(routes.SHOPPING_LISTS, { id: recipe.id.toString() });
  };
  const handleNavigateToShopping = () => {
    navigation.navigate(routes.SHOPPING_LISTS);
  };

  const handleDone = () => {
    navigation.navigate(routes.SEARCH_RECIPE);
  };

  const createAlert = async () => {
    const item = await findOne(user.id);
    let msg = "";
    if (item)
      msg =
        "Shopping items already exist in your list. Do wish to add these ingredients?";
    else
      msg =
        "Are you sure you wish to add these ingredients to your shopping list? ";

    Alert.alert("Confirm", msg, [
      {
        text: "No",
        onPress: () => handleNavigateToShopping(),
        style: "cancel",
      },
      { text: "Yes", onPress: () => handleAddShopping() },
    ]);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ImageBackground
        style={styles.imageBackground}
        source={require("../assets/paper-seamless-background-1380.jpg")}
      >
        <View style={styles.container}>
          <View style={styles.headingContainer}>
            <RecipeIcon />
            <Heading
              title={recipe.recipeTitle}
              fontSize={20}
              color={colors.heading}
              textAlign="left"
            />
          </View>
          <ScrollView style={{ marginBottom: 40 }}>
            <RecipeImageViewer
              images={images}
              allowDelete={false}
              initialMode="list"
              widthFactor={0.94}
            />
            <View style={styles.links}>
              {user.AllowEdits && (
                <Button
                  title="EDIT"
                  icon="pencil-alt"
                  color="heading"
                  fontSize={14}
                  onPress={handleEditRecipe}
                  width={150}
                />
              )}
              {user.AllowEdits && (
                <Button
                  title="ADD"
                  icon="shopping-cart"
                  color="heading"
                  fontSize={14}
                  onPress={createAlert}
                  width={150}
                />
              )}
            </View>
            <StarRatingViewer rating={recipe.rating} />
            {showManualEntryCard ? (
              <ManualEntryCard recipe={recipe} ingredients={ingredients} />
            ) : (
              <RecipeOtherCard recipe={recipe} ingredients={ingredients} />
            )}
            <View style={{ marginTop: 5, marginBottom: 40 }}>
              <Button title="DONE" onPress={handleDone} color="greenMedium" />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  links: {
    //paddingLeft: 40,
    //paddingRight: 40,
    flexDirection: "row",
    justifyContent: "space-evenly",
    //width: "100%",
  },
});

export default ViewRecipeScreen;
