import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';

// Importación de los colores
import * as colores from '../constants/Colores';

export default function CabeceraPersonalizada(props) {
   const {
      iconoNotificacion,
      iconoComponente,
      iconoMonedero,
      titulo,
      iconoDeTienda,
   } = props;
   return (
      <View style={styles.cabeceraContenedor}>
         {iconoComponente ? (
            <View style={styles.cabeceraBoton}>{iconoComponente}</View>
         ) : (
            <View></View>
         )}

         <View style={styles.cabeceraTitulo}>
            <Text style={styles.titulo}>{titulo}</Text>
         </View>

         <View style={styles.cabeceraIcon}>{iconoDeTienda}</View>
         {/*<View style={styles.cabeceraIcon}>{iconoMonedero}</View>
         <View style={styles.cabeceraIcon}>{iconoNotificacion}</View>*/}
      </View>
   );
}

const styles = StyleSheet.create({
   cabeceraContenedor: {
      flexDirection: 'row',
      height: 50,
   },
   cabeceraBoton: {
      flex: 1,

      justifyContent: 'center',
      alignItems: 'center',
   },
   cabeceraTitulo: {
      flex: 5,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginHorizontal: 10,
      //backgroundColor: 'red',
   },
   titulo: {
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
   },
   cabeceraIcon: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
