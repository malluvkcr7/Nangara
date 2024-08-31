import { StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import React from "react";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { SIZES } from "../../constants";

const RenderItem = ({ navigation, item }) => {
  return (
    <View>
      {item.imageUrl && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Detail", { item: item })}
          style={styles.imagesContainer}
          key={item.id}
        >
          {Platform.OS === "ios" && (
            <Animated.Image
              sharedTransitionTag={item.id.toString()}
              style={styles.images}
              source={{ uri: item.imageUrl }}
            />
          )}
          <FastImage
            source={{ uri: item.imageUrl }}
            style={styles.fastImages}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  imagesContainer: {
    width: SIZES.Width * 0.335,
    height: SIZES.Width * 0.335,
    margin: -0.4,
  },
  images: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 1,
    zIndex: -1,
  },
  fastImages: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
  },
});
