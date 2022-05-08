import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, Modal } from "react-native";
import * as Yup from "yup";
import { FontAwesome5 } from "@expo/vector-icons";

import {
  ErrorMessage,
  Form,
  FormField,
  FormPicker,
  FormDropDownList,
  SubmitButton,
} from "../components/forms";
import Button from "../components/Button";
import colors from "../config/colors";
import { logIn } from "../api/userApi";
import routes from "../navigation/routes";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().max(255).label("Email"),
  password: Yup.string().required("Password is required"),
});

export default SignInScreen = ({ navigation }) => {
  const [showFailure, setShowFailure] = useState(false);
  useEffect(() => {}, []);

  const handleSubmit = async (data) => {
    //
    if (await logIn(data.username, data.password)) handleClose();
    else setShowFailure(true);
  };

  const handleClose = () => {
    navigation.navigate(routes.HOME_TABLET);
  };

  return (
    <ImageBackground
      style={styles.imageBackground}
      source={require("../assets/cookbook-design.jpeg")}
    >
      <View style={styles.container}>
        <Text style={styles.signin}>
          <FontAwesome5 name="door-open" size={14} />
          {"  "}Sign In
        </Text>
        <Form
          initialValues={{
            username: "malcolms65@gmail.com",
            password: "qwerty",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          showClearButton={false}
        >
          <FormField
            name="username"
            autoCorrect={false}
            icon="pencil"
            placeholder="Email"
          />
          <FormField
            name="password"
            autoCorrect={false}
            icon="pencil"
            placeholder="Password"
            secureTextEntry={true}
          />
          {showFailure && (
            <Text style={styles.failure}>Email or password is incorrect!</Text>
          )}
          <SubmitButton title="SIGN IN" icon="smile" color="heading" />
          <Button
            title="CANCEL"
            icon="window-close"
            onPress={handleClose}
            color="heading"
          ></Button>
        </Form>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    borderRadius: 25,
    backgroundColor: colors.greenMedium,
    padding: 20,
  },
  failure: {
    color: "red",
    alignSelf: "center",
  },
  signin: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageBackground: {
    flex: 1,
    opacity: 0.75,
    justifyContent: "center",
    alignItems: "center",
  },
});
