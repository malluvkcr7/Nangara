import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useRef } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Video } from "expo-av";
import { SIZES } from "../constants";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome
} from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { LinearGradient } from "expo-linear-gradient";
import { useUserContext } from "../contexts/UserContext";
import { useIsFocused } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import useFetchReels from "../hooks/useFetchReels";
import usePlayReels from "../hooks/usePlayReels";
import firebase from "firebase/compat";
import Skeleton from "../components/reels/Skeleton";
import MessageModal, {
  handleFeatureNotImplemented,
} from "../components/shared/modals/MessageModal";

const Reels = ({ navigation }) => {
  const videoRefs = useRef([]);
  const flatListRef = useRef(null);
  const [cartQuantity, setCartQuantity] = useState(0);

  const focusedScreen = useIsFocused();
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  const { currentUser } = useUserContext();
  const { videos } = useFetchReels();
  const {
    playingVideo,
    setCurrentIndex,
    progressBarValue,
    muteButtonVisible,
    isMuted,
    handleLongPress,
    handlePressOut,
    handlePress,
  } = usePlayReels({ videoRefs, focusedScreen });

  const handleAddToCart = () => {
    setCartQuantity(cartQuantity + 1);
  };

  const handleEmptyCart = () => {
    setCartQuantity(0);
  };
  

  const handleLike = (item) => {
    firebase
      .firestore()
      .collection("users")
      .doc(item.owner_email)
      .collection("reels")
      .doc(item.id)
      .update({
        likes_by_users: item.likes_by_users.includes(currentUser.email)
          ? firebase.firestore.FieldValue.arrayRemove(currentUser.email)
          : firebase.firestore.FieldValue.arrayUnion(currentUser.email),
      });
  };

  const renderItem = ({ item, index }) => {
    const handleUserProfile = () => {
      if (currentUser.email === item.owner_email) {
        navigation.navigate("Profile");
      } else {
        navigation.navigate("UserDetail", {
          email: item.owner_email,
        });
      }
    };

    return (
      <View>
        <TouchableWithoutFeedback
          delayLongPress={200}
          onLongPress={handleLongPress}
          onPressOut={handlePressOut}
          onPress={handlePress}
        >
          <View>
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              style={styles.video}
              source={{
                uri: item.videoUrl,
              }}
              resizeMode="cover"
              onLoad={() => {
                if (index === 0) {
                  setCurrentIndex(0);
                  videoRefs.current[index].playAsync();
                }
              }}
              isLooping
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.sideContainer}>
          <TouchableOpacity
            onPress={() => handleAddToCart(item)}
            style={styles.touchableOpacity}
          >
            <MaterialCommunityIcons
              name="shopping"
              size={32}
              color="#fff"
              style={styles.chatIcon}
            />
            <Text style={styles.sideText}>{cartQuantity}</Text>
          </TouchableOpacity>
          
          {/* Empty Cart Button */}
          <TouchableOpacity
            onPress={() => handleEmptyCart(item)}
            style={styles.touchableOpacity}
          >
            <MaterialCommunityIcons
              name="scissors-cutting"
              size={32}
              color="#fff"
              style={styles.chatIcon}
            />
            <Text style={styles.sideText}>Empty Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLike(item)}
            style={styles.touchableOpacity}
          >
            {item.likes_by_users.includes(currentUser.email) ? (
              <MaterialCommunityIcons
                name="cards-heart"
                size={30}
                color="#e33"
                style={styles.heartIcon}
              />
            ) : (
              <MaterialCommunityIcons
                name="cards-heart-outline"
                size={30}
                color="#fff"
                style={styles.heartIcon}
              />
            )}
            <Text style={styles.sideText}>{item.likes_by_users.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFeatureNotImplemented(setMessageModalVisible)}
            style={styles.touchableOpacity}
          >
            <MaterialCommunityIcons
              name="chat-outline"
              size={32}
              color="#fff"
              style={styles.chatIcon}
            />
            <Text style={styles.sideText}>{item.comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFeatureNotImplemented(setMessageModalVisible)}
            style={styles.touchableOpacity}
          >
            <Feather
              name="send"
              size={26}
              color="#fff"
              style={styles.sendIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFeatureNotImplemented(setMessageModalVisible)}
            style={styles.touchableOpacity}
          >
            <Text style={styles.sideText}>{item.shared}</Text>
            <Ionicons name="ellipsis-horizontal" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.userContainer}>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              onPress={handleUserProfile}
              style={styles.profileContainer}
            >
              <LinearGradient
                start={[0.9, 0.45]}
                end={[0.07, 1.03]}
                colors={["#00FF66", "#7788A8", "#FF00F5"]}
                style={styles.rainbowBorder}
              >
                <FastImage
                  source={{
                    uri: item.profile_picture,
                  }}
                  style={styles.profilePicture}
                />
              </LinearGradient>
              <Text style={styles.profileUsername}>{item.username}</Text>
              <MaterialCommunityIcons
                name="check-decagram"
                size={12}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableOpacity}>
              <View style={styles.followContainer}>
                <Text style={styles.followText}>Follow</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.captionText}>{item.caption}</Text>
        </View>
        <View>
          <Progress.Bar
            progress={progressBarValue}
            width={SIZES.Width}
            height={1.2}
            useNativeDriver={true}
            color="#fff"
            style={styles.progressBar}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => handleFeatureNotImplemented(setMessageModalVisible)}
          style={styles.titleContainer}
        >
          <Text style={styles.titleText}>Reels</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={22}
            color="#fff"
            style={{ marginTop: 6 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MediaLibrary", {
              initialSelectedType: "New reel",
            });
          }}
        >
          {/* <Ionicons
            name="camera-outline"
            size={32}
            color="#fff"
            style={{ marginTop: 6 }}
          /> */}
        </TouchableOpacity>
      </View>

      {muteButtonVisible && (
        <Animated.View
          style={styles.muteContainer}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Ionicons
            name={isMuted ? "volume-mute" : "volume-high"}
            size={24}
            color="#fff"
          />
        </Animated.View>
      )}

      {videos.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          pagingEnabled={true}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.y /
                event.nativeEvent.layoutMeasurement.height
            );

            if (videoRefs.current[newIndex - 1]) {
              videoRefs.current[newIndex - 1].pauseAsync();
            }
            if (videoRefs.current[newIndex + 1]) {
              videoRefs.current[newIndex + 1].pauseAsync();
            }
            if (playingVideo) {
              if (videoRefs.current[newIndex]) {
                videoRefs.current[newIndex].playAsync();
                setCurrentIndex(newIndex);
              }
            }
          }}
        />
      ) : (
        <View style={{ flex: 1, marginTop: 0 }}>
          <Skeleton />
        </View>
      )}
      <MessageModal
        messageModalVisible={messageModalVisible}
        message={"This feature is not yet implemented."}
        height={20}
      />
    </View>
  );
};



