import APIKit from "./apiKit";
import { getS3Image, deleteS3Image } from "../utility/amplify";

const endPoint = "recipe_categories";

function getUrl(uri) {
  return `/${endPoint}/${uri}`;
}

export async function getRecipeCategories() {
  try {
    //    const categories = await APIKit.get(endPoint);
    let res = await fetch("http://192.168.1.4:4000/api/recipe_categories");
    let categories = await res.json();
    return categories; //await getImageUrls(categories);
  } catch (e) {
    console.log("ERRR...", e);
  }
}
export async function getRecipeCategoriesx() {
  try {
    let res = await fetch("http://192.168.1.4:4000/api/recipe_categories");
    let categories = await res.json();
    //console.log("json...", categories[0].category_image);
    const imgUrl = await getS3Image(categories[0].category_image);
    //console.log(imgUrl.split("?")[0]);
    categories[0].imageUrl = imgUrl.split("?")[0];
    //console.log("cat...", categories[0]);
    const cats = [];
    cats.push(categories[0]);
    //console.log(cats);
    return cats;
    //return [];
    for (const category of categories) {
      console.log("1...", category.category_image);
      //const imgUrl = await getS3Image(category.category_image);
      console.log("2");
      //category.imageUrl = imgUrl.split("?")[0];
      // console.log(category);
    }
    return json;
  } catch (error) {
    console.log(error);
  }
}
async function getImageUrls(categories) {
  console.log("Start...", categories.length);
  for (const category of categories) {
    console.log("1...", category.category_image);
    //const imgUrl = await getS3Image(category.category_image);
    console.log("2");
    //category.imageUrl = imgUrl.split("?")[0];
    console.log(category);
  }
  return categories;
}

export async function getRecipeCategoryNames() {
  const data = await APIKit.get(`${endPoint}/list`);
  const names = data.map((data) => data.category_name);
  return names;
}

export async function getRecipeCategoryImage(name) {
  const category = await APIKit.get(getUrl(`category/${name}`));
  const imgUrl = await getS3Image(category.image);
  category.imageUrl = imgUrl.split("?")[0];
  return category;
}

export function saveRecipeCategory(image) {
  if (image.id) {
    const body = { ...image };
    delete body.id;

    return APIKit.put(getUrl(image.id), body);
  }
  return APIKit.post(endPoint, image);
}

export async function deleteCategory(name) {
  await deleteS3Image(name);
}
