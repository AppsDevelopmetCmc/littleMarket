import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { StyleSheet, View, Text } from 'react-native';
import Cargando from '../../components/Cargando';
import IniciarSesion from '../account/IniciarSesion';

import Mapa from '../map/Mapa';

export default function MiCuenta() {
   console.log('llego al balanceador');
   const [login, setLogin] = useState(null);

   useEffect(() => {
      firebase.auth().onAuthStateChanged(user => {
         !user ? setLogin(false) : setLogin(true);
      });
   }, []);

   if (login === null) {
      return <Cargando isVisible={true} text="Cargando ..."></Cargando>;
   }

   if (login) {
      return <Mapa></Mapa>;
   }
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
});
