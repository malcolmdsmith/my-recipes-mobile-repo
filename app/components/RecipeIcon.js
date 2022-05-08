import React from "react";
import { StyleSheet, Image } from "react-native";

export default RecipeIcon = () => {
  return (
    <Image style={styles.image} source={require("../assets/heart-small.png")} />
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    marginTop: 6,
    width: 55,
    height: 55,
  },
});
