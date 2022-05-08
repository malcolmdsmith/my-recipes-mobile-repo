import React from "react";
import { Formik } from "formik";
import Button from "../Button";

function AppForm({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  resetValues,
  onHandleReset,
  showClearButton,
  clearButtonTitle,
  clearButtonIcon,
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize={true}
    >
      {(props) => (
        <>
          {showClearButton && (
            <Button
              title={clearButtonTitle}
              icon={clearButtonIcon}
              onPress={() => {
                props.resetForm({ values: resetValues });
                onHandleReset();
              }}
              color="heading"
            ></Button>
          )}
          {children}
        </>
      )}
    </Formik>
  );
}

export default AppForm;