// import React, { useState, useRef } from "react";
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   FlatList,
//   TouchableWithoutFeedback,
//   StatusBar,
// } from "react-native";
// import { Video } from "expo-av";
// import { SIZES } from "../constants";
// import {
//   Ionicons,
//   MaterialIcons,
//   MaterialCommunityIcons,
//   Feather,
// } from "@expo/vector-icons";
// import useFetchReels from "../hooks/useFetchReels";
// import usePlayReels from "../hooks/usePlayReels";

// const Reels = ({ navigation }) => {
//   const videoRefs = useRef([]);
//   const flatListRef = useRef(null);
//   const [cartQuantity, setCartQuantity] = useState(0);

//   const { videos, loadNextReels } = useFetchReels();
//   const {
//     playingVideo,
//     setCurrentIndex,
//     handleLongPress,
//     handlePressOut,
//     handlePress,
//   } = usePlayReels({ videoRefs });

//   const handleAddToCart = () => {
//     setCartQuantity(cartQuantity + 1);
//   };

//   const handleEmptyCart = () => {
//     setCartQuantity(0);
//   };

//   const renderItem = ({ item, index }) => {
//     return (
//       <View>
//         <TouchableWithoutFeedback
//           delayLongPress={200}
//           onLongPress={handleLongPress}
//           onPressOut={handlePressOut}
//           onPress={handlePress}
//         >
//           <View>
//             <Video
//               ref={(ref) => (videoRefs.current[index] = ref)}
//               style={styles.video}
//               source={{ uri: item.videoUrl }}
//               resizeMode="cover"
//               onLoad={() => {
//                 if (index === 0) {
//                   setCurrentIndex(0);
//                   videoRefs.current[index].playAsync();
//                 }
//               }}
//               isLooping
//             />
//           </View>
//         </TouchableWithoutFeedback>

