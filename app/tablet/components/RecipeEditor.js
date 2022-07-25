import React, { Component, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  FormPicker,
  FormDropDownList,
  SubmitButton,
} from "../../components/forms";
import Button from "../../components/Button";
import { getSourceOptions, getRatings } from "../../api/testData";
import { getRecipeCategoryNames } from "../../api/recipeCategoriesApi";
import { getScreenHeight, getScreenWidth } from "../../utility/dimensions";
import routes from "../../navigation/routes";
import { saveRecipe, deleteRecipe } from "../../api/recipesApi";
import colors from "../../config/colors";

const validationSchema = Yup.object().shape({
  recipeTitle: Yup.string().required().max(255).label("Recipe Title"),
  //   category: Yup.object().test(
  //     "categoryNotNull",
  //     "You must select a category.",
  //     (value, context) => {
  //       return value.category !== null;
  //     }
  //   ),
  category: Yup.string().required().label("Category"),
  recipeSource: Yup.string().required().label("Recipe Source"),
  recipeSourceData: Yup.string().when("recipeSource", {
    is: (val) => val === "Cookbook" || val === "Takeaway" || val === "Web Link",
    then: Yup.string()
      .required("Source info cant be empty for Cookbook, Takeway & Web Link.")
      .nullable()
      .max(500)
      .label("Source Info"),
    otherwise: Yup.string().notRequired(),
  }),
  prepTime: Yup.string().label("Prep Time"),
  cookTime: Yup.string().label("Cook Time"),
  method: Yup.string().max(2000).label("Method"),
  rating: Yup.string().label("Rating"),
  owner_id: Yup.number(),
});

export default RecipeEditor = ({
  recipe,
  onCloseRecipeEditor,
  onAddPhotos,
  onAddIngredients,
  onRecipeAdded,
}) => {
  const [sourceOptions, setSourceOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [navigateToScreen, setNavigateToScreen] = useState(
    routes.SEARCH_RECIPE
  );
  const refTitle = useRef(null);

  useEffect(() => {
    (async () => await loadScreen())();
  }, []);

  const loadScreen = async () => {
    try {
      setLoading(true);
      const categories = await getRecipeCategoryNames();
      setCategories(categories);
      setSourceOptions(getSourceOptions());
      setRatings(getRatings());
      if (recipe.id === 0) setFocusToTitle();
    } catch (e) {
      console.log("ERROR>>>", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formrecipe) => {
    const result = await saveRecipe(formrecipe);
    onRecipeAdded(result);

    if (result) {
      if (navigateToScreen === routes.ADD_INGREDIENTS) {
        onAddIngredients();
      } else if (navigateToScreen === routes.IMAGE_MANAGER) onAddPhotos();
      else onCloseRecipeEditor(false);
    }
  };

  const setFocusToTitle = () => {
    refTitle.current.focus();
  };

  const handleReset = () => {};
  const handleNotifySubmit = (route) => {
    setNavigateToScreen(route);
  };
  const handleRecipeDelete = async () => {
    await deleteRecipe(recipe.id);
    onCloseRecipeEditor(true);
  };

  const createDeleteAlert = (item) =>
    Alert.alert(
      "Confirm delete",
      "Are you sure you wish to delete this recipe?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleRecipeDelete() },
      ]
    );

  return (
    <ScrollView style={styles.scroll}>
      <ImageBackground
        style={styles.imagebackground}
        source={require("../../assets/cookbook-design.jpeg")}
      >
        <View style={styles.container}>
          <Form
            initialValues={{
              id: recipe.id,
              recipeTitle: recipe.recipeTitle,
              category: recipe.category,
              recipeSource: recipe.recipeSource,
              recipeSourceData: recipe.recipeSourceData,
              prepTime: recipe.prepTime,
              cookTime: recipe.cookTime,
              method: recipe.method,
              rating: recipe.rating,
              comments: recipe.comments,
              owner_id: recipe.owner_id,
            }}
            resetValues={{
              id: 0,
              recipeTitle: "",
              category: "",
              recipeSource: "",
              recipeSourceData: "",
              prepTime: "0",
              cookTime: "0",
              method: "",
              rating: "0",
              comments: "",
              owner_id: 0,
            }}
            onSubmit={handleSubmit}
            onHandleReset={handleReset}
            validationSchema={validationSchema}
            showClearButton={false}
          >
            <View style={styles.leftPanel}>
              <FormField
                autoCorrect={false}
                icon="pencil"
                name="recipeTitle"
                placeholder="Recipe Title"
                multiline={true}
                height={60}
                textAlignVertical="top"
                ref={refTitle}
              />
              <FormPicker
                items={categories}
                name="category"
                icon="clipboard-list-outline"
                numberOfColumns={1}
                placeholder="Category"
                submitOnSelect={false}
              />
              <FormPicker
                items={ratings}
                name="rating"
                icon="cards-heart"
                numberOfColumns={1}
                placeholder="Rating"
                submitOnSelect={false}
              />
              <FormPicker
                items={sourceOptions}
                name="recipeSource"
                icon="source-fork"
                numberOfColumns={1}
                placeholder="Source"
                submitOnSelect={false}
              />
              <FormField
                autoCorrect={false}
                icon="pencil"
                name="recipeSourceData"
                placeholder="Source Info"
                multiline={true}
                height={60}
                textAlignVertical="top"
              />
              <View style={styles.submit}>
                <SubmitButton
                  title="PHOTOS"
                  //onPress={handleAddImage}
                  icon="image"
                  notifySubmit={handleNotifySubmit}
                  navTo={routes.IMAGE_MANAGER}
                  color="heading"
                />
                <SubmitButton
                  title="INGREDIENTS"
                  icon="list-alt"
                  notifySubmit={handleNotifySubmit}
                  navTo={routes.ADD_INGREDIENTS}
                  color="heading"
                />
                {recipe.id > 0 && (
                  <Button
                    title="DELETE"
                    onPress={createDeleteAlert}
                    icon="trash"
                    color="greenDark"
                  />
                )}
                <SubmitButton title="DONE" icon="smile" color="greenDark" />
              </View>
              <Button
                title="CANCEL"
                icon="window-close"
                onPress={onCloseRecipeEditor}
                color="greenDark"
              ></Button>
            </View>
            <View style={styles.rightPanel}>
              <FormField
                autoCorrect={false}
                icon="timer-sand"
                name="prepTime"
                placeholder="Prep Time"
                showLabelAbove={recipe.id > 0 ? true : false}
              />
              <FormField
                autoCorrect={false}
                icon="timer-sand"
                name="cookTime"
                placeholder="Cook Time"
                showLabelAbove={recipe.id > 0 ? true : false}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="pencil"
                name="method"
                placeholder="Method"
                multiline={true}
                height={350}
                textAlignVertical="top"
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="pencil"
                name="comments"
                placeholder="Comments"
                multiline={true}
                height={200}
                textAlignVertical="top"
              />
            </View>
          </Form>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    backgroundColor: colors.greenMedium,
    borderRadius: 20,
    padding: 20,
    width: getScreenWidth(80) / 2,
    margin: 20,
    //backgroundColor: "blue",
  },
  rightPanel: {
    backgroundColor: colors.greenMedium,
    borderRadius: 20,
    padding: 20,
    width: getScreenWidth(80) / 2,
    margin: 20,
    //backgroundColor: "green",
  },
  scroll: {
    //paddingRight: 80,
  },
  imagebackground: {
    // width: getScreenWidth(0),
    //  height: getScreenHeight(0),
  },
});
