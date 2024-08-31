import { StyleSheet, View, TextInput, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ onPropChange, resetSearchBar }) => {
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    onPropChange(searchKey.toLowerCase());
  }, [searchKey]);

  useEffect(() => {
    setSearchKey("");
  }, [resetSearchBar]);

  return (
    <View style={styles.searchBar}>
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={20}
          color={"#aaa"}
          style={styles.searchIcon}
        />

        <TextInput
          value={searchKey}
          onChangeText={setSearchKey}
          maxLength={40}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search"
          placeholderTextColor={"#999"}
          style={styles.searchInput}
          enterKeyHint="search"
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 13,
    marginTop: 10,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: "#333",
    height: Platform.OS === "android" ? 44 : 38,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === "android" ? 8 : 0,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    color: "#fff",
    height: "100%",
    marginLeft: 5,
    marginBottom: Platform.OS === "android" ? 5 : 1,
    fontSize: 17,
    flex: 1,
  },
});
