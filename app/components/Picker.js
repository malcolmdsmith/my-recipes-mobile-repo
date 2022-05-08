import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { isTablet } from "react-native-device-detection";

import Text from "./Text";
import defaultStyles from "../config/styles";
import PickerItem from "./PickerItem";
import Screen from "./Screen";
import Button from "./Button";
import colors from "../config/colors";

function AppPicker({
  icon,
  items,
  numberOfColumns = 1,
  onSelectItem,
  PickerItemComponent = PickerItem,
  placeholder,
  selectedItem,
  onClearItem,
  width = "100%",
  onAddEntry,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width }]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}
          {selectedItem ? (
            <Text style={styles.text}>{selectedItem}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}

          <MaterialCommunityIcons
            name="close-octagon-outline"
            size={20}
            color={defaultStyles.colors.medium}
            onPress={onClearItem}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/paper-seamless-background-1380.jpg")}
        >
          <View style={styles.modalContainer}>
            {onAddEntry && (
              <Button
                title="Add"
                color="heading"
                icon="plus"
                onPress={() => {
                  setModalVisible(false);
                  onAddEntry();
                }}
              />
            )}
            <Button
              title="Close"
              color="heading"
              onPress={() => setModalVisible(false)}
              icon="window-close"
            />
            <FlatList
              style={styles.list}
              data={items}
              keyExtractor={(item, index) => index.toString()}
              numColumns={numberOfColumns}
              renderItem={({ item }) => (
                <PickerItemComponent
                  item={item}
                  onPress={() => {
                    setModalVisible(false);
                    onSelectItem(item);
                  }}
                />
              )}
            />
          </View>
        </ImageBackground>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: "row",
    //flex: 1,
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    height: 60,
  },
  icon: {
    marginRight: 10,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  list: {},
  modalContainer: {
    width: isTablet ? "50%" : "100%",
    // justifyContent: "center",
    padding: 20,
  },
  text: {
    flex: 1,
  },
});

export default AppPicker;
