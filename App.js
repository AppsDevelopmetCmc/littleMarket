import React from 'react';
import { firebaseApp } from './app/utils/FireBase';
import NavegadorInicio from './app/screens/navigation/NavegadorInicio';
import { decode, encode } from 'base-64'
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }

if (!global.btoa) { global.btoa = encode; }

if (!global.atob) { global.atob = decode; }

export default function App() {
   return <NavegadorInicio></NavegadorInicio>;
}
