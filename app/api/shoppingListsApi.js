import APIKit from "./apiKit";

function getUrl(uri) {
  return `/shopping_lists/${uri}`;
}

export function findOne(owner_id) {
  return APIKit.get(getUrl(`item/findone/${owner_id}`));
}

export function getAllShoppingLists(owner_id, master_list) {
  const url = getUrl(
    `lists/all?owner_id=${owner_id}&master_list=${master_list}`
  );
  return APIKit.get(url);
}

export function saveShoppingList(item) {
  //
  if (item.id) {
    const body = { ...item };
    delete body.id;

    return APIKit.put(getUrl(item.id), body);
  }
  return APIKit.post("/shopping_lists", item);
}

export function deleteShoppingList(owner_id, shopping_list_name) {
  return APIKit.delete(
    getUrl(`?owner_id=${owner_id}&shopping_list_name=${shopping_list_name}`)
  );
}

// export function deleteShoppingListsByUser(
//   owner_id,
//   master_list,
// ) {
//   return APIKit.delete(
//     getUrl(
//       `items/user?owner_id=${owner_id}&master_list=${master_list}&shopping_list_name=${shopping_list_name}`
//     )
//   );
// }
