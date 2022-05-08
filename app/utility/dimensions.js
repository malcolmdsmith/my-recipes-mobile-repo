import { Dimensions } from "react-native";
import { isTablet } from "react-native-device-detection";

export function getScreenWidth(padding) {
  const dimensions = Dimensions.get("window");
  const width = dimensions.width - padding;

  return width;
}

export function getScreenHeight(padding) {
  const dimensions = Dimensions.get("window");
  const height = dimensions.height - padding;

  return height;
}

export function getPaginationButtonWidth() {
  const dimensions = Dimensions.get("window");
  const factor = isTablet ? 20 : 15;
  const width = dimensions.width / 4 - factor;

  return width;
}

export function getImageWidth(
  width_factor = 1,
  padding,
  image_width,
  image_height
) {
  const dimensions = Dimensions.get("window");
  const imageWidth = dimensions.width * width_factor - padding;

  return imageWidth;
}

export function getImageHeight(
  width_factor = 1,
  padding,
  image_width,
  image_height,
  maxImageHeight = 0
) {
  const dimensions = Dimensions.get("window");
  //const imageHeight = Math.round((dimensions.width * 3) / 4);
  const imageWidth = getImageWidth(width_factor, padding);
  let height = 0;
  let calcHeight = (image_height / image_width) * imageWidth;

  if (maxImageHeight > 0) {
    if (calcHeight > maxImageHeight) height = maxImageHeight;
    else height = calcHeight;
  } else height = calcHeight;

  return height;
}

export function getFullScreenWidth(image_width, image_height) {
  const screen_width = getScreenWidth(0);
  const screen_height = getScreenHeight(0);

  const width = (image_width / image_height) * screen_height;
  console.log(image_width, image_height, screen_width, screen_height, width);
  return width;
}

export function getFullScreenHeight() {
  return getScreenHeight(0);
}
