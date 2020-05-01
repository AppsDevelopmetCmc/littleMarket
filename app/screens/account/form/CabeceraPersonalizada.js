import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';

// Importación de los colores
import * as colores from '../../../constants/Colores';

export default function CabeceraPersonalizada(props) {
   const { iconoComponente } = props;
   return (
      <View style={styles.cabeceraContenedor}>
         <View style={styles.cabeceraBoton}>{iconoComponente}</View>
         <View style={styles.cabeceraTitulo}></View>
         <View style={styles.cabeceraIcon}></View>
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
   },
   cabeceraTitulo: {
      flex: 3.5,
      justifyContent: 'center',
   },
   cabeceraIcon: {
      flex: 1,
   },
});
