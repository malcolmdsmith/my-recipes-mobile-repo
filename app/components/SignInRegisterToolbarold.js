import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Image,
  ImageBackground,
} from "react-native";

import Link from "./Link";
import colors from "../config/colors";
import Registration from "./Registration";
import { logOut } from "../api/logOut";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";

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

  const handleProfileClose = () => {
    setShowProfile(false);
    onUpdate();
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
            <Link
              title={user.firstName}
              icon="user-alt"
              iconSize={14}
              onPress={handleProfile}
              color={colors.white}
              fontSize={16}
            />
            <Text style={{ color: colors.white }}> | </Text>
            <Link
              title="Sign Out"
              icon="window-close"
              iconSize={14}
              onPress={handleSignOut}
              color={colors.white}
              fontSize={16}
            />
          </View>
        )}
        {!user.AllowEdits && (
          <View style={styles.signInsignUp}>
            <Link
              title="Sign In"
              icon="door-open"
              onPress={handleSignIn}
              color={colors.white}
              fontSize={16}
            />
            <Text style={{ color: colors.white }}> | </Text>
            <Link
              title="Sign Up"
              icon="pencil-alt"
              iconSize={14}
              onPress={handleSignUp}
              color={colors.white}
              fontSize={16}
            />
          </View>
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
    marginLeft: 20,
  },
  imageBackground: {
    flex: 1,
    opacity: 0.75,
  },
  signInsignUp: {
    flexDirection: "row",
  },
  ModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
