import React from 'react';
import { firebaseApp } from './app/utils/FireBase';
import MiCuenta from './app/screens/account/MiCuenta';

import { Text, View } from 'react-native';

export default function App() {
   return <MiCuenta></MiCuenta>;
}
