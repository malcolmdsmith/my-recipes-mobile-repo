import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NewRecipeScreen from "../screens/NewRecipeScreen";
import AddIngredientsScreen from "../screens/AddIngredientsScreen";
import ViewRecipeScreen from "../screens/ViewRecipeScreen";
import SearchRecipesScreen from "../screens/SearchRecipesScreen";
import RecipeImageManagerScreen from "../screens/RecipeImageManagerScreen";
import ShoppingListScreen from "../screens/ShoppingListScreen ";
import CategoryManagerScreen from "../screens/CategoryManagerScreen";
import SignInScreen from "../screens/SignInScreen";

const Stack = createStackNavigator();

const RecipeContainerNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="SearchRecipes"
  >
    <Stack.Screen name="SearchRecipes" component={SearchRecipesScreen} />
    <Stack.Screen name="NewRecipe" component={NewRecipeScreen} />
    <Stack.Screen name="ViewRecipe" component={ViewRecipeScreen} />
    <Stack.Screen name="AddIngredients" component={AddIngredientsScreen} />
    <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
    <Stack.Screen
      name="RecipeImageManager"
      component={RecipeImageManagerScreen}
    />
    <Stack.Screen name="CategoryManager" component={CategoryManagerScreen} />
    <Stack.Screen name="SignInScreen" component={SignInScreen} />
  </Stack.Navigator>
);

export default RecipeContainerNavigator;
