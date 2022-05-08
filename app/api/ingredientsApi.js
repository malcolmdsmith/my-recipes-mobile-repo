import APIKit from "./apiKit";

function getUrl(uri) {
  return `/ingredients/${uri}`;
}

export function getIngredients(recipeId) {
  return APIKit.get(getUrl(`recipe/${recipeId}`));
}

export function saveIngredient(formdata) {
  const ingredient = getDBIngredient(formdata);
  if (ingredient.id) {
    const body = { ...ingredient };
    delete body.id;

    return APIKit.put(getUrl(ingredient.id), body);
  }
  return APIKit.post("/ingredients", ingredient);
}

export function deleteIngredient(id) {
  return APIKit.delete(getUrl(id));
}

function getDBIngredient(formdata) {
  let ingredient = {};

  ingredient.ingredientName = formdata.ingredientName;
  ingredient.measure = formdata.measure;
  ingredient.qty = formdata.qty;
  ingredient.recipeId = formdata.recipeId;

  return ingredient;
}
