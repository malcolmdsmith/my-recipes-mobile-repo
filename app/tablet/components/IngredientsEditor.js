import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import { isTablet } from "react-native-device-detection";
import * as Yup from "yup";

import { getMeasureTypes } from "../../api/testData";
import ActivityIndicator from "../../components/ActivityIndicator";
import {
  ErrorMessage,
  Form,
  FormField,
  FormPicker,
  SubmitButton,
} from "../../components/forms";
import Screen from "../../components/Screen";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import IngredientListItem from "../../components/IngredientListItem";
import colors from "../../config/colors";
import {
  getIngredients,
  saveIngredient,
  deleteIngredient,
} from "../../api/ingredientsApi";
import { getScreenHeight, getScreenWidth } from "../../utility/dimensions";

const validationSchema = Yup.object().shape({
  ingredientName: Yup.string().required().max(100).label("Ingredient"),
  measure: Yup.string().required().label("Measure"),
  qty: Yup.number().required().label("Quantity"),
});

function IngredientsEditor({ recipe, route, onIngredientsDone }) {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ingredientNameFocus, setIngredientNameFocus] = useState(false);
  const refIngName = useRef(null);
  const refScrollView = useRef(null);
  const refQty = useRef(null);

  useEffect(() => {
    (async () => await loadScreen())();
  }, []);

  const loadScreen = async () => {
    try {
      setLoading(true);
      const ingredients = await getIngredients(recipe.id);
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
    ingInfo.recipeId = recipe.id;
    const ing = await saveIngredient(ingInfo);
    //console.log(ing);
    if (ing.id) {
      const ingredient = getIngredient(ing);
      setIngredients((ingredients) => [...ingredients, ingredient]);
      resetForm();
      setFocusToIngredientName();
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
    //navigation.navigate(routes.SEARCH_RECIPE);
    onIngredientsDone();
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
      const ingredients = await getIngredients(recipe.id);
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
      <ImageBackground
        style={styles.imagebackground}
        source={require("../../assets/cookbook-design.jpeg")}
      >
        <View style={styles.container}>
          <View style={styles.leftPanel}>
            <Heading
              title="Add Ingredients"
              fontSize={20}
              color={colors.heading}
            />
            <Heading title={recipe.recipeTitle} color={colors.white} />
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
              <FormField
                autoCorrect={false}
                name="measure"
                icon="scale"
                placeholder="Size"
              />
              <FormField
                autoCorrect={false}
                icon="counter"
                name="qty"
                ref={refQty}
                placeholder="Qty"
                width={120}
                //keyboardType="number-pad"
              />
              <View style={styles.submit}>
                <SubmitButton title="Add" color="heading" icon="plus" />
              </View>
              <Button
                title="Done"
                color="greenDark"
                onPress={handleDone}
                icon="smile"
              />
            </Form>
          </View>
          <View style={styles.rightPanel}>
            <ScrollView ref={refScrollView}>
              <View style={styles.IngredientsList}>
                <Heading title="Ingredients" />
                {ingredients.map((ing, index) => (
                  <IngredientListItem
                    key={index}
                    item={ing}
                    onIngredientDelete={createDeleteAlert}
                    showDelete={true}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 0,
  },
  IngredientsList: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
  },
  submit: {},
  imagebackground: {
    width: getScreenWidth(0),
    height: getScreenHeight(0),
  },
  leftPanel: {
    width: "50%",
    backgroundColor: colors.greenMedium,
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
  rightPanel: {
    width: "42%",
    backgroundColor: colors.greenMedium,
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
});

export default IngredientsEditor;
