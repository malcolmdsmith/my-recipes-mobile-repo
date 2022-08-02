import APIKit from "./apiKit";

function getUrl(uri) {
  return `/recipe_lists/${uri}`;
}

export function getMealsByUserId(owner_id) {
  return APIKit.get(getUrl(`${owner_id}`));
}

export function saveRecipeList(item) {
  //
  console.info("item..", item);
  if (item.id) {
    const body = { ...item };
    delete body.id;

    return APIKit.put(getUrl(item.id), body);
  }
  return APIKit.post("/recipe_lists", item);
}

export function deleteRecipeList(id) {
  return APIKit.delete(getUrl(`?id=${id}`));
}
