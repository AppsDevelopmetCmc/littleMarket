import React from 'react';
import { firebaseApp } from './app/utils/FireBase';
import NavegadorInicio from './app/screens/navigation/NavegadorInicio';
import { decode, encode } from 'base-64';
import { YellowBox } from 'react-native';
import Geocoder from 'react-native-geocoding';

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
Geocoder.init('AIzaSyATppG_lbMSBkBrTI1_T5plpQXhDNuz5mc', {
   language: 'es-419',
});
navigator.geolocation.getCurrentPosition(
   position => {  
       obtenerDireccion(position.coords.latitude,position.coords.longitude);  
   },
   error => console.log(error.message),
   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });

obtenerDireccion = async (latitude,longitude) => {
   let addressComponent = '';
   Geocoder.from(latitude, longitude)
   .then(json => {
      addressComponent = json.results[0].formatted_address;
      global.direccionActual=addressComponent
   })
   .catch(error => 
      console.warn(error));
}

export default function App() {
   
   return <NavegadorInicio></NavegadorInicio>;
}
