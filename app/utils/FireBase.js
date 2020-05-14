import firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/storage';

export const cargarConfiguracion = () => {
   const firebaseConfig = {
      apiKey: 'AIzaSyCuPTN-HQyPxrLUr40Bl2nmX5PqNCUVnJg',
      authDomain: 'little-market-dev-377b6.firebaseapp.com',
      databaseURL: 'https://little-market-dev-377b6.firebaseio.com',
      projectId: 'little-market-dev-377b6',
      storageBucket: 'little-market-dev-377b6.appspot.com',
      messagingSenderId: '549900659572',
      appId: '1:549900659572:web:350e02ee7b2f223b469a21',
   };
   firebaseApp = firebase.initializeApp(firebaseConfig);
   global.db = firebase.firestore();
   global.storage = firebase.storage();
   global.firebaseRegistrado = true;
};
