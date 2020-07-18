import React from 'react';
import NavegadorInicio from './app/screens/navigation/NavegadorInicio';
import { decode, encode } from 'base-64';
import { YellowBox, Alert } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps } from './app/utils/ApiKey';
import { ServicioParametros } from './app/servicios/ServicioParametros';

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
global.version = '0.0.9.0';

const validarVersion = version => {
   if (version.valor != global.version) {
      Alert.alert(
         'Problemas de versión',
         'La versión actual: ' +
         global.version +
         ' no corresponde a la versión oficial ' +
         version.valor +
         '. Cierre la aplicación y vuelva abrir.'
      );
   }
};

let servParametros = new ServicioParametros();
servParametros.obtenerVersion(validarVersion);

Geocoder.init(apiKeyMaps, {
   language: 'es-419',
});
navigator.geolocation.getCurrentPosition(
   position => {
      obtenerDireccion(position.coords.latitude, position.coords.longitude);
   },
   error => console.log(error.message),
   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
);

obtenerDireccion = async (latitude, longitude) => {
   let addressComponent = '';
   Geocoder.from(latitude, longitude)
      .then(json => {
         addressComponent = json.results[0].formatted_address;
         global.direccionActual = addressComponent;
         global.longIni = longitude;
         global.latIni = latitude;
      })
      .catch(error => console.warn(error));
};

export default function App() {
   return <NavegadorInicio></NavegadorInicio>;
}
