import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";

import Text from "../components/Text";
import Pagination from "./Pagination";

class SearchResults extends Component {
  state = {};

  render() {
    const {
      results,
      itemsCount,
      valueProperty,
      textProperty,
      icon,
      pageSize,
      currentPage,
    } = this.props;
    const pagesCount = Math.ceil(itemsCount / pageSize);

    let showingMsg = null;
    if (pagesCount >= 1)
      showingMsg = (
        <Text style={styles.showingmsg}>
          Showing page {currentPage} of {pagesCount} ({itemsCount} items found).
        </Text>
      );
    else showingMsg = <Text>No items found.</Text>;

    return (
      <View>
        {showingMsg}
        {results.map((item, i) => (
          // <ListItem key={i} bottomDivider>
          //     <Icon name={icon} type="font-awesome" />
          //     <ListItem.Content>
          //     <ListItem.Title style={{color: colors.tertiary}} onPress={() => this.props.OnItemSelect(item)}>{item[textProperty]}</ListItem.Title>
          //     </ListItem.Content>
          //     <ListItem.Chevron />
          // </ListItem>
          <Text>{item[textProperty]}</Text>
        ))}
        {pagesCount > 1 && (
          <Pagination
            itemsCount={itemsCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.props.onPageChange}
          />
        )}
      </View>
    );
  }
}

export default SearchResults;

const styles = StyleSheet.create({
  showingmsg: {
    color: "gray",
    fontSize: 12,
    marginBottom: 10,
  },
});
