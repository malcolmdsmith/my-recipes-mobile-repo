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
import { getCurrentUser, updatePassword } from "../api/userApi";

const validationSchema = Yup.object().shape({
  password: Yup.string().min(6).required("Password is required"),
  passwordConfirmation: Yup.string()
    .min(6)
    .oneOf([Yup.ref("password"), null], "Passwords must match!"),
});

export default ChangePassword = ({ onClose }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    const user = await getCurrentUser();
    setUser(user);
  };

  const handleSubmit = async (data) => {
    try {
      await updatePassword(user.id, data.password);
      onClose();
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.rego}>
        <FontAwesome5 name="lock" size={14} />
        {"  "}Change Password
      </Text>

      <Form
        initialValues={{
          password: "",
          passwordConfirmation: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        showClearButton={false}
      >
        <FormField
          name="password"
          autoCorrect={false}
          icon="pencil"
          placeholder="Password"
          secureTextEntry={true}
        />
        <FormField
          name="passwordConfirmation"
          autoCorrect={false}
          icon="pencil"
          placeholder="Password confirmation"
          secureTextEntry={true}
        />
        <SubmitButton title="DONE" icon="smile" color="heading" />
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
    width: 400,
    borderRadius: 25,
    backgroundColor: colors.greenMedium,
    padding: 20,
  },
  error: {
    color: "red",
    alignSelf: "center",
  },
  rego: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
