import React, { forwardRef } from "react";
import { useFormikContext } from "formik";
import { View, StyleSheet } from "react-native";

import TextInput from "./TextInput";
import ErrorMessage from "./forms/ErrorMessage";
import Button from "./Button";

const QuantityIncrementor = React.forwardRef(
  ({ name, width, ...otherProps }, ref) => {
    const { setFieldTouched, setFieldValue, errors, touched, values } =
      useFormikContext();

    const handleIncrease = () => {
      let num = parseFloat(values[name]);
      console.log("num.", num, values[name]);
      if (num % 1 === 0) {
        num = num + 1;
        setFieldValue(name, num.toString());
      }
    };
    const handleDecrease = () => {
      let num = parseFloat(values[name]);
      console.log("num.", num, values[name]);
      if (num % 1 === 0) {
        if (num > 0) num = num - 1;
        setFieldValue(name, num.toString());
      }
    };

    return (
      <>
        <View style={styles.container}>
          <TextInput
            onBlur={() => setFieldTouched(name)}
            onChangeText={(text) => {
              //console.log(name, text);
              setFieldValue(name, text);
            }}
            value={values[name]}
            width={width}
            {...otherProps}
            ref={ref}
          />
          <View style={styles.button}></View>
          <Button title="+" color="heading" onPress={handleIncrease} />
          <View style={styles.button}></View>
          <Button title="-" color="heading" onPress={handleDecrease} />
        </View>
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      </>
    );
  }
);

export default QuantityIncrementor;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  button: {
    width: 10,
    height: 25,
  },
});
