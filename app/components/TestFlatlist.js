import React from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from "react-native";
import Link from "../components/Link";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    ingredientName: "First Item",
    measure: "each",
    qty: "1",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    ingredientName: "Second Item",
    measure: "each",
    qty: "1",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    ingredientName: "Third Item",
    measure: "each",
    qty: "1",
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const handleDelete = () => {};
const handleEdit = () => {};

const TestFlatlist = () => {
  //const renderItem = ({ item }) => <Item title={item.title} />;
  const renderItem = ({ item }) => {
    console.log(item.ingredientName);
    return (
      <>
        <View style={styles.row}>
          <View style={styles.ingredient}>
            <Text style={{ color: "black" }}>{item.ingredientName}</Text>
          </View>
          <View style={styles.measure}>
            <Text>{item.measure}</Text>
          </View>
          <View style={styles.qty}>
            <Text>{item.qty}</Text>
          </View>
          <View style={styles.addminus}>
            {/* <Button title="+" onPress={handleIncreaseQty} />
              <Button title="-" onPress={handleDecreaseQty} /> */}
            <Link
              title=""
              icon="trash-alt"
              iconSize={10}
              onPress={handleDelete}
            />
            <Link
              title=""
              icon="pencil-alt"
              iconSize={10}
              onPress={handleEdit}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={4}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default TestFlatlist;
