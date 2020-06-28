import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
   Button,
   Avatar,
   Input,
   Icon,
   Badge,
   withBadge,
} from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

// Importación de los colores
import * as colores from '../constants/Colores';

export function CabeceraYappando() {
   const navigation = useNavigation();
   const [numeroNotificaciones, setNumeroNotificaciones] = useState(0);
   const [valorMonedero, setValorMonedero] = useState(0);

   // logs
   console.log('numeroNotificaciones', numeroNotificaciones);
   console.log('valorMonedero', valorMonedero);

   useEffect(() => {
      traeInformacionMonedero();
      traeInformacionNotificaciones();
   });

   const abrirDrawer = () => {
      navigation.openDrawer();
   };

   const abrirMonedero = () => {
      withBadge;
      navigation.navigate('Monedero');
   };
   const abrirNotificacion = () => {
      navigation.navigate('ListaNotificacionScreen');
   };

   const BadgedIcon = withBadge(numeroNotificaciones)(Icon);

   // funciones para traer información de la base
   // Monedero
   const traeInformacionMonedero = async () => {
      let documento = {};
      await global.db
         .collection('monederos')
         .doc(global.usuario)
         .get()
         .then(doc => {
            if (doc.data()) {
               documento = doc.data();
               setValorMonedero(documento.valor);
            } else {
               setValorMonedero(0);
            }
         })
         .catch(err => {
            console.log('Error firebase', err);
         });
   };

   // Notificaciones
   const traeInformacionNotificaciones = async () => {
      let documento = {};
      await global.db
         .collection('notificaciones')
         .doc(global.usuario)
         .get()
         .then(doc => {
            if (doc.data()) {
               documento = doc.data();
               setNumeroNotificaciones(documento.numero);
            } else {
               setNumeroNotificaciones(0);
            }
         })
         .catch(err => {
            console.log('Error firebase', err);
         });
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
               {valorMonedero != 0 && (
                  <Badge
                     status="warning"
                     containerStyle={{
                        position: 'absolute',
                        top: -0,
                        right: 3,
                     }}
                  />
               )}
            </View>

            <View style={styles.cabeceraNotificaciones}>
               {numeroNotificaciones == 0 ? (
                  <Icon
                     name="bell"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={29.5}
                     onPress={() => {
                        abrirNotificacion();
                     }}
                  />
               ) : (
                  <BadgedIcon
                     name="bell"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={29.5}
                     onPress={() => {
                        abrirNotificacion();
                     }}
                  />
               )}
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
