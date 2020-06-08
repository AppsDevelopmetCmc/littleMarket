import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Alert, Button } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../../constants/Colores';
import { transformDinero } from '../../../utils/Validaciones';
import Separador from '../../../components/Separador';

import { formatearFechaISO, obtenerHoraActual } from '../../../utils/DateUtil';

export class ItemNotificacionGeneral extends Component {
   constructor(props) {
      super(props);
      this.state = {};
   }

   // TO DO: Se debe realizar el desarrollo para categorias y para cambio de iconos,
   //        el cambio de estado para que solo se muestren las notificaciones pendientes.
   render() {
      let fecha = this.props.notificacion.fecha.toDate();
      return (
         <View style={styles.touch}>
            <View style={styles.colorLinea}></View>

            <View style={styles.contenedorTexto}>
               <View style={styles.subContenido}>
                  <View style={styles.estiloIconoCobertura}>
                     <Text
                        style={
                           this.props.notificacion.posicion < 3
                              ? styles.textoNegrita
                              : styles.texto
                        }
                     >
                        {formatearFechaISO(fecha) +
                           ' ' +
                           obtenerHoraActual(fecha)}
                     </Text>
                  </View>

                  <View style={styles.contenedorDireccion}>
                     <Text
                        style={
                           this.props.notificacion.posicion < 3
                              ? styles.textoNegrita
                              : styles.texto
                        }
                     >
                        {this.props.notificacion.mensaje}
                     </Text>
                  </View>
               </View>
            </View>
            <View style={styles.contenedorIcono}>
               <Icon
                  name="bell"
                  size={30}
                  color={colores.colorPrimarioTomate}
               />
            </View>
         </View>
      );
   }
}
const borderLinea = 15;

const styles = StyleSheet.create({
   contenido: {},
   contenedorEliminar: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 10,
   },
   subContenido: {
      paddingVertical: 15,
   },

   texto: {
      fontSize: 14,
      textAlign: 'left',
      //fontWeight: 'bold',
   },

   textoNegrita: {
      fontSize: 14,
      textAlign: 'left',
      fontWeight: 'bold',
   },
   descripcion: {
      flex: 4,
   },
   touch: {
      flex: 1,
      backgroundColor: colores.colorBlanco,
      flexDirection: 'row',
      marginBottom: 10,
      borderRadius: 6,
      shadowColor: colores.colorNegro,
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
   },
   estiloIconoCobertura: { marginRight: 15 },
   estiloBotonEliminar: {
      width: 30,
      height: 30,
      borderRadius: 10,
      backgroundColor: colores.colorPrimarioTomate,
   },
   textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
   },
   contenedorDireccion: { flex: 1 },
   colorLinea: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 5,
      borderTopStartRadius: borderLinea,
      borderBottomStartRadius: borderLinea,
   },
   contenedorIcono: {
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
   },
   contenedorTexto: { flex: 2, justifyContent: 'center', paddingLeft: 20 },
});
