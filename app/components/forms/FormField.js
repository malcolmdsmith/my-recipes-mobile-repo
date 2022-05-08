import React, { forwardRef, useEffect } from "react";
import { useFormikContext } from "formik";
import { Text } from "react-native";
import TextInput from "../TextInput";
import ErrorMessage from "./ErrorMessage";

const AppFormField = React.forwardRef(
  (
    {
      name,
      width,
      showClearButton = false,
      showLabelAbove = false,
      textInputWidth = 0,

      ...otherProps
    },
    ref
  ) => {
    const { setFieldTouched, setFieldValue, errors, touched, values } =
      useFormikContext();

    return (
      <>
        {showLabelAbove && <Text>{otherProps.placeholder}</Text>}
        <TextInput
          onBlur={() => setFieldTouched(name)}
          onChangeText={(text) => {
            setFieldValue(name, text);
          }}
          value={values[name]}
          width={width}
          {...otherProps}
          showLabelAbove={showLabelAbove}
          showClearButton={showClearButton}
          textInputWidth={textInputWidth}
          onFieldClear={() => setFieldValue(name, "")}
          ref={ref}
        />
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      </>
    );
  }
);

export default AppFormField;
