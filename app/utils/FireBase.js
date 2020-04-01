import firebase from 'firebase/app';

const firebaseConfig = {
   apiKey: 'AIzaSyAbaVy1OIeWYEKIKMRE1QuFCZ18-59wHM4',
   authDomain: 'little-market-dev.firebaseapp.com',
   databaseURL: 'https://little-market-dev.firebaseio.com',
   projectId: 'little-market-dev',
   storageBucket: 'little-market-dev.appspot.com',
   messagingSenderId: '188175060398',
   appId: '1:188175060398:web:08d58eb7bbb974e17fcc3f',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
