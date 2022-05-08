import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
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
import { authenticateUser } from "../api/authService";
import useAuth from "../auth/useAuth";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().max(255).label("Email"),
  password: Yup.string().required("Password is required"),
});

export default SignIn = ({ onClose }) => {
  const auth = useAuth();
  const [showFailure, setShowFailure] = useState(false);
  useEffect(() => {}, []);

  const handleSubmit = async (data) => {
    try {
      const result = await authenticateUser(data.username, data.password);
      if (result) {
        auth.logIn(result.token);
        onClose();
      } else setShowFailure(true);
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signin}>
        <FontAwesome5 name="door-open" size={14} />
        {"  "}Sign In
      </Text>
      <Form
        initialValues={{
          username: "malcolms65@gmail.com",
          password: "123456",
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
          onPress={onClose}
          color="heading"
        ></Button>
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});
