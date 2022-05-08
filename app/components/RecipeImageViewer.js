import React, { Component, useState, useEffect } from "react";
import {
  Alert,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";

import WrapViewIcon from "./WrapViewIcon";
import ListImageViewIcon from "./ListImageViewIcon";

import {
  getScreenWidth,
  getImageWidth,
  getImageHeight,
} from "../utility/dimensions";
import colors from "../config/colors";
import StarRatingViewer from "./StarRatingViewer";

export default function RecipeImageViewer({
  images,
  allowDelete,
  onDeleteImage,
  onRecipeSelect,
  allowFullScreen = false,
  widthFactor = 1,
  paddingList = 20,
  paddingWrap = 68,
  maxImageHeight = 0,
  bgcolor = colors.greenLight,
  showRecipeTitle = false,
  showModeSelectorOverride = false,
}) {
  const [mode, setMode] = useState("wrap");
  const [modalVisible, setModalVisible] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [showModeSelector, setShowModeSelector] = useState(false);

  useEffect(() => {
    if (images.length > 1) {
      setMode("wrap");
      if (showModeSelectorOverride) setShowModeSelector(false);
      else setShowModeSelector(true);
    } else {
      setMode("list");
      setShowModeSelector(false);
    }
  }, [JSON.stringify(images)]);

  const handleModeChange = (mode) => {
    setMode(mode);
  };

  const handleDelete = (image) => {
    onDeleteImage(image);
  };

  const createDeleteAlert = (image) => {
    Alert.alert(
      "Confirm delete",
      "Are you sure you wish to delete this photo?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleDelete(image) },
      ]
    );
  };

  const handleFullScreen = () => {
    const zimages = images.map((image) => ({
      url: "",
      width: image.image_width,
      height: image.image_height,
      props: {
        source: {
          uri: image.imageUrl,
        },
      },
    }));
    setFullScreenImage(zimages);
    setModalVisible(true);
  };

  const handleRecipeSelect = (image) => {
    //
    if (allowFullScreen) handleFullScreen();
    else {
      if (onRecipeSelect) onRecipeSelect(image);
    }
  };

  return (
    <>
      {showModeSelector && (
        <View style={styles.modeContainer}>
          <ListImageViewIcon
            onPress={() => handleModeChange("list")}
            selected={mode == "list"}
            bgcolor={bgcolor}
          />
          <WrapViewIcon
            onPress={() => handleModeChange("wrap")}
            selected={mode == "wrap"}
            bgcolor={bgcolor}
          />
        </View>
      )}
      <ScrollView>
        <View style={styles.container}>
          {mode == "list"
            ? images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (allowDelete) return createDeleteAlert(image);
                    else handleRecipeSelect(image);
                  }}
                >
                  <Image
                    style={{
                      width: getImageWidth(
                        widthFactor,
                        paddingList,
                        image.image_width,
                        image.image_height
                      ),
                      height: getImageHeight(
                        widthFactor,
                        paddingList,
                        image.image_width,
                        image.image_height,
                        maxImageHeight
                      ),
                      marginBottom: 4,
                      borderRadius: 25,
                    }}
                    source={{ uri: image.imageUrl }}
                  />
                </TouchableOpacity>
              ))
            : images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (allowDelete) return createDeleteAlert(image);
                    else handleRecipeSelect(image);
                  }}
                >
                  <View style={{}}>
                    <Image
                      style={{
                        width:
                          getImageWidth(
                            widthFactor,
                            paddingWrap,
                            image.image_width,
                            image.image_height
                          ) / 2,
                        height:
                          getImageHeight(
                            widthFactor,
                            paddingWrap,
                            image.image_width,
                            image.image_height,
                            maxImageHeight
                          ) / 2,
                        marginLeft: 2,
                        marginTop: 2,
                        borderTopLeftRadius: showRecipeTitle ? 15 : 20,
                        borderTopRightRadius: showRecipeTitle ? 15 : 20,
                        borderBottomLeftRadius: showRecipeTitle ? 0 : 15,
                        borderBottomRightRadius: showRecipeTitle ? 0 : 15,
                      }}
                      source={{ uri: image.imageUrl }}
                    />
                    {showRecipeTitle && (
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                          backgroundColor: colors.greenMedium,
                          color: colors.white,
                          alignItems: "center",
                          padding: 5,
                          marginLeft: 1,
                          marginRight: 1,
                          marginBottom: 1,
                          width:
                            getImageWidth(
                              widthFactor,
                              paddingWrap,
                              image.image_width,
                              image.image_height
                            ) / 2,
                          height: 80,
                          borderBottomLeftRadius: 15,
                          borderBottomRightRadius: 15,
                        }}
                      >
                        <Text
                          style={{ color: colors.white, textAlign: "center" }}
                        >
                          {image.recipeTitle}
                        </Text>
                        <StarRatingViewer
                          rating={image.rating}
                          color={colors.white}
                          backgroundColor={colors.greenMedium}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
        </View>
      </ScrollView>
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.closeContainer}>
            <FontAwesome5
              name="window-close"
              size={30}
              onPress={() => setModalVisible(false)}
              color="white"
            />
          </View>
          {fullScreenImage && (
            <ImageViewer
              imageUrls={fullScreenImage}
              enableSwipeDown={true}
              onClick={() => setModalVisible(false)}
            />
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    //backgroundColor: "blue",
  },
  box: {
    width: getScreenWidth(40) / 2,
    height: getScreenWidth(40) / 2,
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  modalContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    backgroundColor: colors.black,
    justifyContent: "center",
  },
  closeContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
});
