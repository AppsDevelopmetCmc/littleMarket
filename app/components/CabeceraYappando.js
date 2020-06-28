import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

// Importación de los colores
import * as colores from '../constants/Colores';

export function CabeceraYappando() {
   const navigation = useNavigation();

   const abrirDrawer = () => {
      navigation.openDrawer();
   };

   const abrirMonedero = () => {
      navigation.navigate('Monedero');
   };
   const abrirNotificacion = () => {
      navigation.navigate('ListaNotificacionScreen');
   };

   return (
      <View style={styles.cabeceraContenedor}>
         <View style={{ flexDirection: 'row' }}>
            <View style={styles.cabeceraIconMenu}>
               <Icon
                  name="menu"
                  type="material-community"
                  color={colores.colorBlanco}
                  size={29.5}
                  onPress={() => {
                     abrirDrawer();
                  }}
               />
            </View>
            <View style={styles.cabeceraTitulo}>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}>
                  Yappando
               </Text>
            </View>
            <View style={styles.cabeceraMonedero}>
               <Icon
                  name="cash-100"
                  type="material-community"
                  color={colores.colorBlanco}
                  size={29.5}
                  onPress={() => {
                     abrirMonedero();
                  }}
               />
            </View>
            <View style={styles.cabeceraNotificaciones}>
               <Icon
                  name="bell"
                  type="material-community"
                  color={colores.colorBlanco}
                  size={29.5}
                  onPress={() => {
                     abrirNotificacion();
                  }}
               />
            </View>
         </View>
      </View>
   );
}

const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};
const styles = StyleSheet.create({
   cabeceraContenedor: {
      width: '140%',
   },
   cabeceraIconMenu: {
      paddingRight: 15,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'stretch',
   },
   cabeceraTitulo: {
      flex: 1,

      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'stretch',
   },
   cabeceraMonedero: {
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 10,
   },
   cabeceraNotificaciones: {
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'stretch',
      paddingLeft: 10,
   },
});
