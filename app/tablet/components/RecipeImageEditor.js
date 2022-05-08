import React, { Component, useState, useEffect } from "react";
import {
  View,
  Modal,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Text,
} from "react-native";
import ActivityIndicator from "../../components/ActivityIndicator";
import { isTablet } from "react-native-device-detection";

import Screen from "../../components/Screen";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import ImagePicker from "../../components/ImagePicker";
import RecipeImageViewer from "../../components/RecipeImageViewer";
import {
  getRecipeImagesNoCategory,
  deleteRecipeImage,
  saveRecipeImage,
} from "../../api/recipeImagesApi";
import colors from "../../config/colors";
import { getScreenHeight, getScreenWidth } from "../../utility/dimensions";

export default function RecipeImageEditor({ recipe, onPhotosDone }) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadScreen();
  }, []);

  const loadScreen = async () => {
    try {
      setLoading(true);
      await loadImages(recipe.id);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async (id) => {
    try {
      setLoading(true);
      const images = await getRecipeImagesNoCategory(id);
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
      recipe_id: recipe.id,
      recipe_image: data.image,
      recipe_image_format: data.image_format,
      image_width: data.image_width,
      image_height: data.image_height,
      show_main_image: true,
      mealOfTheWeek: false,
      owner_id: 1,
    };

    await saveRecipeImage(image);
    setModalVisible(false);
    await loadImages(recipe.id);
  };

  const handleImageCancel = () => {
    setModalVisible(false);
  };

  const handleDone = () => {
    onPhotosDone();
    //navigation.navigate(routes.SEARCH_RECIPE);
  };

  const handleImageDelete = async (image) => {
    await deleteRecipeImage(image);
    await loadImages(recipe.id);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ImageBackground
        style={styles.imagebackground}
        source={require("../../assets/cookbook-design.jpeg")}
      >
        <ScrollView>
          <View style={styles.container}>
            <Heading title="Photo Picker" fontSize={20} icon="camera" />
            <Heading
              title={recipe.recipeTitle}
              fontSize={16}
              color={colors.white}
            />
            <Text style={styles.text}>Tap a photo to delete it.</Text>
            <View style={styles.boxContainer}>
              {images.length === 0 ? <View style={styles.box}></View> : null}
            </View>
            <RecipeImageViewer
              images={images}
              onDeleteImage={handleImageDelete}
              allowDelete={true}
              initialMode="wrap"
              widthFactor={0.5}
            />
            <Button
              title="ADD PHOTO"
              onPress={handleAddPhoto}
              color="heading"
              icon="camera"
            />
            <Button
              title="DONE"
              onPress={handleDone}
              color="greenDark"
              icon="smile"
            />
          </View>
        </ScrollView>
      </ImageBackground>
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
    flex: 1,
    width: isTablet ? "50%" : "100%",
    padding: 20,
    margin: 20,
    borderRadius: 20,
    backgroundColor: colors.greenMedium,
    minHeight: 700,
  },
  imagebackground: {
    width: getScreenWidth(0),
    height: getScreenHeight(0),
  },
  text: {
    color: colors.white,
    marginBottom: 10,
  },
});
