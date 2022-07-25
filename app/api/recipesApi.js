import APIKit from "./apiKit";
import { getCurrentUser } from "./userApi";
import {
  getRecipeImagesNoCategory,
  deleteImagesByRecipe,
} from "./recipeImagesApi";
//import { log } from "../utility/logger";
import Bugsnag from "@bugsnag/expo";

function getUrl(uri) {
  return `/recipes/${uri}`;
}

export async function getRecipes(keywords, offset, count) {
  const url = `search?keywords=${keywords}&currentPage=${offset}&pageSize=${count}`;
  //console.log("Auth...", APIKit.defaults.headers.common["Authorization"]);
  return APIKit.get(getUrl(url));
}

export async function getRecipeById(id) {
  //
  const url = getUrl(id);
  const recipe = await APIKit.get(url);
  const user = await getCurrentUser();
  switch (user.role) {
    case "guest":
      recipe.AllowEdits = false;
      break;
    case "user":
      if (user.id === recipe.owner_id) recipe.AllowEdits = true;
      else recipe.AllowEdits = false;
      break;
    case "admin":
      recipe.AllowEdits = true;
      break;
    default:
      recipe.AllowEdits = false;
      break;
  }
  return recipe;
}

export async function saveRecipe(formrecipe) {
  console.info("Saving...");
  const recipe = await getDBRecipe(formrecipe);
  if (recipe.id) {
    const body = { ...recipe };
    delete body.id;

    try {
      let result = await APIKit.put(getUrl(recipe.id), body);
      console.info("result...", result);
      return formrecipe;
    } catch (err) {
      console.info("put...", err);
    }
  }
  //
  try {
    let result = APIKit.post("/recipes", recipe);
    return result;
  } catch (err) {
    //   log(err);
  }
}

export async function deleteRecipe(id) {
  try {
    const images = await getRecipeImagesNoCategory(id);
    await APIKit.delete(getUrl(id));
    await deleteImagesByRecipe(images);
  } catch (e) {
    console.log(e);
  }
}

async function getDBRecipe(formrecipe) {
  const user = await getCurrentUser();
  //
  let recipe = {
    recipeTitle: formrecipe.recipeTitle,
    category: formrecipe.category,
    recipeSource: formrecipe.recipeSource,
    recipeSourceData: formrecipe.recipeSourceData || "",
    prepTime: formrecipe.prepTime || "",
    cookTime: formrecipe.cookTime || "",
    method: formrecipe.method || "",
    comments: formrecipe.comments || "",
    rating: formrecipe.rating || 0,
    owner_id: formrecipe.owner_id === 0 ? user.id : formrecipe.owner_id,
  };
  //
  if (formrecipe.id > 0) recipe.id = formrecipe.id;
  //console.log(recipe);
  return recipe;
}
