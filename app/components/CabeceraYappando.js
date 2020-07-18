import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
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
let { width } = Dimensions.get('window');

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
   const abrirSoporte = () => {
      navigation.navigate('Soporte');
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
         <View style={{ flexDirection: 'row', flex: 1 }}>
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
            <View style={styles.iconoBadge}>
               <TouchableOpacity
                  onPress={() => {
                     abrirMonedero();
                  }}
               >
                  <View style={styles.areaBadge}>
                     <View>
                        <Icon
                           color={colores.colorBlanco}
                           type="material-community"
                           name="cash-100"
                           size={28}
                        />
                        {valorMonedero && valorMonedero > 0 ? (
                           <Badge
                              containerStyle={{
                                 position: 'absolute',
                                 top: -4,
                                 right: -4,
                              }}
                              status="warning"
                           />
                        ) : (
                           <View></View>
                        )}
                     </View>
                  </View>
               </TouchableOpacity>
            </View>

            <View style={styles.iconoBadge}>
               <TouchableOpacity
                  onPress={() => {
                     abrirNotificacion();
                  }}
               >
                  <View style={styles.areaBadge}>
                     <View>
                        <Icon
                           color={colores.colorBlanco}
                           type="material-community"
                           name="bell"
                           size={28}
                        />
                        {numeroNotificaciones && numeroNotificaciones > 0 ? (
                           <Badge
                              value={numeroNotificaciones}
                              containerStyle={{
                                 position: 'absolute',
                                 top: -4,
                                 right: -4,
                              }}
                              status="error"
                           />
                        ) : (
                           <View></View>
                        )}
                     </View>
                  </View>
               </TouchableOpacity>
            </View>
            <View style={styles.iconoBadge}>
               <TouchableOpacity
                  onPress={() => {
                     abrirSoporte();
                  }}
               >
                  <View style={styles.areaBadge}>
                     <View>
                        <Icon
                           color={colores.colorBlanco}
                           type="material-community"
                           name="face-agent"
                           size={28}
                        />
                     </View>
                  </View>
               </TouchableOpacity>
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
      width: width-20,
      flex: 1,
      // backgroundColor: 'blue',
   },
   iconoBadge: {
      // backgroundColor: 'pink',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flex: 1,
   },
   areaBadge: {
      //  backgroundColor: 'blue',
      paddingTop: 10,
      paddingBottom: 5,
      paddingHorizontal: 5,
   },
   cabeceraIconMenu: {
      paddingRight: 15,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'stretch',
      flex: 1,
   },
   cabeceraTitulo: {
      flex: 2,

      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'stretch',
   },
   cabeceraMonedero: {
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 10,
      flex: 1,
   },
   cabeceraNotificaciones: {
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'stretch',
      paddingLeft: 10,
   },
});
