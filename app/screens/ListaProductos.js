import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import * as firebase from 'firebase';

export class ListaProductos extends Component {
   render() {
      return (
         <View>
            <Text>DIRECCION: {global.direccionPrincipal.descripcion}</Text>
            <Text></Text>
            <Text>LISTA DE PRODUCTOS </Text>
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
}
