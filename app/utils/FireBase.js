import firebase from 'firebase/app';

const firebaseConfig = {
   apiKey: 'AIzaSyCuPTN-HQyPxrLUr40Bl2nmX5PqNCUVnJg',
   authDomain: 'little-market-dev-377b6.firebaseapp.com',
   databaseURL: 'https://little-market-dev-377b6.firebaseio.com',
   projectId: 'little-market-dev-377b6',
   storageBucket: 'little-market-dev-377b6.appspot.com',
   messagingSenderId: '549900659572',
   appId: '1:549900659572:web:ce8621915b320376469a21',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
