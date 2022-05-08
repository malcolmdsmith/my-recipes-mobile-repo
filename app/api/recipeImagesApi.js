import APIKit from "./apiKit";
import { getS3Image, uploadImageS3, deleteS3Image } from "../utility/amplify";
import { v4 as uuidv4 } from "uuid";

function getUrl(uri) {
  return `/recipe_images/${uri}`;
}

export async function getRecipeImages(recipeId) {
  const images = await APIKit.get(getUrl(`recipe/${recipeId}`));
  return await getImageUrls(images);
}

export async function getRecipeImagesNoCategory(recipeId) {
  const images = await APIKit.get(getUrl(`recipe/nocategory/${recipeId}`));
  return await getImageUrls(images);
}

export async function getImagesByKeywords(keywords, offset, imageCount) {
  if (keywords === null || keywords === "") keywords = "none";
  if (isNaN(offset)) offset = 0;

  const data = await APIKit.get(
    getUrl(`category/${keywords}?offset=${offset}&imageCount=${imageCount}`)
  );
  await getImageUrls(data.images);

  return data;
}

export async function getImages(offset, imageCount) {
  const images = await APIKit.get(
    getUrl(`images?offset=${offset}&imageCount=${imageCount}`)
  );

  return await getImageUrls(images);
}

async function getImageUrls(images) {
  for (const image of images) {
    const imgUrl = await getS3Image(image.image);
    //console.log("img...", img);
    image.imageUrl = imgUrl.split("?")[0];
  }
  return images;
}

export async function saveRecipeImage(image) {
  console.log(image);

  let result;
  try {
    if (image.image_id) {
      const body = { ...image };
      delete body.image_id;

      result = await APIKit.put(getUrl(image.image_id), body);
    }
    const id = uuidv4();
    const s3Key = `recipe/${id}.${image.recipe_image_format}`;
    const imgfile = image.recipe_image;
    image.recipe_image = s3Key;
    result = await APIKit.post("/recipe_images", image);
    const response = await fetch(imgfile);
    const blob = await response.blob();
    await uploadImageS3(s3Key, blob);
  } catch (e) {
    console.log(e);
  } finally {
    return result;
  }
}

export async function deleteRecipeImage(image) {
  try {
    await APIKit.delete(getUrl(image.image_id));
    await deleteS3Image(image.image);
  } catch (e) {
    console.log(e);
  }
}

export async function deleteImagesByRecipe(images) {
  for (const image of images) {
    await deleteS3Image(image.image);
  }
}
