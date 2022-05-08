import React, { Component, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Modal,
  Linking,
} from "react-native";
const { forEach } = require("p-iteration");

import colors from "../../config/colors";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import Link from "../../components/Link";
import RecipeImageViewer from "../../components/RecipeImageViewer";
import { getIngredients } from "../../api/ingredientsApi";
import { getRecipeImages } from "../../api/recipeImagesApi";
import { getRecipeById } from "../../api/recipesApi";
import { findOne } from "../../api/shoppingItemsApi";
import IngredientsPanel from "./IngredientsPanel";
import StarRatingViewer from "../../components/StarRatingViewer";
import CookPrepTimePanel from "./CookPrepTimePanel";
import RecipeEditor from "./RecipeEditor";
import RecipeImageEditor from "./RecipeImageEditor";
import IngredientsEditor from "./IngredientsEditor";
import { saveShoppingItem } from "../../api/shoppingItemsApi";
import { getUserName } from "../../config/userSettings";
import { getRecipeCategoryImage } from "../../api/recipeCategoriesApi";

export default ViewRecipePanel = ({
  recipe,
  refreshPanels,
  onRefreshed,
  onRecipeDeleted,
  onRecipeAdded,
  onShowShoppingList,
  onNavBack,
}) => {
  const [images, setImages] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipeCard, setRecipeCard] = useState({});
  const [sourceData, setSourceData] = useState(null);
  const [editRecipeVisible, setEditRecipeVisible] = useState(false);
  const [photoManagerVisible, setPhotoManagerVisible] = useState(false);
  const [ingredientsEditorVisible, setIngredientsEditorVisible] =
    useState(false);
  //
  useEffect(() => {
    //
    loadPanel();
  }, [JSON.stringify(recipe), refreshPanels]);

  const loadPanel = async () => {
    try {
      //
      if (recipe.id > 0) {
        const result = await getRecipeById(recipe.id);
        //
        setRecipeCard(result);
        const ingredients = await getIngredients(recipe.id);
        //
        setIngredients(ingredients);
        const rimages = await getRecipeImages(recipe.id);
        //
        if (rimages.length == 0) {
          const image = await getRecipeCategoryImage(result.category);
          if (image) {
            rimages.push(image);
          }
        }
        setImages(rimages);
        setEditRecipeVisible(false);
        loadRecipeSourceData(result.recipeSource, result.recipeSourceData);
      } else {
        setRecipeCard(recipe);
        setEditRecipeVisible(true);
      }
    } catch (e) {
      console.log("ERROR>>>", e);
    } finally {
      onRefreshed();
    }
  };

  const loadRecipeSourceData = (source, data) => {
    let result;

    switch (source) {
      case ("Cookbook", "Takeaway"):
        if (data === "") data = "Not Specified.";
        result = <Text>{data}</Text>;
        break;
      case "Web Link":
        result = (
          <Link
            title="View Recipe in Browser"
            onPress={() => {
              Linking.openURL(data);
            }}
          />
        );
        break;
      default:
        result = null;
    }
    setSourceData(result);
  };

  const handleBackButton = () => {
    onNavBack();
  };

  const handleEditRecipe = () => {
    setEditRecipeVisible(true);
  };
  const handleCloseRecipeEditor = async (recipeDeleted) => {
    setEditRecipeVisible(false);
    if (recipeDeleted) onRecipeDeleted();
    else await loadPanel();
  };

  const handleNavigateToShopping = () => {};
  const handleAddShopping = async () => {
    try {
      setLoading(true);
      if (recipeCard) {
        const result = await getIngredients(recipeCard.id);
        await forEach(result, async (ing) => {
          let item = {};
          item.ingredientName = ing.ingredientName;
          item.measure = ing.measure;
          item.qty = ing.qty;
          item.picked = false;
          item.shopping_list_date = new Date().toDateString();
          item.username = getUserName();
          item.cost = 0;
          let savedItem = await saveShoppingItem(item);
        });
      }
    } catch (e) {
      console.log("ERROR>>>", e);
    } finally {
      setLoading(false);
      onShowShoppingList();
    }
  };
  const handleAddPhotos = () => {
    setEditRecipeVisible(false);
    setPhotoManagerVisible(true);
  };
  const handlePhotosDone = async () => {
    setPhotoManagerVisible(false);
    await loadPanel();
  };
  const handleAddIngredients = () => {
    setEditRecipeVisible(false);
    setIngredientsEditorVisible(true);
  };
  const handleIngredientsDone = async () => {
    setEditRecipeVisible(false);
    setIngredientsEditorVisible(false);
    await loadPanel();
  };

  const createAlert = async () => {
    const item = await findOne(getUserName());
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
      <View style={styles.back}>
        <Link
          title="Back"
          icon="arrow-alt-circle-left"
          color="gray"
          onPress={handleBackButton}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.heading}>
          <Heading
            title={recipe.recipeTitle}
            fontSize={20}
            color={colors.heading}
            textAlign="center"
          />
        </View>
        <ScrollView>
          <View style={styles.panels}>
            <View style={styles.panelLeft}>
              <RecipeImageViewer
                images={images}
                allowDelete={false}
                widthFactor={0.35}
                paddingWrap={30}
                bgcolor={colors.greenLight}
                allowFullScreen={true}
                onRecipeSelect={() => {}}
              />
              <View style={styles.starsContainer}>
                <StarRatingViewer
                  rating={recipeCard.rating}
                  color={colors.heading}
                  backgroundColor={colors.white}
                />
              </View>
              <CookPrepTimePanel recipeCard={recipeCard} />
              {sourceData && (
                <View style={styles.sourceDataContainer}>{sourceData}</View>
              )}
              {ingredients.length > 0 && (
                <IngredientsPanel ingredients={ingredients} />
              )}
            </View>
            <View style={styles.panelRight}>
              {recipeCard.AllowEdits && (
                <View style={styles.links}>
                  <Button
                    title="EDIT"
                    icon="pencil-alt"
                    color="heading"
                    fontSize={14}
                    onPress={handleEditRecipe}
                  />
                  <Button
                    title="ADD"
                    icon="shopping-cart"
                    color="heading"
                    fontSize={14}
                    onPress={createAlert}
                  />
                </View>
              )}
              {recipeCard.method != "" ? (
                <View style={styles.method}>
                  <Heading title="Method" />
                  <Text>{recipeCard.method}</Text>
                </View>
              ) : null}
              {recipeCard.comments != "" > 0 && (
                <View style={styles.method}>
                  <Heading title="Comments" />
                  <Text>{recipeCard.comments}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <Modal visible={editRecipeVisible}>
          <RecipeEditor
            recipe={recipeCard}
            onCloseRecipeEditor={handleCloseRecipeEditor}
            onAddIngredients={handleAddIngredients}
            onAddPhotos={handleAddPhotos}
            onRecipeAdded={onRecipeAdded}
          />
        </Modal>
        <Modal visible={photoManagerVisible}>
          <RecipeImageEditor
            recipe={recipeCard}
            onPhotosDone={handlePhotosDone}
          />
        </Modal>
        <Modal visible={ingredientsEditorVisible}>
          <IngredientsEditor
            recipe={recipeCard}
            onIngredientsDone={handleIngredientsDone}
          />
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  back: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 25,
    marginBottom: 10,
  },
  method: {
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  panels: {
    flex: 1,
    flexDirection: "row",
  },
  panelLeft: {
    width: "50%",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  panelRight: {
    width: "50%",
    marginLeft: 10,
    paddingRight: 10,
  },
  sourceDataContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  starsContainer: {
    backgroundColor: colors.white,
    height: 40,
    borderRadius: 25,
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 10,
  },
});
