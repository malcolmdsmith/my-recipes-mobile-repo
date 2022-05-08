import React from "react";
import { useFormikContext } from "formik";

import Picker from "../Picker";
import ErrorMessage from "./ErrorMessage";

function AppFormPicker({
  items,
  name,
  icon,
  numberOfColumns,
  PickerItemComponent,
  placeholder,
  width,
  textProperty,
  valueProperty,
  submitOnSelect = false,
  onAddEntry,
}) {
  const { errors, setFieldValue, touched, values, handleSubmit } =
    useFormikContext();
  //console.log("...", errors, values[name]);
  return (
    <>
      <Picker
        items={items}
        icon={icon}
        numberOfColumns={numberOfColumns}
        onSelectItem={(item) => {
          setFieldValue(name, item);
          if (submitOnSelect) handleSubmit();
        }}
        onClearItem={() => {
          setFieldValue(name, null);
          handleSubmit();
        }}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values[name]}
        width={width}
        textProperty={textProperty}
        valueProperty={valueProperty}
        onAddEntry={onAddEntry}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
