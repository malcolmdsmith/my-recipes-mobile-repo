import React, { Component, useState } from "react";
import { View, StyleSheet, Modal, ImageBackground } from "react-native";
import { gotoHomeTablet } from "../tablet/RootNavigation";

export default SignInScreen = () => {
  const [visible, setVisible] = useState(true);

  handleCloseSignIn = () => {
    setVisible(false);
    gotoHomeTablet();
  };

  return (
    <Modal visible={visible}>
      <ImageBackground
        style={styles.imageBackground}
        source={require("../assets/cookbook-design.jpeg")}
      >
        <View style={styles.modalContainer}>
          <View></View>
          <SignIn onClose={handleCloseSignIn} />
        </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
  modalContainer: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  imageBackground: {
    flex: 1,
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
