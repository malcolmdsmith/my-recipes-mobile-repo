import APIKit from "./apiKit";

const endPoint = "cats";

function getUrl(uri) {
  return `${endPoint}/${uri}`;
}

export function getCategoryImage(categoryName) {
  return APIKit.get(getUrl(`category/${categoryName}`));
}

export async function getCategories() {
  try {
    console.log("getCats...");
    let response = await fetch(`http://192.168.1.4:4000/api/${endPoint}/all`);
    let json = await response.json();
    console.log(json);
    return json;
  } catch (e) {
    console.log(e);
  }
}

export function getAllCategories() {
  return APIKit.get(`${endPoint}/all`);
}

export function getNamesList() {
  return APIKit.get(getUrl(`list`));
}

export async function saveCategory(category) {
  category.category_name = category.category_name.toUpperCase();

  if (category.id) {
    const body = { ...category };
    delete body.id;

    return APIKit.put(getUrl(category.id), body);
  }
  try {
    const response = await APIKit.post(`/${endPoint}`, category);
  } catch (err) {
    if (err.response.data.message === "Category with the name already exists.")
      return err.response.data.message;
    else throw err;
  }
}

export function deleteCategory(name) {
  return APIKit.delete(getUrl(name));
}
