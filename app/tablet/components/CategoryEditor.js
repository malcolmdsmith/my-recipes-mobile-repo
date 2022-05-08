import React, { Component, useState } from "react";
import { View, StyleSheet, Image, Modal, Text } from "react-native";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { isTablet } from "react-native-device-detection";

import colors from "../../config/colors";
import { Form, FormField, SubmitButton } from "../../components/forms";
import ImagePicker from "../../components/ImagePicker";
import { saveRecipeCategory } from "../../api/recipeCategoriesApi";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import { getImageWidth, getImageHeight } from "../../utility/dimensions";
import { uploadImageS3 } from "../../utility/amplify";

const validationSchema = Yup.object().shape({
  category_name: Yup.string().required().max(30).label("Category Name"),
  category_image: Yup.string(),
  category_image_format: Yup.string(),
  image_width: Yup.number(),
  image_Height: Yup.number(),
});

export default CategoryEditor = ({ onCategoryAdded, onCategoryCancel }) => {
  const [image, setImage] = useState(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [imageRequired, setImageRequired] = useState("");
  const [validationMsg, setValidationMsg] = useState("");

  const handleSubmit = async (data, { resetForm }) => {
    let result;
    try {
      if (image === null) {
        setImageRequired("You must add an image to the category!");
        return;
      }
      const id = uuidv4();
      const s3Key = `${data.category_name}/${id}.${image.image_format}`;
      const response = await fetch(image.image);
      const blob = await response.blob();
      await uploadImageS3(s3Key, blob);

      let category = {
        category_name: data.category_name.toString().toUpperCase(),
        category_image: s3Key,
        category_image_format: image.image_format,
        image_width: image.image_width,
        image_height: image.image_height,
      };
      result = await saveRecipeCategory(category);

      resetForm();
      setImageRequired("");
      setValidationMsg("");
      setImage(null);
      onCategoryAdded();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDone = () => {
    setPhotoModalVisible(false);
    onCategoryCancel();
  };

  const handleImagePicked = (data) => {
    setPhotoModalVisible(false);
    setImage(data);
  };

  const handleCancel = () => {
    setPhotoModalVisible(false);
    onCategoryCancel();
  };

  const handleAddPhoto = () => {
    setPhotoModalVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.editor}>
          {image ? (
            <Image
              style={{
                width: isTablet
                  ? getImageWidth(
                      0.7,
                      0,
                      image.image_width,
                      image.image_height
                    ) / 2
                  : getImageWidth(1, 40, image.image_width, image.image_height),
                height: isTablet
                  ? getImageHeight(
                      0.7,
                      0,
                      image.image_width,
                      image.image_height,
                      600
                    ) / 2
                  : getImageHeight(
                      1,
                      0,
                      image.image_width,
                      image.image_height,
                      600
                    ),
                margin: 2,
                borderRadius: 20,
              }}
              source={{
                uri: image.image,
              }}
            />
          ) : (
            <View style={styles.box}>
              <Heading title="Category Photo" color="white" fontSize={20} />
            </View>
          )}
          {imageRequired != "" ? (
            <Text style={{ color: "red", textAlign: "center" }}>
              {imageRequired}
            </Text>
          ) : null}
          {validationMsg != "" ? (
            <Text style={{ color: "red", textAlign: "center" }}>
              {validationMsg}
            </Text>
          ) : null}
          <Form
            onSubmit={handleSubmit}
            initialValues={{ category_name: "" }}
            validationSchema={validationSchema}
          >
            <FormField
              icon="pencil"
              autoCorrect={false}
              name="category_name"
              placeholder="Category Name"
              width={300}
            />
            <SubmitButton title="SAVE" color="greenMedium" />
          </Form>
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
      </View>
      <Modal visible={photoModalVisible} animationType="slide">
        <ImagePicker
          onImageDone={handleImagePicked}
          onImageCancel={handleCancel}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "blue",
  },
  box: {
    width: 300,
    height: 220,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  editor: {},
});
