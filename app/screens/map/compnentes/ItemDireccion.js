import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button, CheckBox } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
               <TouchableHighlight
                  onPress={() => {
                     this.props.fnActualizar(this.props.direccion);
                  }}
               >
                  <View style={styles.contenido}>
                     <View style={styles.subContenido}>
                        <View style={styles.descripcion}>
                           <Text style={styles.texto}>
                              {' '}
                              {this.props.direccion.descripcion}
                           </Text>
                        </View>
                        <View style={styles.iconos}>
                           <Text>
                              {this.props.direccion.tieneCoberturaDireccion == 'S' ? (
                                 <Icon
                                    name="access-point-network"
                                    size={30}
                                    color="black"
                                 />
                              ) : (
                                 <Icon
                                    name="access-point-network-off"
                                    size={30}
                                    color="black"
                                 />
                              )}
                           </Text>
                        </View>
                     </View>
                  </View>
               </TouchableHighlight>
            </View>
            <View style={styles.boton}>
               <Button
                  title="Eliminar"
                  onPress={() => {
                     this.props.fnEliminar(this.props.direccion.id);
                  }}
               />
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,

      alignItems: 'stretch',
      justifyContent: 'center',
      fontWeight: 'bold',
      //backgroundColor: 'red',
   },
   fila: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'orange',
      //borderBottomColor: 'gray',
      //borderBottomWidth: 1,
      marginTop: 10,
      marginLeft: 20,
      borderBottomLeftRadius: 10,
      borderTopLeftRadius: 10,
   },
   filaFlexEnd: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginRight: 10,
   },
   contenido: {
      flex: 8,
      alignItems: 'stretch',
      //backgroundColor: 'pink',
   },
   boton: {
      flex: 1,
      //backgroundColor: 'yellow',
      alignItems: 'stretch',
      justifyContent: 'flex-end',
   },
   subContenido: {
      flex: 1,
      flexDirection: 'row',
      //backgroundColor: 'red',
   },
   imagenes: {
      flex: 1,
      //  backgroundColor: 'green',
      alignItems: 'center',
      padding: 20,
   },
   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      marginLeft: 10,
   },
   texto: {
      fontSize: 15,
      marginTop: 0,
      marginLeft: 10,
   },
   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },
   iconos: { flex: 1, alignItems: 'center' },
   descripcion: {
      flex: 4,
   },
   touch: {
      flex: 3,
   },
});
