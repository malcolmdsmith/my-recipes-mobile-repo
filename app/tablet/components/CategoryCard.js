import React, { Component, useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { isTablet } from "react-native-device-detection";

import Heading from "../../components/Heading";
import Link from "../../components/Link";
import { getImageWidth, getImageHeight } from "../../utility/dimensions";

export default CategoryCard = ({ category, onDeleteCategory }) => {
  return (
    <View style={styles.container}>
      <Heading title={category.category_name} fontSize={20} />
      <Image
        style={{
          width:
            getImageWidth(
              isTablet ? 0.5 : 1,
              0,
              category.image_width,
              category.image_height
            ) / 2,
          height:
            getImageHeight(
              isTablet ? 0.5 : 1,
              0,
              category.image_width,
              category.image_height,
              500
            ) / 2,
          margin: 2,
          borderRadius: 20,
        }}
        source={{
          uri: category.imageUrl,
        }}
      />
      <View style={{ alignItems: "flex-end" }}>
        <Link
          title="Delete"
          icon="trash"
          iconSize={14}
          fontSize={14}
          onPress={() => onDeleteCategory(category)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
