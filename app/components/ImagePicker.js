import React, { Component, useState, useEffect } from "react";
import { View, Image, StyleSheet, ImageBackground } from "react-native";
import * as expoImagePicker from "expo-image-picker";
import { isTablet } from "react-native-device-detection";

import ActivityIndicator from "../components/ActivityIndicator";
import Button from "./Button";
import colors from "../config/colors";
import { getScreenWidth, getImageHeight } from "../utility/dimensions";

export default function ImagePicker({ onImageDone, onImageCancel }) {
  const [image, setImage] = useState(null);
  const [imageFormat, setImageFormat] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [base64, setBase64] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        let { status } =
          await expoImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert(
            "Sorry, we need camera roll permissions to make this work!" +
              mstatus
          );
        }
      }
      if (Platform.OS !== "web") {
        const { status } =
          await expoImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await expoImagePicker.launchImageLibraryAsync({
      mediaTypes: expoImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      //aspect: [4, 3],
      quality: 0.5,
      maxWidth: 500,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setBase64(result.base64);
      setImageWidth(result.width);
      setImageHeight(result.height);
      setImageFormat(result.uri.split(".").pop());
      //const key = result.uri.split("/").pop();

      //console.log("Start...", result.uri);
      //const blob = await urlToBlob(result.uri);
      //const response = await fetch(result.uri);
      //const blob = await response.blob();
      //console.log("blob: ", blob.length);
      //UploadImage(`BEEF/${key}`, result.uri);
    } else {
      setCancelled(true);
    }
  };

  const takePhoto = async () => {
    let result = await expoImagePicker.launchCameraAsync({
      mediaTypes: expoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 0.5,
      maxWidth: 500,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setBase64(result.base64);
      setImageWidth(result.width);
      setImageHeight(result.height);
      setImageFormat(result.uri.split(".").pop());
    } else {
      setCancelled(true);
    }
  };

  const handleDone = async () => {
    if (base64 === "") {
      onImageCancel();
      return;
    }

    const data = {
      imagebase64: base64,
      image: image,
      image_format: imageFormat,
      image_width: imageWidth,
      image_height: imageHeight,
    };
    onImageDone(data);
  };

  const handleCancel = () => {
    onImageCancel();
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ImageBackground
        style={styles.imageBackground}
        source={require("../assets/cookbook-design.jpeg")}
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  width: isTablet ? 400 : getScreenWidth(40),
                  height: isTablet ? 300 : getScreenWidth(40) * (3 / 4),
                }}
              />
            )}
          </View>
          <View style={styles.buttons}>
            <Button
              title="SELECT IMAGE"
              onPress={pickImage}
              color="heading"
              icon="camera"
            />
            <Button
              title="TAKE PHOTO"
              onPress={takePhoto}
              color="heading"
              icon="camera"
            />
            <Button
              title="DONE"
              onPress={handleDone}
              color="greenDark"
              icon="smile"
            />
            <Button
              title="CANCEL"
              onPress={handleCancel}
              color="greenDark"
              icon="window-close"
            />
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: isTablet ? "50%" : "95%",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.greenMedium,
    borderRadius: 20,
    margin: 20,
  },
  buttons: {
    justifyContent: "center",
    width: "100%",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 20,
    width: isTablet ? 400 : getScreenWidth(40),
    height: isTablet ? 300 : getScreenWidth(40) * (3 / 4),
    backgroundColor: colors.black,
    alignSelf: "center",
    margin: 20,
  },
  submit: {},
});
