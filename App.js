import React from 'react';
import { firebaseApp } from './app/utils/FireBase';
import NavegadorInicio from './app/screens/navigation/NavegadorInicio';
import { decode, encode } from 'base-64';
import { YellowBox } from 'react-native';

global.crypto = require('@firebase/firestore');
global.crypto.getRandomValues = byteArray => {
   for (let i = 0; i < byteArray.length; i++) {
      byteArray[i] = Math.floor(256 * Math.random());
   }
};

if (!global.btoa) {
   global.btoa = encode;
}

if (!global.atob) {
   global.atob = decode;
}

//console.disableYellowBox = true;
YellowBox.ignoreWarnings([
   'Warning: componentWillReceiveProps has ',
   'Setting a timer',
]);

export default function App() {
   return <NavegadorInicio></NavegadorInicio>;
}
