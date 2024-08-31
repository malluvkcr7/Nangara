import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  View,
  Modal,
  SafeAreaView,
  Keyboard,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons,Ionicons } from "@expo/vector-icons";
import { SIZES } from "../constants";
import { useUserContext } from "../contexts/UserContext";
import useSlideOnKeyboard from "../utils/useSlideOnKeyboard";
import useHeaderScrollAnim from "../utils/useHeaderScrollAnim";
import useFadeInOutAnim from "../utils/useFadeInOutAnim";
import DefaultPosts from "../components/search/DefaultPosts";
import useFindUsers from "../hooks/useFindUsers";
import Searching from "../components/search/Searching";

const Search = ({ navigation }) => {
  const { currentUser } = useUserContext();
  const { headerTranslate, headerOpacity, scrollY } = useHeaderScrollAnim(43);
  const [searchKey, setSearchKey] = useState("");
  const { beginSearch, users, searchResult } = useFindUsers({
    currentUser,
    searchKey,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [focusedBar, setFocusedBar] = useState(false);
  const [inputWidth, setInputWidth] = useState(SIZES.Width / 0.9);
  const [searching, setSearching] = useState(false);
  const { fadeEffect } = useFadeInOutAnim({ focusedBar });

  const { slideAnimation, forceSlideAnimation } = useSlideOnKeyboard(
    SIZES.Width * 0.75,
    SIZES.Width * 0.92
  );

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleFocus = () => {
    beginSearch();
    forceSlideAnimation(true);
    clearTimeout();
    setFocusedBar(true);
    setSearching(true);
    setInputWidth(SIZES.Width * 0.7);
  };

  const handleCancel = () => {
    forceSlideAnimation(false);
    setFocusedBar(false);
    setSearching(false);
    Keyboard.dismiss();
    setInputWidth(SIZES.Width * 0.8);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header(70),
          {
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <View style={styles.searchBar}>
          <Animated.View
            style={[
              styles.searchWrapper,
              { width: slideAnimation },
              { opacity: headerOpacity },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={"#999"}
              style={styles.searchIcon}
            />

            <TextInput
              value={searchKey}
              onChangeText={setSearchKey}
              maxLength={30}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={"#999"}
              style={[styles.searchInput, { width: inputWidth }]}
              enterKeyHint="search"
              onFocus={() => handleFocus()}
            />
          </Animated.View>
          {/* Dropdown Button */}
  <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
    <MaterialIcons name="arrow-drop-down" size={23} color={"#fff"} />
  </TouchableOpacity>

  {/* Dropdown Modal */}
  {dropdownVisible && (
    <Modal
      transparent={true}
      animationType="fade"
      visible={dropdownVisible}
      onRequestClose={toggleDropdown}
    >
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={toggleDropdown}
      >
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={toggleDropdown}>
            <Text style={styles.dropdownOption}>Brands</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDropdown}>
            <Text style={styles.dropdownOption}>Friends</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )}
          
          {focusedBar && (
            <TouchableOpacity onPress={() => handleCancel()}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
          )}
          
        </View>
      </Animated.View>
      <View style={styles.result}>
        <DefaultPosts navigation={navigation} handleScroll={handleScroll} />

        {searching && (
          <Animated.View
            style={[
              styles.searchingContainer,
              {
                opacity: fadeEffect,
              },
            ]}
          >
            <Searching
              navigation={navigation}
              searchResult={searchKey.length > 0 ? searchResult : users}
              currentUser={currentUser}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: (ContainerHeight) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 35,
    height: ContainerHeight,
    zIndex: 1,
    backgroundColor: "#000",
  }),
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 23,
  },
  dropdown:{
    marginLeft:-30,
  },
  searchWrapper: {
    marginLeft: SIZES.Width * 0.03,
    backgroundColor: "#252525",
    height: 38,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    color: "#fff",
    height: "100%",
    marginLeft: 5,
  },
  cancelBtn: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 15,
  },
  result: {
    flex: 1,
  },
  searchingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  modalBackground: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight:30,
    marginTop:70,
    // marginTop:30,
    // marginRight:30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownContainer: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop:0,
    marginRight:0,
  },
  dropdownOption: {
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
});
