import React from "react";
import Constants from "expo-constants";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  ImageBackground,
} from "react-native";
import { isTablet } from "react-native-device-detection";
import colors from "../config/colors";
import { Fragment } from "react";

function Screen({ children, style }) {
  return (
    <Fragment>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: colors.white }}
      ></SafeAreaView>
      <ImageBackground
        style={styles.imageBackground}
        source={require("../assets/paper-seamless-background-1380.jpg")}
      >
        <SafeAreaView style={[styles.screen, style]}>
          <View style={[styles.view, style]}>{children}</View>
        </SafeAreaView>
      </ImageBackground>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  view: {
    flex: 1,
    paddingLeft: isTablet || Platform.OS === "ios" ? 20 : 0,
    paddingRight: isTablet || Platform.OS === "ios" ? 20 : 0,
  },
});

export default Screen;
