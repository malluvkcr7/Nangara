import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app'; // Ensure you have imported firebase/app
import 'firebase/compat/firestore'; // Import firestore from firebase

const useFetchReels = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Ensure the Firebase app is initialized
    if (!firebase.apps.length) {
      console.error("Firebase is not initialized. Please initialize it before using this hook.");
      return;
    }

    // Setup the Firestore subscription
    const unsubscribe = firebase
      .firestore()
      .collectionGroup('reels')
      .onSnapshot(
        (snapshot) => {
          const fetchedVideos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVideos(fetchedVideos);
        },
        (error) => {
          console.error('Error fetching reels from Firestore:', error);
        }
      );

    // Cleanup the subscription on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    videos,
  };
};

export default useFetchReels;

// import { useState, useEffect, useCallback } from 'react';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';

// const useFetchReels = () => {
//   const [videos, setVideos] = useState([]);
//   const [lastVisible, setLastVisible] = useState(null);

//   // Fetch the next set of reels
//   const fetchNextReels = useCallback(() => {
//     if (!firebase.apps.length) {
//       console.error("Firebase is not initialized. Please initialize it before using this hook.");
//       return;
//     }

//     const query = firebase.firestore().collectionGroup('reels').limit(2);

//     if (lastVisible) {
//       query.startAfter(lastVisible);
//     }

//     query
//       .get()
//       .then((snapshot) => {
//         if (!snapshot.empty) {
//           const fetchedVideos = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
//           setVideos((prevVideos) => [...prevVideos, ...fetchedVideos]);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching reels from Firestore:', error);
//       });
//   }, [lastVisible]);

//   // Fetch the first set of reels on component mount
//   useEffect(() => {
//     fetchNextReels();
//   }, [fetchNextReels]);

//   // Function to load the next set of reels
//   const loadNextReels = () => {
//     setVideos([]);
//     fetchNextReels();
//   };

//   return {
//     videos,
//     loadNextReels,
//   };
// };

// export default useFetchReels;
