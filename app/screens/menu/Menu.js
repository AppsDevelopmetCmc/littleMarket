import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Avatar, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
   createDrawerNavigator,
   DrawerItemList,
} from '@react-navigation/drawer';

// Importación de los colores
import * as colores from '../../constants/Colores';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Separador from '../../components/Separador';

// Boton Personalizado para cada Item
function MenuPersonalizado(props) {
   return (
      <TouchableOpacity onPress={props.navegador}>
         <View style={styles.menuContainer}>
            <View style={styles.iconoContainer}>
               <Icon size={17} name={props.nombreIcono} />
            </View>
            <View style={styles.tituloContainer}>
               <Text>{props.tituloNombre}</Text>
            </View>
         </View>
      </TouchableOpacity>
   );
}
function SeparadorMenu() {
   return (
      <View
         style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
         }}
      >
         <View
            style={{
               height: 0.5,
               width: '100%',
               backgroundColor: colores.colorClaroTexto,
               alignItems: 'center',
               justifyContent: 'center',
               alignContent: 'center',
            }}
         ></View>
      </View>
   );
}

export function Menu(props) {
   return (
      <View style={styles.contenedorArea}>
         <View style={styles.contenedorCabecera}>
            <View style={styles.contendorTextoCabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 25, 'bold')}>
                  Yappando
               </Text>
               <Separador alto={5}></Separador>
               <Text style={textEstilo(colores.colorBlancoTexto, 14, 'bold')}>
                  Tu tienda de compra en línea
               </Text>
            </View>
         </View>
         <View style={styles.contenedorMenu}>
            <View>
               <MenuPersonalizado
                  nombreIcono="store"
                  tituloNombre="Inicio"
                  navegador={() => props.navigation.navigate('ListaCombos')}
               ></MenuPersonalizado>
               <SeparadorMenu></SeparadorMenu>
               <MenuPersonalizado
                  nombreIcono="map-marker"
                  tituloNombre="Direcciones"
                  navegador={() =>
                     props.navigation.navigate('DirectionCrudStack')
                  }
               ></MenuPersonalizado>
               <SeparadorMenu></SeparadorMenu>
               <MenuPersonalizado
                  nombreIcono="account"
                  tituloNombre="Perfil"
                  navegador={() => props.navigation.navigate('PerfilUsuario')}
               ></MenuPersonalizado>
               <SeparadorMenu></SeparadorMenu>
               <MenuPersonalizado
                  nombreIcono="deskphone"
                  tituloNombre="Facturas"
                  navegador={() =>
                     props.navigation.navigate('ListarDatosFacturacion')
                  }
               ></MenuPersonalizado>
            </View>
            <View style={styles.contenedorCerrarSesion}>
               <SeparadorMenu></SeparadorMenu>
               <MenuPersonalizado
                  nombreIcono="exit-to-app"
                  tituloNombre="Cerrar Sesión"
                  navegador={() => {
                     // TO DO: se debe cerrar el drawer?

                     Alert.alert(
                        'Cerrando Sesión',
                        'Esta seguro que desea cerrar la sesión',
                        [
                           {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              //TO DO: Se debe cerrar el drawer?
                              style: 'cancel',
                           },
                           {
                              text: 'OK',
                              onPress: () => firebase.auth().signOut(),
                           },
                        ],
                        { cancelable: false }
                     );
                  }}
               ></MenuPersonalizado>
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
   menuContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 15,
   },
   iconoContainer: {
      flex: 1.5,
      justifyContent: 'center',
   },
   tituloContainer: {
      flex: 8.5,
      justifyContent: 'center',
   },
   contenedorArea: {
      flex: 1,
   },
   contenedorMenu: {
      flex: 4.6,
      justifyContent: 'space-between',
      paddingLeft: 15,
      paddingTop: 15,
   },
   contenedorCerrarSesion: { paddingBottom: 20 },
   contenedorCabecera: {
      backgroundColor: colores.colorOscuroPrimarioVerde,
      flex: 1,
   },
   contendorTextoCabecera: { paddingTop: 50, paddingLeft: 15 },
});
