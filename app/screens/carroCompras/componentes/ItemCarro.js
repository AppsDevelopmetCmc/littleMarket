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
import { transformDinero } from '../../../utils/Validaciones';
import { convertir } from '../../../utils/ConvertidorUnidades';

export class ItemCarro extends Component {
   constructor(props) {
      super(props);
   }
   /*componentDidMount = () => {
      console.log('mounted');
   };*/
   render() {
      return (
         <View style={styles.contenedorPrincipal}>
            <View style={styles.tituloContenedor}>
               <View>
                  <Text
                     style={textEstilo(colores.colorPrimarioTexto, 16, 'bold')}
                  >
                     {this.props.item.nombre}
                  </Text>
                  <Text
                     style={textEstilo(
                        colores.colorPrimarioTexto,
                        14,
                        'normal'
                     )}
                  >
                     {convertir(
                        this.props.item.unidad,
                        this.props.item.cantidadItem * this.props.item.cantidad
                     )}
                  </Text>
               </View>
               <Icon
                  name="delete"
                  size={20}
                  color={colores.colorOscuroPrimarioTomate}
                  style={styles.iconoStilos}
                  onPress={() => {
                     eliminarItemCarro(
                        {
                           id: this.props.item.id,
                        },
                        global.usuario
                     );
                     global.repintarSeleccionProductos();
                  }}
               />
            </View>
            <View style={styles.fila}>
               <View style={styles.contenido}>
                  <View style={styles.contenidoDetalle}>
                     <View style={styles.filaFlexEnd}>
                        <Text
                           style={textEstilo(
                              colores.colorPrimarioTexto,
                              16,
                              'bold'
                           )}
                        >
                           Precio:
                        </Text>
                     </View>
                     <View style={styles.filaFlexStart}>
                        <Text
                           style={textEstilo(
                              colores.colorPrimarioTexto,
                              16,
                              'bold'
                           )}
                        >
                           {'$ ' + transformDinero(this.props.item.subtotal)}
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
                        let nuevaCantidad =
                           parseInt(this.props.item.cantidad) - 1;
                        if (nuevaCantidad > 0) {
                           agregarDisminuirItemCarro(
                              {
                                 id: this.props.item.id,
                                 alias: this.props.item.alias,
                                 precio: this.props.item.precio,
                              },
                              global.usuario,
                              -1
                           );
                        } /*else if (nuevaCantidad == 0) {
                           eliminarItemCarro(
                              {
                                 id: this.props.item.id,
                              },
                              global.usuario
                           );
                        }*/
                     }}
                     icon={<Icon name="minus-circle" size={15} color="white" />}
                  />
                  <Separador alto={5}></Separador>
                  <Text
                     style={[
                        styles.caja,
                        textEstilo(colores.colorPrimarioTexto, 15, 'bold'),
                     ]}
                  >
                     {this.props.item.cantidadItem * this.props.item.cantidad}
                  </Text>
                  <Separador alto={5}></Separador>

                  <Button
                     buttonStyle={styles.plusButton}
                     onPress={() => {
                        let nuevaCantidad =
                           parseInt(this.props.item.cantidad) - 1;
                        if (nuevaCantidad < 100) {
                           agregarDisminuirItemCarro(
                              {
                                 id: this.props.item.id,
                                 nombre: this.props.item.alias,
                                 precio: this.props.item.precio,
                              },
                              global.usuario,
                              1
                           );
                        }
                     }}
                     icon={<Icon name="plus-circle" size={15} color="white" />}
                  />
               </View>
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
      flexDirection: 'row',
      marginTop: 5,
      borderRadius: 20,
   },
   filaFlexEnd: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
   },
   filaFlexStart: {
      flex: 1,
      alignItems: 'flex-start',
      marginLeft: 10,
   },
   contenido: {
      //paddingVertical: 10,
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
   },
   checked: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },

   boton: {
      paddingVertical: 5,
      marginRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
   },
   caja: {
      width: 35,
      height: 35,
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
   contenidoDetalle: {
      flexDirection: 'row',
      //paddingVertical: 15,
      //justifyContent: 'center',
   },
   contenedorPrincipal: {
      flex: 1,
      backgroundColor: colores.colorPrimarioAmarilloRgba,
      marginTop: 5,
      borderRadius: 20,
   },
   tituloContenedor: {
      backgroundColor: colores.colorPrimarioAmarillo,
      borderTopStartRadius: 20,
      borderTopEndRadius: 20,
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
   },
   iconoStilos: { marginRight: 10 },
});
