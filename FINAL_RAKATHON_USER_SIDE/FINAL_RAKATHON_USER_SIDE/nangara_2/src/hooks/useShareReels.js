import { Share, Alert } from 'react-native';

const useShareReels = () => {

    const shareReel = async (reel) => {
        try {
            const result = await Share.share({
                message: "Check out this reel!\n\n" + reel.caption + "\n\nWatch it here: instagram.com/" + reel.username,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const shareUser = async (user) => {
        try {
            const result = await Share.share({
                message: "Check out this user!\n\nFollow them at: instagram.com/" + user.username,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return { shareReel, shareUser };
};

export default useShareReels;
