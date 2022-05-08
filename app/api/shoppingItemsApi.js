import APIKit from "./apiKit";
import { getCurrentUser } from "./userApi";

function getUrl(uri) {
  return `/shopping_items/${uri}`;
}

export function getByDate(date) {
  return APIKit.get(getUrl(`date/${date}`));
}

export function findOne(owner_id) {
  return APIKit.get(getUrl(`item/findone/${owner_id}`));
}

export function getAllShoppingItems(
  owner_id,
  shopping_list_name,
  runClearAndPicked
) {
  return APIKit.get(
    getUrl(
      `items/all?owner_id=${owner_id}&shopping_list_name=${shopping_list_name}&runClearAndPicked=${runClearAndPicked}&master_list=1`
    )
  );
}

export async function getListNames(owner_id) {
  const names = await APIKit.get(getUrl(`list/names?owner_id=${owner_id}`));
  return names.map((n) => n.shopping_list_name);
}

export function findIngredientShoppingList(
  owner_id,
  master_list,
  ingredient,
  shopping_list_name
) {
  return APIKit.get(
    getUrl(
      `item/ingredient?owner_id=${owner_id}&master_list=${master_list}&ingredient=${ingredient}&shopping_list_name=${shopping_list_name}`
    )
  );
}

export function clearPickedItems(owner_id, master_list) {
  return APIKit.get(
    getUrl(`clear/picked?owner_id=${owner_id}&master_list=${master_list}`)
  );
}

export async function saveShoppingItem(item) {
  //
  if (item.picked === 1) item.picked = true;
  else if (item.picked === 0) item.picked = false;
  if (item.master_list === 1) item.master_list = true;
  else if (item.master_list === 0) item.master_list = false;

  let result = null;
  if (item.id) {
    const body = { ...item };
    delete body.id;

    result = await APIKit.put(getUrl(item.id), body);
  } else {
    result = await APIKit.post("/shopping_items", item);
  }

  return result;
}

export function deleteShoppingItem(id) {
  return APIKit.delete(getUrl(id));
}

export function deleteShoppingItemsByUser(
  owner_id,
  master_list,
  shopping_list_name
) {
  return APIKit.delete(
    getUrl(
      `items/user?owner_id=${owner_id}&master_list=${master_list}&shopping_list_name=${shopping_list_name}`
    )
  );
}

export async function updateMasterListToShoppingList(shopping_list) {
  const user = await getCurrentUser();
  //
  await clearPickedItems(user.id, 1);
  await updateMasterListPicked(user.id, shopping_list);
}

export function updateCost(item) {
  return APIKit.get(
    getUrl(
      `update/cost?owner_id=${item.owner_id}&ingredient=${item.ingredientName}&cost=${item.cost}&id=${item.id}`
    )
  );
}

export function updateMasterListPicked(owner_id, shopping_list) {
  return APIKit.get(
    getUrl(
      `update/picked?owner_id=${owner_id}&shopping_list_name=${shopping_list}`
    )
  );
}
