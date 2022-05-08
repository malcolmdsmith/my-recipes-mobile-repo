import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default DropShadow = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    // cross-platform css
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
