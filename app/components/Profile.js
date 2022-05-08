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
import { getCurrentUser, update } from "../api/userApi";

const validationSchema = Yup.object().shape({
  id: Yup.number().optional(),
  firstName: Yup.string().required().max(255).label("First Name"),
  lastName: Yup.string().required().max(255).label("Last Name"),
  username: Yup.string().required().max(255).label("Email"),
  role: Yup.string().required().max(255).label("Role"),
});

export default Profile = ({ user, onClose, onChangePassword }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    const roles = ["user", "admin"];
    setRoles(roles);
  };

  const handleSubmit = async (data) => {
    await update(data);
    onClose();
  };

  const handleChangePassword = () => {
    onChangePassword();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profile}>
        <FontAwesome5 name="user-alt" size={14} />
        {"  "}Profile
      </Text>
      <Form
        initialValues={{
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role,
        }}
        onSubmit={handleSubmit}
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
        {user.role === "admin" && (
          <FormPicker
            items={roles}
            name="role"
            icon="clipboard-list-outline"
            numberOfColumns={1}
            placeholder="Role"
            submitOnSelect={false}
          />
        )}
        <FormField
          name="username"
          autoCorrect={false}
          icon="pencil"
          placeholder="Email"
        />
        <SubmitButton title="DONE" icon="smile" color="heading" />
        <Button
          title="CANCEL"
          icon="window-close"
          onPress={onClose}
          color="heading"
        ></Button>
        <Button
          title="CHANGE PASSWORD"
          icon="pencil-alt"
          onPress={handleChangePassword}
          color="heading"
          fontSize={12}
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
  profile: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
