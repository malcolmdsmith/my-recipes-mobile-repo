import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

import { getImagesByKeywords } from "../../api/recipeImagesApi";
import RecipeImageViewer from "../../components/RecipeImageViewer";
import { getImageHeight } from "../../utility/dimensions";
import ActivityIndicator from "../../components/ActivityIndicator";
import Pagination from "../../components/Pagination";
import colors from "../../config/colors";

export default ImagesPanel = ({
  keywords,
  onRecipeSelect,
  onShowCategoriesImagePicker,
  currentPage,
  onSearchLoadDone,
}) => {
  const [images, setImages] = useState([]);
  const [maxImageHeight, setMaxImageHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => await loadImages(currentPage))();
  }, [keywords]);

  const loadImages = async (page) => {
    try {
      //setLoading(true);
      setPage(page);
      const offset = page * pageSize;
      //
      const data = await getImagesByKeywords(keywords, offset, pageSize);
      setTotalItems(data.totalItems);
      setMaxImageHeight(getMaximumHeight(data.images));
      setImages(data.images);
    } catch (e) {
      console.log(e);
    } finally {
      onSearchLoadDone();
    }
  };

  const handlePageChange = async (page) => {
    await loadImages(page);
  };

  const getMaximumHeight = (images) => {
    let maxheight = 10000;
    images.forEach((image) => {
      let calcHeight = getImageHeight(
        0.7,
        45,
        image.image_width,
        image.image_height
      );
      if (calcHeight < maxheight) maxheight = calcHeight;
    });
    return maxheight;
  };

  const handleRecipeSelect = async (image) => {
    onRecipeSelect(image, page);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      {images.length > 0 && (
        <View style={styles.viewer}>
          <RecipeImageViewer
            images={images}
            widthFactor={0.7}
            paddingWrap={45}
            maxImageHeight={maxImageHeight}
            showRecipeTitle={true}
            showModeSelectorOverride={true}
            onRecipeSelect={handleRecipeSelect}
          />
        </View>
      )}
      {images.length === 0 ? (
        <Text style={styles.text}>No meals found.</Text>
      ) : (
        <View style={styles.footer}>
          <Text style={styles.text}>{totalItems + " meals found."}</Text>
          <Pagination
            pageSize={pageSize}
            itemsCount={totalItems}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 0,
    marginLeft: 20,
  },
  text: {
    color: colors.white,
    marginRight: 110,
  },
  viewer: {
    height: 675,
  },
});
