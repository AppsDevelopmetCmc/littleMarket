import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { StyleSheet, View, Text } from 'react-native';
import Cargando from '../../components/Cargando';

export default function MiCuenta() {
   const [login, setLogin] = useState(null);

   useEffect(() => {
      firebase.auth().onAuthStateChanged(user => {
         !user ? setLogin(false) : setLogin(true);
      });
   }, []);

   return <Cargando isVisible={true} text="Cargando ..."></Cargando>;

   // if (login === null) {
   //    return <Cargando isVisible={true} text="Cargando ..."></Cargando>;
   // }

   // if (login) {
   //    return (
   //       <View style={styles.container}>
   //          <Text>Usuario Logueado</Text>
   //       </View>
   //    );
   // }

   // return (
   //    <View style={styles.container}>
   //       <Text>Usuario No Logueado</Text>
   //    </View>
   // );
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
});
