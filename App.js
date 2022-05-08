//import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { isTablet } from "react-native-device-detection";
import AuthContext from "./app/auth/context";

import RecipeContainerNavigator from "./app/navigation/RecipeContainerNavigator";
import TabletContainerNavigator from "./app/tablet/TabletContainerNavigator";
import colors from "./app/config/colors";
import Amplify from "aws-amplify";
import { setClientToken } from "./app/api/apiKit";
import authStorage from "./app/auth/storage";

Amplify.configure({
  Auth: {
    identityPoolId: "ap-southeast-2:d09840fc-8d21-41ef-a6d9-f76803f52fb7", //REQUIRED - Amazon Cognito Identity Pool ID
    region: "ap-southeast-2", // REQUIRED - Amazon Cognito Region
    // userPoolId: "ap-southeast-2:d09840fc-8d21-41ef-a6d9-f76803f52fb7", //OPTIONAL - Amazon Cognito User Pool ID
    //userPoolWebClientId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito Web Client ID
  },
  Storage: {
    AWSS3: {
      bucket: "mds-myrecipes-images", //REQUIRED -  Amazon S3 bucket name
      region: "ap-southeast-2", //OPTIONAL -  Amazon service region
    },
  },
});

export default App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    (async () => await initApp())();
  }, []);

  const initApp = async () => {
    LogBox.ignoreLogs(
      ["ReactNative.NativeModules.LottieAnimationView"],
      ["Warning: Problem checking watchman version"],
      [
        "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
      ]
    );
    //console.log("Loggin in....");
    await restoreUser();
  };

  const restoreUser = async () => {
    try {
      const user = await authStorage.getUser();
      if (user) {
        setUser({ user });
        setClientToken(await authStorage.getToken());
      }
    } catch (e) {}
  };
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        {isTablet ? <TabletContainerNavigator /> : <RecipeContainerNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
