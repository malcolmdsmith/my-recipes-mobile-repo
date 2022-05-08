export default function getEnum(list, valueProperty, textProperty, listName) {
    const convertedResult = list.reduce((p, n) => ({ ...p, [n[valueProperty]]: n[textProperty] }), {});
 //   console.log(convertedResult);
    return t.enums(convertedResult, listName);
}