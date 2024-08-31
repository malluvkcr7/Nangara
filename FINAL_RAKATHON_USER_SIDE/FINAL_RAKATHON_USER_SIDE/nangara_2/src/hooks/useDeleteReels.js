import firebase from "firebase/compat";

const useDeleteReels = () => {
    const deleteReel = (reel) => {
        try {
            firebase
                .firestore()
                .collection("users")
                .doc(reel.owner_email)
                .collection("reels")
                .doc(reel.id)
                .delete();
        } catch (error) {
            console.log(error);
        }
    };

    return {
        deleteReel,
    };
};

export default useDeleteReels;
