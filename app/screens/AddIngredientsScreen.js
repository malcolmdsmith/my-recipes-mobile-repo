import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, Alert, Text } from "react-native";
import { isTablet } from "react-native-device-detection";
import * as Yup from "yup";

import { getMeasureTypes } from "../api/testData";
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
import IngredientListItem from "../components/IngredientListItem";
import colors from "../config/colors";
import routes from "../navigation/routes";
import {
  getIngredients,
  saveIngredient,
  deleteIngredient,
} from "../api/ingredientsApi";
import RecipeIcon from "../components/RecipeIcon";
const validationSchema = Yup.object().shape({
  ingredientName: Yup.string().required().max(100).label("Ingredient"),
  measure: Yup.string().required().nullable().label("Measure"),
  qty: Yup.number().required().label("Quantity"),
});

function AddIngredientsScreen({ route, navigation }) {
  const [measureTypes, setMeasureTypes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ingredientNameFocus, setIngredientNameFocus] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeId, setRecipeId] = useState(0);
  const refIngName = useRef(null);
  const refScrollView = useRef(null);
  const refQty = useRef(null);
  const [measureVisible, setMeasureVisible] = useState(false);

  useEffect(() => {
    (async () => await loadScreen())();
  }, []);

  const loadScreen = async () => {
    try {
      setLoading(true);
      setMeasureTypes(getMeasureTypes());
      setRecipeId(route.params.id);
      setRecipeTitle(route.params.recipeTitle);
      const ingredients = await getIngredients(route.params.id);
      //console.log(ingredients);
      setIngredients(ingredients);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      //setFocusToIngredientName();
    }
  };

  const handleSubmit = (ingInfo, { resetForm }) => {
    SubmitIngredient(ingInfo, resetForm);
  };

  const SubmitIngredient = async (ingInfo, resetForm) => {
    ingInfo.recipeId = recipeId;
    const ing = await saveIngredient(ingInfo);
    console.log(ing);
    if (ing.id) {
      const ingredient = getIngredient(ing);
      setIngredients((ingredients) => [...ingredients, ingredient]);
      resetForm();
      //setFocusToIngredientName();
    }
  };

  const getIngredient = (ing) => {
    let ingredient = {};

    ingredient.ingredientName = ing.ingredientName;
    ingredient.qty = ing.qty;
    ingredient.measure = ing.measure;
    ingredient.id = ing.id;

    return ingredient;
  };
  const handleDone = () => {
    //const filtered = ingredients.filter((ing) => ing.id === "0");
    navigation.navigate(routes.SEARCH_RECIPE);
  };

  const setFocusToIngredientName = () => {
    refIngName.current.focus();
    refScrollView.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  const handleMeasureOnBlur = () => {
    //console.log("onBlur");
    refQty.current.focus();
  };

  const handleIngredientDelete = async (item) => {
    try {
      await deleteIngredient(item.id);
      setLoading(true);
      const ingredients = await getIngredients(route.params.id);
      //console.log(ingredients);
      setIngredients(ingredients);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const createDeleteAlert = (item) =>
    Alert.alert(
      "Confirm delete",
      "Are you sure you wish to delete " + item.ingredientName,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleIngredientDelete(item) },
      ]
    );

  return (
    <>
      <ActivityIndicator visible={loading} />
      <View style={styles.container}>
        <Heading
          title="Add Ingredients"
          fontSize={20}
          color={colors.heading}
          icon="plus"
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RecipeIcon color="white" />
          <Heading title={recipeTitle} color={colors.white} />
        </View>
        <ScrollView ref={refScrollView}>
          <Form
            initialValues={{
              id: 0,
              ingredientName: "",
              qty: "1",
              measure: "",
            }}
            resetValues={{ id: 0, ingredientName: "", qty: "1", measure: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormField
              autoCorrect={false}
              icon="bread-slice-outline"
              name="ingredientName"
              placeholder="Ingredient Name"
              ref={refIngName}
              onSubmitEditing={() => setMeasureVisible(true)}
            />
            <FormPicker
              items={measureTypes}
              name="measure"
              icon="scale"
              numberOfColumns={1}
              placeholder="Size"
              valueProperty="type"
              textProperty="type"
              width={250}
              visible={measureVisible}
              setVisible={setMeasureVisible}
              onBlur={handleMeasureOnBlur}
            />
            <FormField
              autoCorrect={false}
              icon="counter"
              name="qty"
              ref={refQty}
              placeholder="Quantity"
              width={140}
              keyboardType="number-pad"
            />
            <View style={styles.submit}>
              <SubmitButton title="Add" color="greenDark" icon="plus" />
            </View>
          </Form>
          <View style={styles.IngredientsList}>
            <Heading title="Ingredients" />
            {ingredients.length === 0 && <Text>Nil.</Text>}
            {ingredients.map((ing, index) => (
              <IngredientListItem
                key={index}
                item={ing}
                onIngredientDelete={createDeleteAlert}
                showDelete={true}
              />
            ))}
          </View>
          <Button title="Done" color="heading" onPress={handleDone} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: isTablet ? 20 : 10,
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: colors.greenMedium,
    borderRadius: 25,
    padding: 10,
  },
  IngredientsList: {
    backgroundColor: colors.white,
    borderRadius: 30,
    marginTop: 30,
    paddingLeft: 20,
    paddingTop: 10,
    //height: 170,
    paddingBottom: 20,
    marginBottom: 30,
  },
  submit: {},
});

export default AddIngredientsScreen;
