import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Image,
  ImageBackground,
} from "react-native";

import BoxButton from "./BoxButton";
import Registration from "./Registration";
import { logOut } from "../api/logOut";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import routes from "../navigation/routes";
import colors from "../config/colors";

export default SignInRegisterToolbar = ({
  navigation,
  user,
  onUpdate,
  onOpenSignIn,
}) => {
  useEffect(() => {}, [user]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleSignUp = () => {
    setShowRegistration(true);
  };

  const handleSignIn = () => {
    if (onOpenSignIn) onOpenSignIn(true);
    else navigation.navigate(routes.LOGIN);
  };

  const handleProfile = () => {
    setShowProfile(true);
  };

  const handleProfileClose = async () => {
    setShowProfile(false);
    logOut();
    setShowSignIn(true);
  };

  const handleSignOut = async () => {
    logOut();
    onUpdate();
  };

  const handleChangePassword = () => {
    setShowProfile(false);
    setShowChangePassword(true);
  };

  const handlePasswordClose = () => {
    setShowChangePassword(false);
  };

  return (
    <>
      <View style={styles.container}>
        {user.AllowEdits && (
          <View style={styles.signInsignUp}>
            <BoxButton
              title={user.firstName}
              icon="user-alt"
              iconSize={14}
              onPress={handleProfile}
              color="greenMedium"
              fontSize={14}
            />
            <BoxButton
              title="Sign Out"
              icon="window-close"
              iconSize={14}
              onPress={handleSignOut}
              color="greenMedium"
              fontSize={14}
            />
          </View>
        )}
        {!user.AllowEdits && (
          <View style={styles.signInsignUp}>
            <BoxButton
              title="Sign In"
              icon="door-open"
              onPress={handleSignIn}
              color="greenMedium"
              fontSize={14}
            />
            <BoxButton
              title="Sign Up"
              icon="pencil-alt"
              iconSize={14}
              onPress={handleSignUp}
              color="greenMedium"
              fontSize={14}
            />
          </View>
        )}
        {user.role === "admin" && (
          <BoxButton
            title="Register User"
            icon="pencil-alt"
            iconSize={14}
            onPress={handleSignUp}
            color="greenMedium"
            fontSize={14}
          />
        )}
      </View>
      <Modal visible={showRegistration}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/cookbook-design.jpeg")}
        >
          <View style={styles.ModalContainer}>
            <Registration onClose={() => setShowRegistration(false)} />
          </View>
        </ImageBackground>
      </Modal>
      <Modal visible={showProfile}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/cookbook-design.jpeg")}
        >
          <View style={styles.ModalContainer}>
            <Profile
              user={user}
              onClose={handleProfileClose}
              onChangePassword={handleChangePassword}
            />
          </View>
        </ImageBackground>
      </Modal>
      <Modal visible={showChangePassword}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/cookbook-design.jpeg")}
        >
          <View style={styles.ModalContainer}>
            <ChangePassword onClose={handlePasswordClose} />
          </View>
        </ImageBackground>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    paddingLeft: 20,
    backgroundColor: colors.greenMedium,
  },
  imageBackground: {
    flex: 1,
    opacity: 1,
  },
  signInsignUp: {
    flexDirection: "row",
  },
  ModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 350,
  },
});
