import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function PaginaIncio(props) {
   const { navigation } = props;
   return (
      <View style={styles.container}>
         <Button
            title="Iniciar Sesión"
            onPress={() => {
               navigation.navigate('IniciaSesion');
            }}
         ></Button>
         <Button
            title="Registrate"
            onPress={() => {
               navigation.navigate('Registro');
            }}
         ></Button>
         {/* boton de prueba para desloguearse */}
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
