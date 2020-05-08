import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import * as colores from '../../../constants/Colores';
export class ItemDireccion extends Component {
   constructor(props) {
      super(props);
      this.cobertura = false;
      if (this.props.direccion.tieneCobertura == 'S') {
         this.cobertura = true;
      }
   }
   render() {
      return (
         <View style={styles.fila}>
            <View style={styles.touch}>
               <TouchableOpacity
                  onPress={() => {
                     this.props.fnActualizar(this.props.direccion);
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
                        <View style={styles.descripcion}>
                           <Text style={styles.texto}>Mi casa</Text>
                           <Text style={styles.texto}>
                              {'Arturo Tipanguano y Luis Chipantiza '}
                              {this.props.direccion.descripcion}
                           </Text>
                        </View>
                     </View>
                  </View>
               </TouchableOpacity>
            </View>
            {/* <View style={styles.contenedorEliminar}>
               <Button
                  buttonStyle={styles.estiloBotonEliminar}
                  onPress={() => {
                     this.props.fnEliminar(this.props.direccion.id);
                  }}
                  icon={
                     <Icon
                        name="delete"
                        size={15}
                        color={colores.colorBlanco}
                        style={styles.iconoStilos}
                     />
                  }
               />
            </View> */}
         </View>
      );
   }
}

const styles = StyleSheet.create({
   fila: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorBlanco,
      marginTop: 5,
      borderRadius: 15,
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
});
