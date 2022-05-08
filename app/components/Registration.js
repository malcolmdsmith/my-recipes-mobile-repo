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
import { getCurrentUser, register } from "../api/userApi";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().max(255).label("First Name"),
  lastName: Yup.string().required().max(255).label("Last Name"),
  username: Yup.string().required().max(255).label("Email"),
  role: Yup.string().required().max(255).label("Role"),
  password: Yup.string().min(6).required("Password is required"),
  passwordConfirmation: Yup.string()
    .min(6)
    .oneOf([Yup.ref("password"), null], "Passwords must match!"),
});

export default Registration = ({ onClose }) => {
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    const roles = ["user", "admin"];

    setRoles(roles);
    const user = await getCurrentUser();
    setUser(user);
  };

  const handleSubmit = async (data) => {
    await register(data);
    onClose();
  };
  const handleReset = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.rego}>
        <FontAwesome5 name="user-alt" size={14} />
        {"  "}Registration
      </Text>

      <Form
        initialValues={{
          firstName: "",
          lastName: "",
          username: "",
          role: "user",
          password: "",
          passwordConfirmation: "",
        }}
        resetValues={{
          firstName: "",
          lastName: "",
          username: "",
          role: "user",
          password: "",
          passwordConfirmation: "",
        }}
        onSubmit={handleSubmit}
        onHandleReset={handleReset}
        validationSchema={validationSchema}
        showClearButton={false}
      >
        <FormField
          name="firstName"
          autoCorrect={false}
          icon="pencil"
          placeholder="First name"
        />
        <FormField
          name="lastName"
          autoCorrect={false}
          icon="pencil"
          placeholder="Last name"
        />
        <FormPicker
          items={roles}
          name="role"
          icon="clipboard-list-outline"
          numberOfColumns={1}
          placeholder="Role"
          submitOnSelect={false}
        />
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
    //width: 400,
    borderRadius: 25,
    backgroundColor: colors.greenMedium,
    padding: 20,
  },
  rego: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
