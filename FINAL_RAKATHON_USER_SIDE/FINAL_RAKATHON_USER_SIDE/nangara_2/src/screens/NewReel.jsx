import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import SIZES from "../constants/SIZES";
import { Divider } from "react-native-elements";
import { useUserContext } from "../contexts/UserContext";
import useUploadReels from "../hooks/useUploadReels";
import MessageModal, {
  handleFeatureNotImplemented,
} from "../components/shared/modals/MessageModal";

const NewReel = ({ navigation, route }) => {
  // Correctly accessing the selected video from selectedImage object
  const { selectedImage } = route.params || {}; 
  const selectedVideoUri = selectedImage?.uri; // Safely accessing the uri property
  const { currentUser } = useUserContext();
  const { uploadReel, loader } = useUploadReels();
  const [caption, setCaption] = useState("");
  const [focusedBar, setFocusedBar] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    console.log('Route params:', route.params); // Debugging line
    if (!selectedVideoUri) {
      setTimeout(() => {
        Alert.alert("Invalid Video", "No video selected. Please select a video.");
        navigation.goBack();
      }, 0);
    }
  }, [selectedVideoUri, navigation]);

  const handleFocus = () => {
    setFocusedBar(true);
  };

  const handleBlur = () => {
    Keyboard.dismiss();
    setFocusedBar(false);
  };

  const handleNextButton = async () => {
    try {
      if (!selectedVideoUri) {
        Alert.alert("Invalid Video", "Please select a valid video file.");
        return;
      }

      await uploadReel(selectedVideoUri, caption, currentUser);
      navigation.navigate("Main Screen");
    } catch (error) {
      console.error("Error in handleNextButton: ", error);
      Alert.alert("Upload Error", "There was an issue uploading your reel. Please try again later.");
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      video.current.pauseAsync();
    } else {
      video.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  if (!selectedVideoUri) {
    return null; // Don't render the UI if there's no selected video
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={23} color={"#fff"} />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Reel</Text>
        <TouchableOpacity onPress={() => (focusedBar ? handleBlur() : handleNextButton())}>
          <Text style={styles.nextButton}>{loader ? <ActivityIndicator /> : focusedBar ? "OK" : "Share"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={() => handleBlur()}>
        <View>
          <View style={styles.inputContainer}>
            <View style={styles.videoContainer}>
              <Video
                ref={video}
                style={styles.video}
                source={{ uri: selectedVideoUri }} // Correctly using the selectedVideoUri
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={false}
              />
              <TouchableOpacity onPress={handlePlayPause} style={styles.playButtonContainer}>
                {!isPlaying && <Ionicons name="ios-play" size={50} color="white" />}
              </TouchableOpacity>
            </View>
            <View style={styles.captionContainer}>
              <TextInput
                value={caption}
                onChangeText={(caption) => setCaption(caption)}
                placeholder="Write a caption..."
                placeholderTextColor={"#999"}
                style={styles.captionText}
                multiline={true}
                onFocus={() => handleFocus()}
                onBlur={() => handleBlur()}
                maxLength={2200}
                autoCorrect={true}
                autoFocus={true}
                textAlignVertical="center"
              />
            </View>
          </View>

          <View style={styles.secondContainer}>
            <Divider width={0.4} color="#333" />
            <TouchableOpacity onPress={() => handleFeatureNotImplemented(setMessageModalVisible)} style={styles.optionsContainer}>
              <Text style={styles.optionText}>Tag people</Text>
              <MaterialIcons name="keyboard-arrow-right" size={26} color={"#999"} style={styles.optionIcon} />
            </TouchableOpacity>

            <Divider width={0.3} color="#333" />
            <TouchableOpacity onPress={() => handleFeatureNotImplemented(setMessageModalVisible)} style={styles.optionsContainer}>
              <Text style={styles.optionText}>Advanced settings</Text>
              <MaterialIcons name="keyboard-arrow-right" size={26} color={"#999"} style={styles.optionIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <MessageModal
        messageModalVisible={messageModalVisible}
        setMessageModalVisible={setMessageModalVisible}
        message={"This feature is not yet implemented."}
      />
    </SafeAreaView>
  );
};

export default NewReel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    height: 40,
  },
  headerText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  nextButton: {
    color: "#08f",
    fontWeight: "800",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: Platform.OS === "android" ? 15 : 12,
    marginHorizontal: 15,
    marginBottom: 14,
  },
  videoContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: SIZES.Width * 0.56,
    borderRadius: 4,
  },
  playButtonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  captionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  captionText: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 15,
    width: SIZES.Width * 0.66,
    marginBottom: 8,
  },
  secondContainer: {
    minHeight: 500,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
  optionIcon: {
    marginLeft: 10,
  },
});