//         <View style={styles.sideContainer}>
//           <TouchableOpacity onPress={handleAddToCart} style={styles.touchableOpacity}>
//             <MaterialCommunityIcons name="shopping" size={32} color="#fff" style={styles.chatIcon} />
//             <Text style={styles.sideText}>{cartQuantity}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={handleEmptyCart} style={styles.touchableOpacity}>
//             <MaterialCommunityIcons name="scissors-cutting" size={32} color="#fff" style={styles.chatIcon} />
//             <Text style={styles.sideText}>Empty Cart</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {videos.length > 0 ? (
//         <FlatList
//           ref={flatListRef}
//           data={videos}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           initialNumToRender={2}
//           onMomentumScrollEnd={(event) => {
//             const newIndex = Math.round(
//               event.nativeEvent.contentOffset.y /
//                 event.nativeEvent.layoutMeasurement.height
//             );

//             if (newIndex === videos.length - 1) {
//               loadNextReels(); // Load the next set of reels
//             }
//           }}
//         />
//       ) : (
//         <View style={{ flex: 1, marginTop: 0 }}>
//           <Text>Loading...</Text>
//         </View>
//       )}
//     </View>
//   );
// }

export default Reels;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    width: SIZES.Width,
    height: Platform.OS === "ios" ? SIZES.Height * 0.913 : SIZES.Height * 0.987,
  },
  video: {
    width: SIZES.Width,
    height: Platform.OS === "ios" ? SIZES.Height * 0.913 : SIZES.Height * 0.987,
  },
  muteContainer: {
    position: "absolute",
    top: SIZES.Height * 0.42,
    left: SIZES.Width * 0.42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#666",
    borderRadius: 100,
    padding: 20,
    zIndex: 3,
  },
  headerContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 30 : StatusBar.currentHeight - 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 15,
    zIndex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 23,
  },
  sideContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 15,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 26,
    gap: 10,
  },
  touchableOpacity: {
    alignItems: "center",
    gap: 3,
  },
  sideText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 26,
  },
  heartIcon: {
    transform: [{ scaleY: 1.2 }, { scaleX: 1.2 }],
  },
  chatIcon: {
    transform: [{ scaleX: -1 }, { scaleY: 1.2 }, { scaleX: 1.2 }],
  },
  sendIcon: {
    transform: [{ rotate: "20deg" }, { scaleY: 1.2 }, { scaleX: 1.2 }],
  },
  userContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    marginBottom: 15,
    marginLeft: 15,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rainbowBorder: {
    height: 40.5,
    width: 40.5,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    height: 39,
    width: 39,
    borderWidth: 2,
    borderColor: "#666",
    borderRadius: 100,
  },
  profileUsername: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 3,
    marginBottom: 4,
  },
  followContainer: {
    borderWidth: 0.7,
    borderColor: "#bbb",
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 10,
  },
  followText: {
    color: "#fff",
    fontWeight: "700",
  },
  captionText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 14,
    marginTop: 4,
    maxWidth: SIZES.Width * 0.8,
    marginBottom: 14,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    marginBottom: SIZES.Height * 0.006,
  },
});
