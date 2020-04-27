import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import * as firebase from 'firebase';

export class ListaProductos extends Component {
   render() {
      const { navigation } = this.props;
      return (
         <View styles={styles.container}>
            <Text></Text>
            <Text>DIRECCION2: {global.tieneCobertura}</Text>
            <Button
               title="Direcciones"
               onPress={() => {
                  navigation.navigate('Direcciones');
               }}
            ></Button>

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
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 60,
   },
});
