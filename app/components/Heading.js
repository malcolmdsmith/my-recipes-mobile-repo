import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

function Heading({
  title,
  fontSize,
  children,
  color = "black",
  bold = "bold",
  icon,
  textAlign,
  marginTop = 10,
  marginBottom = 10,
}) {
  return (
    <View
      style={[
        styles.container,
        { marginTop: marginTop, marginBottom: marginBottom },
      ]}
    >
      {icon != "" ? <FontAwesome5 name={icon} size={20} /> : null}
      <Text
        style={[
          styles.text,
          { fontSize: fontSize },
          { color: color },
          { fontWeight: bold },
          { textAlign: textAlign },
        ]}
      >
        {children} {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginTop: 0,
    marginBottom: 0,
  },
});

export default Heading;
