import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../../components/forms";
import colors from "../../config/colors";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import { getRecipes } from "../../api/recipesApi";
import RecipeListItem from "../../components/RecipeListItem";
import CategoryManager from "./CategoryManager";
import RecipeIcon from "../../components/RecipeIcon";

const validationSchema = Yup.object().shape({
  search: Yup.string().optional(),
});

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
  const [applyClear, setApplyClear] = useState();
  const formikRef = useRef();

  useEffect(() => {
    try {
      //console.log("useEffect...");
      loadRecipes("");
    } catch (e) {
      console.log(e);
    }
  }, [refreshHome]);

  const loadRecipes = async (keywords) => {
    try {
      const result = await getRecipes(keywords, 1, 1000);
      setRecipes(result.recipes);
      onRefreshed();
    } catch (e) {
      console.log(e);
    }
  };

  const handleHomePress = () => {
    //formikRef.current?.resetForm();
    setApplyClear(true);
    onHomePress();
  };

  const handleCleared = () => {
    setApplyClear(false);
  };

  const handleSubmit = async (input) => {
    const keywords = input.search;

    await loadRecipes(keywords);
    onSearchButton(keywords);
  };

  const handleReset = () => {};

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
              <RecipeIcon />
              <Heading
                title="My Meal IDEAS"
                color={colors.heading}
                fontSize={24}
              />
            </View>
            <Image
              style={styles.image}
              source={require("../../assets/cookbook-design.jpeg")}
            />
          </TouchableOpacity>
          <ScrollView style={styles.scroll}>
            {/* <CategoryPicker
              onCategoryPicked={handleCategoryPicked}
              onAddEntry={handleAddEntry}
            /> */}
            <Form
              initialValues={{ search: "" }}
              resetValues={{ search: "" }}
              onSubmit={handleSubmit}
              onHandleReset={handleReset}
              validationSchema={validationSchema}
              showClearButton={false}
            >
              <FormField
                autoCorrect={false}
                icon="pencil"
                name="search"
                placeholder="search keywords..."
                height={30}
                showClearButton={true}
                textInputWidth={180}
              />
              <SubmitButton title="SEARCH" icon="search" />
            </Form>
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
  },
  recipesContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
  },
  scroll: {
    marginBottom: 100,
  },
});
