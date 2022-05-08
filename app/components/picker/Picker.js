import React, { Component, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import colors from "../../config/colors";

function Picker({
  title,
  items,
  width = 100,
  listWidth = 100,
  //height = 100,
  selectedItem,
  onSelectItem,
}) {
  const [showList, setShowList] = useState(false);

  const handleSelectItem = (item) => {
    setShowList(false);
    onSelectItem(item);
  };

  const getListHeight = () => {
    let h = 0;
    if (Platform.OS === "ios") h = items.length * 40;
    else h = items.length * 50;

    return h;
  };
  return (
    <View style={styles.container} width={width}>
      <Text>{title}</Text>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => setShowList(!showList)}
      >
        <Text style={styles.text}>{selectedItem}</Text>
        <View style={styles.icon}>
          {showList ? (
            <FontAwesome5 name="chevron-up" size={16} />
          ) : (
            <FontAwesome5 name="chevron-down" size={16} />
          )}
        </View>
      </TouchableOpacity>
      {showList && (
        <View
          style={[
            styles.listContainer,
            { height: getListHeight(), width: listWidth },
          ]}
        >
          {items.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => handleSelectItem(item)}>
              <Text style={styles.listItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  icon: {
    marginRight: 16,
    marginTop: Platform.OS === "ios" ? 16 : 17,
  },
  listContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 81,
    marginLeft: 10,
    backgroundColor: colors.light,
    zIndex: 1000,
    elevation: 1000,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItem: {
    textAlign: "left",
    paddingTop: 10,
    paddingLeft: 20,
  },
  text: {
    backgroundColor: colors.white,
    height: Platform.OS === "ios" ? 44 : 54,
    textAlign: "left",
    padding: 12,
    marginLeft: 5,
  },
  touchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 25,
    borderColor: colors.border,
    borderWidth: 1,
    paddingLeft: 20,
    height: Platform.OS === "ios" ? 46 : 56,
  },
});

export default Picker;
