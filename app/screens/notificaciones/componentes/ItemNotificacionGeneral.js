import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Alert, Button } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../../constants/Colores';
import { transformDinero } from '../../../utils/Validaciones';
import Separador from '../../../components/Separador';
import {
   agregarDisminuirItemCarro,
   eliminarItemCarro,
} from '../../../servicios/ServicioCarroCompras';
import{formatearFechaISO,obtenerHoraActual} from '../../../utils/DateUtil' 

export class ItemNotificacionGeneral extends Component {
   constructor(props) {
      super(props);
      this.state = {
         
      };
   }

   render() {
      let fecha = this.props.notificacion.fecha.toDate();
      return (
         <View styles={styles.fila}>
            <View style={styles.touch}>
               <View style={styles.contenido}>
                  <View style={styles.subContenido}>
                     <View style={styles.estiloIconoCobertura}>
                        <Text style={this.props.notificacion.posicion<3 ? styles.textoNegrita:styles.texto}>
                        {formatearFechaISO(fecha)+" "+obtenerHoraActual(fecha) }
                        </Text>
                     </View>

                     <View style={styles.contenedorDireccion}>
                     <Text style={this.props.notificacion.posicion<3 ? styles.textoNegrita:styles.texto}>
                        {this.props.notificacion.mensaje}
                        </Text>
                     </View>
                  </View>
               </View>
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   fila: {
      flex: 1,
      backgroundColor: 'red',
      marginTop: 5,
      borderRadius: 15,
      alignItems: 'stretch',
   },

   contenido: {
      width: '100%',
   },
   contenedorEliminar: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 10,
   },
   subContenido: {
      flexDirection: 'row',
      paddingVertical: 15,
      alignItems: 'center',
   },

   texto: {
      fontSize: 13,
      textAlign: 'left',
      //fontWeight: 'bold',
   },

   textoNegrita: {
      fontSize: 13,
      textAlign: 'left',
      fontWeight: 'bold',
   },
   descripcion: {
      flex: 4,
   },
   touch: {
      flex: 3,
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
});
