export function getCategories(addBlank) {
  const categories = [];

  if (addBlank) categories.push("");
  categories.push("BEEF");
  categories.push("POULTRY");
  categories.push("PORK");
  categories.push("LAMB");
  categories.push("VEAL");
  categories.push("PASTA");
  categories.push("CHICKEN");
  categories.push("FISH");
  categories.push("SAUCES");
  categories.push("CURRY");
  categories.push("VEGETABLES");
  categories.push("OTHER");

  return categories;
}

export function getSourceOptions() {
  const options = [];

  options.push("Cookbook");
  options.push("Manual Entry");
  options.push("Meal Idea");
  options.push("Photo");
  options.push("Takeaway");
  options.push("Web Link");

  return options;
}

export function getRatings() {
  const ratings = [];

  ratings.push("0");
  ratings.push("0.5");
  ratings.push("1.0");
  ratings.push("1.5");
  ratings.push("2.0");
  ratings.push("2.5");
  ratings.push("3.0");
  ratings.push("3.5");
  ratings.push("4.0");
  ratings.push("4.5");
  ratings.push("5.0");

  return ratings;
}

export function getMeasureTypes() {
  const types = [];

  types.push("bunch");
  types.push("can");
  types.push("clove");
  types.push("cloves");
  types.push("cup");
  types.push("each");
  types.push("grams");
  types.push("heaped tsp");
  types.push("kilograms");
  types.push("large knobs");
  types.push("pkt");
  types.push("ml");
  types.push("rashers");
  types.push("tblsp");
  types.push("tsp");

  return types;
}

export default {
  getCategories,
  getSourceOptions,
  getRatings,
  getMeasureTypes,
};
