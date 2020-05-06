import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as colores from '../../../constants/Colores';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
   agregarDisminuirItemCarro,
   eliminarItemCarro,
} from '../../../servicios/ServicioCarroCompras';

import Separador from '../../../components/Separador';

export class ItemCarro extends Component {
   constructor(props) {
      super(props);
   }
   /*componentDidMount = () => {
      console.log('mounted');
   };*/
   render() {
      return (
         <View style={styles.fila}>
            <View style={styles.contenido}>
               <Text style={textEstilo(colores.colorPrimarioTexto, 16, 'bold')}>
                  {this.props.item.alias}
               </Text>
               <View style={styles.contenidoDetalle}>
                  <View style={styles.filaFlexEnd}>
                     <Text
                        style={textEstilo(
                           colores.colorPrimarioTexto,
                           14,
                           'bold'
                        )}
                     >
                        Cantidad:
                     </Text>
                     <Text
                        style={textEstilo(
                           colores.colorPrimarioTexto,
                           14,
                           'bold'
                        )}
                     >
                        Precio Unitario:
                     </Text>
                     <Text
                        style={textEstilo(
                           colores.colorPrimarioTexto,
                           16,
                           'bold'
                        )}
                     >
                        Precio Total:
                     </Text>
                  </View>
                  <View style={styles.filaFlexStart}>
                     <Text
                        style={textEstilo(
                           colores.colorPrimarioTexto,
                           14,
                           'normal'
                        )}
                     >
                        {this.props.item.cantidad}
                     </Text>
                     <Text
                        style={textEstilo(
                           colores.colorPrimarioTexto,
                           14,
                           'normal'
                        )}
                     >
                        {this.props.item.precio}
                     </Text>
                     <Text
                        style={textEstilo(
                           colores.colorPrimarioTexto,
                           16,
                           'bold'
                        )}
                     >
                        {'$ ' + this.props.item.subtotal}
                     </Text>
                  </View>
               </View>
            </View>
            {/*<View style={styles.checked}>
               <Icon
                  name="delete-circle"
                  size={30}
                  color="white"
                  onPress={() => {
                     this.props.fnEliminarItemCarro(
                        this.props.item,
                        global.usuario
                     );
                  }}
               />
            </View>*/}

            <View style={styles.boton}>
               <Button
                  buttonStyle={styles.plusButton}
                  onPress={() => {
                     let nuevaCantidad = parseInt(this.props.item.cantidad) - 1;
                     if (nuevaCantidad < 100) {
                        //this.setState({ cantidad: nuevaCantidad + '' });
                        agregarDisminuirItemCarro(
                           {
                              id: this.props.item.id,
                              alias: this.props.item.alias,
                              precio: this.props.item.precio,
                           },
                           global.usuario,
                           1
                        );
                     }
                  }}
                  icon={<Icon name="plus-circle" size={20} color="white" />}
               />
               <Separador alto={5}></Separador>
               <Text
                  style={[
                     styles.caja,
                     textEstilo(colores.colorPrimarioTexto, 15, 'bold'),
                  ]}
               >
                  {this.props.item.cantidad}
               </Text>
               <Separador alto={5}></Separador>
               <Button
                  buttonStyle={styles.plusButton}
                  onPress={() => {
                     let nuevaCantidad = parseInt(this.props.item.cantidad) - 1;
                     if (nuevaCantidad > 0) {
                        //this.setState({ cantidad: nuevaCantidad + '' });
                        agregarDisminuirItemCarro(
                           {
                              id: this.props.item.id,
                              alias: this.props.item.alias,
                              precio: this.props.item.precio,
                           },
                           global.usuario,
                           -1
                        );
                     } else if (nuevaCantidad == 0) {
                        eliminarItemCarro(
                           {
                              id: this.props.item.id,
                           },
                           global.usuario
                        );
                     }
                  }}
                  icon={<Icon name="minus-circle" size={20} color="white" />}
               />
            </View>
         </View>
      );
   }
}

const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   fila: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorPrimarioAmarillo,
      borderRadius: 20,
      marginTop: 5,
   },
   filaFlexEnd: {
      flex: 1,
      alignItems: 'flex-end',
   },
   filaFlexStart: {
      flex: 1,
      alignItems: 'flex-start',
      marginLeft: 10,
   },
   contenido: {
      paddingVertical: 10,
      flex: 1,
      paddingHorizontal: 20,
   },
   checked: {
      flex: 1,
      //backgroundColor: 'yellow',
      alignItems: 'center',
      justifyContent: 'center',
   },

   boton: {
      paddingVertical: 15,
      marginRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   caja: {
      width: 40,
      height: 40,
      textAlign: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colores.colorBlanco,
      borderRadius: 20,
   },
   plusButton: {
      backgroundColor: colores.colorOscuroPrimarioTomate,
      borderRadius: 15,
   },
   contenidoDetalle: { flexDirection: 'row', paddingTop: 20 },
});
