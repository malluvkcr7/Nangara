import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import React, { useState,useRef } from "react";
import {  MaterialCommunityIcons,Entypo } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheetOptions from "../bottomSheets/BottomSheetOptions";
import useCheckStoriesSeen from "../../../hooks/useCheckStoriesSeen";
import useHandleFollow from "../../../hooks/useHandleFollow";

const Header = ({ navigation, post, currentUser }) => {
  const { checkStoriesSeen } = useCheckStoriesSeen();
  const { handleFollow } = useHandleFollow();
  const bottomSheetRef = useRef(null);
  const [cartQuantity, setCartQuantity] = useState(0);

  const handOptionsSheet = () => {
    bottomSheetRef.current.present();
  };

  const handleAddToCart = () => {
    setCartQuantity(cartQuantity + 1);
  };
  const handleEmptyCart = () => {
    setCartQuantity(0);
  };

  const handlePostOwner = () => {
    if (currentUser.email === post.owner_email) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("UserDetail", {
        email: post.owner_email,
      });
    }
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => handlePostOwner()}
          style={styles.headerUserContainer}
        >
          {checkStoriesSeen(post.username, currentUser.email) ? (
            <View style={styles.rainbowBorder}>
              <FastImage
                source={{ uri: post.profile_picture }}
                style={styles.headerImage}
              />
            </View>
          ) : (
            <LinearGradient
              start={[0.9, 0.45]}
              end={[0.07, 1.03]}
              colors={["#00FF66", "#7788A8", "#FF00F5"]}
              style={styles.rainbowBorder}
            >
              <FastImage
                source={{ uri: post.profile_picture }}
                style={styles.headerImageWithRainbow}
              />
            </LinearGradient>
          )}
          <Text style={styles.headerText}>{post.username.toLowerCase()}</Text>
          <TouchableOpacity
            onPress={() => handleAddToCart()}
            // style={styles.touchableOpacity}
          >
            <MaterialCommunityIcons
              name="shopping"
              size={20}
              color="#fff"
              style={styles.cart_shop}
            />
            <Text style={styles.headerText2}>{cartQuantity}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEmptyCart()}
            // style={styles.touchableOpacity}
          >
            <MaterialCommunityIcons
              name="scissors-cutting"
              size={20}
              color="#fff"
              style={styles.cart_shop}
            />
            <Text style={styles.headerText3}>Empty</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.rowContainer}>
          {currentUser.email !== post.owner_email &&
          currentUser.following &&
          !currentUser.following.includes(post.owner_email) ? (
            <TouchableOpacity
              onPress={() => {
                handleFollow(post.owner_email);
              }}
              style={styles.buttonContainer}
            >
              {currentUser.following_request &&
              !currentUser.following_request.includes(post.owner_email) ? (
                <Text style={styles.buttonText}>Follow</Text>
              ) : (
                <Text style={styles.buttonText}>Requested</Text>
              )}
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => handOptionsSheet()}>
            <Entypo
              name="dots-three-horizontal"
              size={15}
              color={"#fff"}
              style={styles.headerDots}
            />
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetOptions
        bottomSheetRef={bottomSheetRef}
        currentUser={currentUser}
        post={post}
        navigation={navigation}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 6,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerUserContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    height: 37,
    width: 37,
    resizeMode: "cover",
    borderRadius: 100,
    borderWidth: 0.6,
    borderColor: "#444",
  },
  headerImageWithRainbow: {
    height: 36.5,
    width: 36.5,
    resizeMode: "cover",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000",
  },
  cart_shop:{
    marginLeft:10,
    marginTop: 16
    ,
  },
  rainbowBorder: {
    height: 39,
    width: 39,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 9,
    marginBottom: Platform.OS === "android" ? 4 : 1,
  },
  headerText2: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 10,
    marginLeft: 17.4,
    marginBottom: Platform.OS === "android" ? 4 : 1,
  },
  headerText3: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 10,
    marginLeft: 7,
    marginBottom: Platform.OS === "android" ? 4 : 1,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    backgroundColor: "#333",
    borderRadius: 10,
    height: Platform.OS === "android" ? 35 : 30,
    paddingHorizontal: 12,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: Platform.OS === "android" ? 2 : 0,
  },
  headerDots: {
    transform: [{ scaleX: 1.1 }],
    marginRight: 6,
  },
});
