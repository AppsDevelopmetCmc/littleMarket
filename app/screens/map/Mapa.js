import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function Mapa() {
   return (
      <View style={styles.container}>
         <Text>Direcciones para mapa</Text>
         <Button
            title="Cerrar Sesión"
            onPress={() => {
               firebase.auth().signOut();
               console.log('Se cerro sesion');
            }}
         ></Button>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
