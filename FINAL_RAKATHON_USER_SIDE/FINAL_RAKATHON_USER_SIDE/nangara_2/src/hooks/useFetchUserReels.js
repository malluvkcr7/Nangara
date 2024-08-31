import { useEffect, useState } from "react";
import firebase from "firebase/compat";

const useFetchUserReels = (email) => {
    const [reels, setReels] = useState([]);
    const [loadLimit, setLoadLimit] = useState(20);
    const [loader, setLoader] = useState(false);
    const [onSnapshotData, setOnSnapshotData] = useState([]);
    const [timeToReplaceData, setTimeToReplaceData] = useState(0);

    useEffect(() => {
        if (!loader) {
            setLoader(true);
            try {
                const unsubscribe = firebase
                    .firestore()
                    .collection("users")
                    .doc(email)
                    .collection("reels")
                    .orderBy("createdAt", "desc")
                    .limit(loadLimit)
                    .onSnapshot(snapshot => {
                        const data = snapshot.docs.map(reel => ({ id: reel.id, ...reel.data() }));
                        if (data.length <= 0) {
                            setReels([{ id: "empty" }]);
                        } else {
                            setReels(data);
                        }
                        setOnSnapshotData(data);
                        setTimeToReplaceData(prev => prev + 1);
                    });

                return () => unsubscribe();

            } catch (error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        }
    }, [loadLimit]);

    const fetchOlderReels = async () => {
        setLoadLimit(loadLimit + 10);
    };

    const refreshReels = async () => {
        setLoadLimit(20);
    };

    return {
        reels,
        loader,
        fetchOlderReels,
        refreshReels,
        onSnapshotData,
        timeToReplaceData
    };
};

export default useFetchUserReels;
