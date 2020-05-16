import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import * as colores from '../../../constants/Colores';
export class ItemDireccionSeleccion extends Component {
   constructor(props) {
      super(props);
      this.cobertura = false;
      if (this.props.direccion.tieneCobertura == 'S') {
         this.cobertura = true;
      }
   }
   render() {
      return (
         <View styles={styles.fila}>
            <View style={styles.touch}>
               <TouchableHighlight
                  onPress={() => {
                     this.props.fnSelecionar(this.props.direccion);
                  }}
               >
                  <View style={styles.contenido}>
                     <View style={styles.subContenido}>
                        <View style={styles.estiloIconoCobertura}>
                           {this.props.direccion.tieneCoberturaDireccion ==
                              'S' ? (
                                 <Icon
                                    name="access-point-network"
                                    size={25}
                                    color={colores.colorOscuroPrimarioTomate}
                                 />
                              ) : (
                                 <Icon
                                    name="access-point-network-off"
                                    size={25}
                                    color={colores.colorClaroTexto}
                                 />
                              )}
                        </View>

                        <View style={styles.contenido}>
                           <Text style={styles.texto}>{this.props.direccion.descripcion}</Text>
                        </View>
                     </View>
                  </View>
               </TouchableHighlight>
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
      alignItems: "stretch",
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
      paddingLeft: 10,
      paddingVertical: 15,
      alignItems: 'center',
   },

   texto: {
      fontSize: 13,
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
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
   },
});
