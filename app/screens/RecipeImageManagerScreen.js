import React, { Component, useState, useEffect } from "react";
import { View, Modal, ScrollView, StyleSheet } from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";

import Screen from "../components/Screen";
import Button from "../components/Button";
import Heading from "../components/Heading";
import ImagePicker from "../components/ImagePicker";
import RecipeImageViewer from "../components/RecipeImageViewer";
import {
  getRecipeImages,
  deleteRecipeImage,
  saveRecipeImage,
} from "../api/recipeImagesApi";
import routes from "../navigation/routes";
import colors from "../config/colors";

export default function RecipeImageManagerScreen({ route, navigation }) {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeId, setRecipeId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      loadScreen();
    });
  }, []);

  const loadScreen = async () => {
    try {
      setLoading(true);
      console.log(route.params.id);
      setRecipeId(route.params.id);
      setRecipeTitle(route.params.recipeTitle);
      await loadImages(route.params.id);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async (id) => {
    try {
      setLoading(true);
      const images = await getRecipeImages(id);
      setImages(images);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = () => {
    setModalVisible(true);
  };

  const handleImagePicked = async (data) => {
    let image = {
      recipe_id: recipeId,
      recipe_image: data.image,
      recipe_image_format: data.image_format,
      image_width: data.image_width,
      image_height: data.image_height,
      show_main_image: true,
      owner_id: 1,
    };
    await saveRecipeImage(image);
    setModalVisible(false);
    await loadImages(recipeId);
  };

  const handleImageCancel = () => {
    setModalVisible(false);
  };

  const handleDone = () => {
    navigation.navigate(routes.SEARCH_RECIPE);
  };

  const handleImageDelete = async (image) => {
    await deleteRecipeImage(image);
    await loadImages(recipeId);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen>
        <ScrollView>
          <View style={styles.container}>
            <Heading
              title="Photo Picker"
              fontSize={20}
              color={colors.heading}
              icon="camera"
            />
            <Heading title={recipeTitle} fontSize={16} color={colors.white} />
            <View style={styles.boxContainer}>
              {images.length === 0 ? <View style={styles.box}></View> : null}
            </View>
            <RecipeImageViewer
              images={images}
              onDeleteImage={handleImageDelete}
              allowDelete={true}
              initialMode="wrap"
            />
            <Button
              title="ADD PHOTO"
              onPress={handleAddPhoto}
              color="heading"
            />
            <Button title="DONE" onPress={handleDone} color="greenDark" />
          </View>
        </ScrollView>
      </Screen>
      <Modal visible={modalVisible} animationType="slide">
        <ImagePicker
          onImageDone={handleImagePicked}
          onImageCancel={handleImageCancel}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 300,
    height: 300,
    backgroundColor: colors.black,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: colors.greenMedium,
    borderRadius: 25,
    padding: 10,
  },
});
