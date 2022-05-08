import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { isTablet } from "react-native-device-detection";
import * as Yup from "yup";
import localStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getCategories, getSourceOptions, getRatings } from "../api/testData";
import { getRecipeById, saveRecipe, deleteRecipe } from "../api/recipesApi";
import ActivityIndicator from "../components/ActivityIndicator";
import {
  ErrorMessage,
  Form,
  FormField,
  FormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import Button from "../components/Button";
import Heading from "../components/Heading";
import routes from "../navigation/routes";
import colors from "../config/colors";
import { string } from "yup/lib/locale";

const validationSchema = Yup.object().shape({
  recipeTitle: Yup.string().required().max(255).label("Recipe Title"),
  category: Yup.string().required().label("Category"),
  recipeSource: Yup.string().required().label("Recipe Source"),
  recipeSourceData: Yup.string().nullable().max(500).label("Source Info"),
  prepTime: Yup.string().label("Prep Time"),
  cookTime: Yup.string().label("Cook Time"),
  method: Yup.string().max(2000).label("Method"),
  rating: Yup.string().label("Rating"),
  owner_id: Yup.number().optional(),
});

function NewRecipeScreen({ navigation }) {
  const [sourceOptions, setSourceOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [recipe, setRecipe] = useState({});
  const [heading, setHeading] = useState("New Recipe");
  const [headingIcon, setHeadingIcon] = useState("plus-square");
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [navigateToScreen, setNavigateToScreen] = useState(
    routes.SEARCH_RECIPE
  );

  useEffect(() => {
    (async () => await loadScreen())();
  }, []);

  const loadScreen = async () => {
    try {
      setLoading(true);
      setCategories(getCategories(false));
      setSourceOptions(getSourceOptions());
      setRatings(getRatings());

      const id = await localStorage.getItem("recipeId");
      if (id) {
        const result = await getRecipeById(id);
        setHeading("Edit Recipe");
        setHeadingIcon("edit");
        setRecipe(result);
        setShowDeleteButton(true);
      } else initializeEmptyForm();
    } catch (e) {
      console.log("ERROR>>>", e);
    } finally {
      setLoading(false);
    }
  };

  const initializeEmptyForm = () => {
    //console.log("..");
    const values = {
      id: 0,
      recipeTitle: "",
      category: null,
      recipeSource: null,
      recipeSourceData: "",
      prepTime: "",
      cookTime: "",
      method: "",
      rating: 0,
      comments: "",
      owner_id: 0,
    };
    setRecipe(values);
  };

  const handleSubmit = async (formrecipe) => {
    const result = await saveRecipe(formrecipe);
    //console.log("result...", result);

    if (result) {
      if (navigateToScreen === routes.ADD_INGREDIENTS) {
        navigation.navigate(routes.ADD_INGREDIENTS, {
          id: result.id,
          recipeTitle: result.recipeTitle,
        });
      } else if (navigateToScreen === routes.IMAGE_MANAGER)
        navigation.navigate(routes.IMAGE_MANAGER, {
          id: result.id,
          recipeTitle: result.recipeTitle,
        });
      else navigation.navigate(routes.SEARCH_RECIPE);
    }
  };

  const handleNotifySubmit = (route) => {
    setNavigateToScreen(route);
  };

  const handleReset = () => {};

  const handleRecipeDelete = async () => {
    await deleteRecipe(recipe.id);
    navigation.navigate(routes.SEARCH_RECIPE);
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
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.container}>
        <View style={styles.headingContainer}>
          <MaterialCommunityIcons
            name="chef-hat"
            size={20}
            color={colors.white}
          />
          <Heading
            title={heading}
            fontSize={20}
            color={colors.white}
            //icon={headingIcon}
          />
        </View>
        <ScrollView>
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
              prepTime: "",
              cookTime: "",
              method: "",
              rating: "0",
              comments: "",
              owner_id: 0,
            }}
            onSubmit={handleSubmit}
            onHandleReset={handleReset}
            validationSchema={validationSchema}
            //showClearButton={true}
            //clearButtonTitle="New Recipe"
            //clearButtonIcon="plus-square"
          >
            <FormField
              autoCorrect={false}
              icon="pencil"
              name="recipeTitle"
              placeholder="Recipe Title"
              multiline={true}
              height={60}
              textAlignVertical="top"
            />
            <FormPicker
              items={categories}
              name="category"
              icon="clipboard-list-outline"
              numberOfColumns={1}
              placeholder="Category"
              valueProperty="category"
              textProperty="category"
              visible={false}
              submitOnSelect={false}
            />
            <FormPicker
              items={ratings}
              name="rating"
              icon="cards-heart"
              numberOfColumns={1}
              placeholder="Rating"
              valueProperty="rating"
              textProperty="rating"
              visible={false}
              submitOnSelect={false}
            />
            <FormPicker
              items={sourceOptions}
              name="recipeSource"
              icon="source-fork"
              numberOfColumns={1}
              placeholder="Source"
              valueProperty="source"
              textProperty="source"
              visible={false}
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
            <FormField
              autoCorrect={false}
              icon="timer-sand"
              name="prepTime"
              placeholder="Prep Time"
            />
            <FormField
              autoCorrect={false}
              icon="timer-sand"
              name="cookTime"
              placeholder="Cook Time"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="pencil"
              name="method"
              placeholder="Method"
              multiline={true}
              height={400}
              textAlignVertical="top"
            />
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="pencil"
              name="comments"
              placeholder="Comments"
              multiline={true}
              height={300}
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
              <SubmitButton title="DONE" icon="smile" color="greenDark" />
            </View>
          </Form>
          {showDeleteButton && (
            <Button
              title="DELETE"
              onPress={createDeleteAlert}
              icon="trash"
              color="greenDark"
            />
          )}
          <Button
            title="CANCEL"
            icon="window-close"
            onPress={() => navigation.navigate(routes.SEARCH_RECIPE)}
            color="greenDark"
          ></Button>
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingLeft: isTablet ? 20 : 10,
    marginTop: 20,
    backgroundColor: colors.greenMedium,
    borderRadius: 25,
    margin: 10,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  submit: {},
});

export default NewRecipeScreen;
