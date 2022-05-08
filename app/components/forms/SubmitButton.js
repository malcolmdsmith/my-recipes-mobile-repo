import React from "react";
import { useFormikContext } from "formik";

import Button from "../Button";

function SubmitButton({ title, icon, color, notifySubmit, navTo }) {
  const { handleSubmit } = useFormikContext();
  return (
    <Button
      title={title}
      icon={icon}
      color={color}
      onPress={() => {
        handleSubmit();
        if (notifySubmit) notifySubmit(navTo);
      }}
    />
  );
}

export default SubmitButton;
