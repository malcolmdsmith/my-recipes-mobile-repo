import React, { Component, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import PaginationButton from "./PaginationButton";
import colors from "../config/colors";

export default Pagination = (props) => {
  const getPageCount = () => {
    const { pageSize, itemsCount } = props;
    return Math.ceil(itemsCount / pageSize);
  };

  const handleButtonPress = (button) => {
    const { currentPage } = props;
    const pagesCount = getPageCount();
    let page = 0;

    switch (button) {
      case "First":
        page = 0;
        break;
      case "Prev":
        if (currentPage > 0) page = currentPage - 1;
        break;
      case "Next":
        if (currentPage < pagesCount - 1) page = currentPage + 1;
        break;
      case "Last":
        page = pagesCount - 1;
        break;
      default:
        break;
    }

    props.onPageChange(page);
  };

  return (
    <View style={styles.container}>
      <PaginationButton
        onPress={() => handleButtonPress("First")}
        color="greenMedium"
        icon="step-backward"
        width={70}
      />
      <PaginationButton
        onPress={() => handleButtonPress("Prev")}
        color="greenMedium"
        icon="backward"
        width={70}
      />
      <PaginationButton
        onPress={() => handleButtonPress("Next")}
        color="greenMedium"
        icon="forward"
        width={70}
      />
      <PaginationButton
        onPress={() => handleButtonPress("Last")}
        color="greenMedium"
        icon="step-forward"
        width={70}
      />

      <Text style={styles.text}>
        (Page {props.currentPage + 1} of {getPageCount()})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 20,
  },
  text: {
    color: colors.white,
  },
});
