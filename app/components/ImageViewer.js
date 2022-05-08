import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Text, Image } from "react-native";
import { isTablet } from "react-native-device-detection";

import { getImages, getImageCount, getImageByAlpha } from "../api/aircraftApi";
import Link from "../components/Link";
import Button from "../components/Button";
import colors from "../config/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import getHomeScreenBase64Image from "../utility/homeScreenImageBase64";
import AlphabetPicker from "../components/AlphabetPicker";
import ImageViewerButton from "./ImageViewerButton";

export default class ImageViewer extends Component {
  state = {
    totalImages: 0,
    cachedImageCount: 6,
    images: [],
    currentImage: 0,
    currentCached: 0,
    imageCount: 6,
    maxImageHeight: isTablet ? 630 : 310,
    loading: false,
    initialLoad: true,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const totalImages = await getImageCount();

    const images = this.getHomeScreenImage();

    this.setState({
      images: images,
      totalImages: totalImages[0].imageCount - 1,
      loading: false,
    });
  }

  getHomeScreenImage() {
    const image = {
      aircraft_image: getHomeScreenBase64Image(),
      aircraft_image_format: "jpg",
      aircraft_name: "Kittyhawk",
      aircraft_id: 4497,
      aircraftType: "Fighter",
      year_of_manufacture: "1942",
      image_width: 750,
      image_height: 563,
    };
    const images = [];
    images.push(image);

    return images;
  }

  handleNextImage = async () => {
    let {
      totalImages,
      currentImage,
      currentCached,
      cachedImageCount,
      initialLoad,
    } = this.state;

    if (initialLoad) {
      await this.loadFirstNCachedImages();
      return;
    }

    currentImage += 1;
    if (currentImage === totalImages) return;
    let images = [];

    if (currentCached < cachedImageCount - 1) {
      currentCached += 1;
      this.setState({ currentImage, currentCached });
    } else {
      this.setState({ loading: true });
      images = await getImages(currentImage + 1, cachedImageCount);
      currentCached = 0;

      this.setState({
        currentImage,
        currentCached,
        images,
        loading: false,
      });
    }
  };

  loadFirstNCachedImages = async () => {
    const { cachedImageCount } = this.state;
    //console.log("Start...");
    if (this.setState) this.setState({ loading: true });
    //    return;
    const images = await getImages(0, cachedImageCount);
    //console.log("getImages done");
    const currentCached = 0;
    const currentImage = 0;
    ///console.log("2nd setState");
    this.setState({
      currentImage,
      currentCached,
      images,
      loading: false,
      initialLoad: false,
    });
  };

  handlePrevImage = async () => {
    let { currentImage, currentCached, cachedImageCount } = this.state;

    if (currentImage === 0) return;

    let images = [];
    let newCount = 0;
    currentImage -= 1;
    if (currentCached === 0) {
      if (currentImage <= cachedImageCount) newCount = 0;
      else newCount = currentImage - cachedImageCount + 2;
      this.setState({ loading: true });
      images = await getImages(newCount, cachedImageCount);
      currentCached = 5;
      this.setState({
        currentImage,
        currentCached,
        images,
        loading: false,
      });
    } else {
      currentCached -= 1;
      this.setState({ currentImage, currentCached });
    }
  };

  handleFirstImage = async () => {
    await this.loadFirstNCachedImages();
  };

  handleLastImage = async () => {
    const { cachedImageCount } = this.state;

    try {
      this.setState({ loading: true });
    } catch (e) {
      console.log(e);
    }
    console.log("Last Before");
    //return;
    const result = await getImageCount();
    console.log(result[0].imageCount);
    const totalImages = result[0].imageCount - 1;
    console.log("Last After");
    const currentImage = totalImages - cachedImageCount + 1;
    let images = [];
    console.log("getImages");
    //return;
    images = await getImages(currentImage, cachedImageCount);
    //return;
    let currentCached = images.length - 1;
    this.setState({
      totalImages,
      currentImage: totalImages - 1,
      currentCached,
      images,
      loading: false,
      initialLoad: false,
    });
  };

  handleAircraftSelect = (aircraft_id) => {
    this.props.onAircraftSelect(aircraft_id);
  };

  handleAlphaChange = async (char) => {
    const { cachedImageCount } = this.state;
    const result = await getImageByAlpha(char);
    const rowindex = result[0].rowindex - 1;
    let images = [];

    this.setState({ loading: true });
    images = await getImages(rowindex, cachedImageCount);
    this.setState({
      currentImage: rowindex - 1,
      currentCached: 0,
      images: images,
      loading: false,
      initialLoad: false,
    });
  };

  render() {
    const { images, maxImageHeight, currentCached, loading } = this.state;

    if (images.length === 0) return null;

    const dimensions = Dimensions.get("window");
    //const imageHeight = Math.round((dimensions.width * 3) / 4);
    const imageWidth = dimensions.width - 40;
    let height = 0;
    let calcHeight =
      (images[currentCached].image_height / images[currentCached].image_width) *
      imageWidth;

    if (calcHeight > maxImageHeight) height = maxImageHeight;
    else height = calcHeight;

    return (
      <>
        <ActivityIndicator visible={loading} />
        <View style={styles.container}>
          <View style={styles.ImageContainer}>
            <Image
              style={{
                width: imageWidth,
                height: height,
                marginTop: 20,
                marginBottom: 10,
                borderRadius: 15,
                borderColor: colors.black,
                borderWidth: 1,
                //aspectRatio: imageWidth / height,
              }}
              source={{
                uri:
                  "data:image/" +
                  images[currentCached].aircraft_image_format +
                  ";base64," +
                  images[currentCached].aircraft_image,
              }}
            />
            <View style={{ height: 40 }}>
              <Link
                title={images[currentCached].aircraft_name}
                icon="plane"
                onPress={() =>
                  this.handleAircraftSelect(images[currentCached].aircraft_id)
                }
                fontSize={30}
              ></Link>
              <Text style={styles.aircraftType}>
                ({images[currentCached].aircraftType} -{" "}
                {images[currentCached].year_of_manufacture})
              </Text>
            </View>
          </View>
          <View style={styles.links}>
            <ImageViewerButton
              title="FIRST"
              icon="step-backward"
              onPress={() => this.handleFirstImage()}
              iconAfter={false}
            ></ImageViewerButton>
            <View style={styles.spacer}></View>
            <ImageViewerButton
              title="PREV"
              icon="backward"
              onPress={() => this.handlePrevImage()}
            ></ImageViewerButton>
            <View style={styles.spacer}></View>
            <ImageViewerButton
              title="NEXT"
              icon="forward"
              onPress={() => this.handleNextImage()}
              iconAfter={true}
            ></ImageViewerButton>
            <View style={styles.spacer}></View>
            <ImageViewerButton
              title="LAST"
              icon="step-forward"
              onPress={() => this.handleLastImage()}
              iconAfter={true}
            ></ImageViewerButton>
          </View>
          <AlphabetPicker onAlphaChange={this.handleAlphaChange} />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  links: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    //backgroundColor: "red",
    width: "100%",
    marginBottom: 2,
  },
  disabledlink: {
    color: colors.medium,
    marginTop: 10,
    fontSize: 10,
  },
  ImageContainer: {
    flex: 1,
    height: isTablet ? 700 : 370,
    alignItems: "center",
  },
  spacer: {
    width: 3,
  },
});
