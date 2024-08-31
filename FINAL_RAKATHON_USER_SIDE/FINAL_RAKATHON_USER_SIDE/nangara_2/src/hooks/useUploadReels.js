import { useState } from 'react';
import firebase from "firebase/compat";
import "firebase/compat/storage";

const useUploadReels = () => {
    const [loader, setLoader] = useState(false);

    const uploadReel = async (videoUrl, caption, currentUser) => {
        if (!loader) {
            setLoader(true);
            try {
                if (!videoUrl) {
                    throw new Error('Invalid video selection. Please select a valid video.');
                }

                const timestamp = new Date().getTime();
                const storageRef = firebase.storage().ref();
                const videoRef = storageRef.child(`videos/${currentUser.email}/${timestamp}`);

                // Correct the fetch usage if videoUrl is a string
                const response = await fetch(videoUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const blob = await response.blob();

                const snapshot = await videoRef.put(blob);
                const uploadedVideoUrl = await snapshot.ref.getDownloadURL();

                const newReel = {
                    videoUrl: uploadedVideoUrl,
                    username: currentUser.username,
                    profile_picture: currentUser.profile_picture,
                    owner_uid: currentUser.owner_uid,
                    owner_email: currentUser.email,
                    caption: caption,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    likes_by_users: [],
                    comments: [],
                    views: 0,
                };

                await firebase
                    .firestore()
                    .collection("users")
                    .doc(currentUser.email)
                    .collection("reels")
                    .add(newReel);
                
                console.log("Reel successfully uploaded.");
            } catch (error) {
                console.error("Error during reel upload: ", error.message || error);
                alert(`Error during reel upload: ${error.message || error}`);
            } finally {
                setLoader(false);
            }
        }
    };

    return {
        uploadReel,
        loader,
    };
};

export default useUploadReels;
