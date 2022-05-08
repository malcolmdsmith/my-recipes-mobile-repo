import React from "react";
import { useFormik, useFormikContext } from "formik";

import Button from "../Button";

function ResetButton({ title }) {
  const { handleReset } = useFormikContext();

  return <Button title={title} onPress={handleReset} />;
}

export default ResetButton;
