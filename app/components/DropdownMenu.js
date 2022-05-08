import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
//import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { isTablet } from "react-native-device-detection";

import colors from "../config/colors";
import Registration from "./Registration";
import useAuth from "../auth/useAuth";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import SignIn from "./SignIn";
import DropShadow from "./DropShadow";

export default DropdownMenu = ({
  user,
  showMenu,
  onShowMenuDone,
  onUpdate,
}) => {
  //const [showMenu, setShowMenu] = useState(false);
  const auth = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    //
    //setShowMenu(false);
    //onHideMenuDone();
  }, []);

  const handleShowMenu = () => {
    //
    if (showMenu) onShowMenuDone(false);
    else onShowMenuDone(true);
  };

  const handleSignUp = () => {
    onShowMenuDone(false);
    setShowRegistration(true);
  };

  const handleSignIn = () => {
    setShowSignIn(true);
    return;
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
    auth.logOut();
    onUpdate();
  };

  const handleChangePassword = () => {
    setShowProfile(false);
    setShowChangePassword(true);
  };

  const handlePasswordClose = () => {
    setShowChangePassword(false);
  };

  const handleCloseSignIn = () => {
    onShowMenuDone(false);
    setShowSignIn(false);
    onUpdate();
  };

  return (
    <>
      <TouchableOpacity onPress={handleShowMenu}>
        <Text style={styles.menuTag}>
          <MaterialCommunityIcons name="menu" size={isTablet ? 16 : 12} /> MENU
        </Text>
      </TouchableOpacity>
      {showMenu && (
        <DropShadow>
          <View style={styles.menuList}>
            {user.loggedIn && (
              <TouchableOpacity onPress={handleProfile}>
                <Text style={styles.menuText}>
                  <FontAwesome5 name="user-alt" /> Profile
                </Text>
              </TouchableOpacity>
            )}
            {!user.loggedIn && (
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.menuText}>
                  <FontAwesome5 name="door-open" /> Sign In
                </Text>
              </TouchableOpacity>
            )}
            {!user.loggedIn && (
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.menuText}>
                  <FontAwesome5 name="pencil-alt" /> Sign Up
                </Text>
              </TouchableOpacity>
            )}
            {user.role === "admin" && (
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.menuText}>
                  <FontAwesome5 name="pencil-alt" /> Register User
                </Text>
              </TouchableOpacity>
            )}
            {user.loggedIn && (
              <TouchableOpacity onPress={handleSignOut}>
                <Text style={styles.menuText}>
                  <FontAwesome5 name="window-close" /> Sign Out
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </DropShadow>
      )}
      <Modal visible={showRegistration}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/cookbook-design.jpeg")}
        >
          <View style={styles.modalContainer}>
            <Registration onClose={() => setShowRegistration(false)} />
          </View>
        </ImageBackground>
      </Modal>
      <Modal visible={showProfile}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/cookbook-design.jpeg")}
        >
          <View style={styles.modalContainer}>
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
          <View style={styles.modalContainer}>
            <ChangePassword onClose={handlePasswordClose} />
          </View>
        </ImageBackground>
      </Modal>
      <Modal visible={showSignIn}>
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
    </>
  );
};

const styles = StyleSheet.create({
  menuList: {
    backgroundColor: colors.greenDark,
    elevation: 1000,
    zIndex: 1000,
    marginTop: 8,
    width: "40%",
    marginLeft: 5,
  },
  menuText: {
    color: colors.white,
    padding: 20,
    backgroundColor: colors.greenDark,
    elevation: 1000,
    zIndex: 1000,
  },
  menuTag: {
    color: colors.white,
    paddingLeft: 20,
    paddingTop: 3,
    fontSize: isTablet ? 18 : 12,
  },
  header: {
    backgroundColor: colors.greenMedium,
    height: 100,
    paddingTop: 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    elevation: 1000,
    zIndex: 1000,
  },
  modalContainer: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: isTablet ? "50%" : "90%",
  },
  imageBackground: {
    flex: 1,
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
