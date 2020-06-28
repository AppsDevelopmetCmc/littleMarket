import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar, CheckBox, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../constants/Colores';
import { transformDinero } from '../../utils/Validaciones';
import Separador from '../../components/Separador';
import { convertir } from '../../utils/ConvertidorUnidades';

import {
   agregarDisminuirItemCarro,
   eliminarItemCarro,
} from '../../servicios/ServicioCarroCompras';
function FlatListItemSeparator() {
   return (
      <View
         style={{
            width: '100%',
            marginVertical: 5,
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            paddingLeft: 20,
         }}
      >
         <View
            style={{
               height: 1,
               width: '100%',
               backgroundColor: colores.colorClaroPrimario,
               alignItems: 'center',
               justifyContent: 'center',
               alignContent: 'center',
            }}
         ></View>
      </View>
   );
}
export class ItemProductoNuevo extends Component {
   constructor(props) {
      super(props);
      let itemCarro = this.props.producto.itemCarro;
      if (itemCarro && itemCarro.cantidad > 0) {
         this.state = {
            checked: this.props.producto.checked,
            checkedProps: this.props.producto.checked,
            cantidad: this.props.producto.itemCarro.cantidad,
         };
      } else {
         this.state = {
            checked: this.props.producto.checked,
            checkedProps: this.props.producto.checked,
            cantidad: 1,
         };
      }
   }

   componentDidMount() {
      //console.log('--------CHECKED', this.props.producto.checked);
   }

   render() {
      let producto = this.props.producto;
      return (
         <View>
            {producto.categoria == global.categoria ? (
               <View
                  style={
                     this.state.checked ? styles.filaSeleccionada : styles.fila
                  }
               >
                  <View style={styles.colorLinea}></View>
                  <View style={styles.imagenes}>
                     <Avatar
                        title="Y"
                        placeholderStyle={{
                           backgroundColor: colores.colorPrimarioTomate,
                        }}
                        source={{ uri: this.props.producto.imagen }}
                        rounded
                        size={40}
                     ></Avatar>
                  </View>
                  <View style={styles.informacion}>
                     <View style={styles.descripcion}>
                        <Text
                           style={[
                              textEstilo(colores.colorOscuroTexto, 16, 'bold'),
                              //styles.textoNegrita,
                           ]}
                        >
                           {producto.nombre}
                        </Text>
                     </View>
                     <View
                        style={{
                           flex: 1,
                           flexDirection: 'row',
                           //backgroundColor: 'yellow',
                           marginLeft: 5,
                        }}
                     >
                        <View
                           style={{
                              flex: 2,
                              alignItems: 'flex-start',
                              justifyContent: 'flex-start',
                           }}
                        >
                           <Text
                              style={[
                                 textEstilo(colores.colorOscuroTexto, 15),
                                 //styles.textoNegrita,
                              ]}
                           >
                              {convertir(producto.unidad, producto.cantidad)}
                           </Text>
                           {/* <Text style={{ color: 'gray', fontSize: 12 }}>
                              {'> 50gr c/u'}
                           </Text> */}
                        </View>
                        <View
                           style={{
                              flex: 1,
                              alignItems: 'flex-end',
                              justifyContent: 'flex-start',
                           }}
                        >
                           <Text
                              style={textEstilo(
                                 colores.colorOscuroTexto,
                                 16,
                                 'bold'
                              )}
                           >
                              {'$ ' + transformDinero(producto.precio)}
                           </Text>
                        </View>
                     </View>
                  </View>

                  {this.state.checked ? (
                     <View
                        style={{
                           marginHorizontal: 5,
                           //backgroundColor: 'red',
                           flex: 4,
                           alignItems: 'center',
                           justifyContent: 'center',
                           flexDirection: 'column',
                           marginHorizontal: 10,
                        }}
                     >
                        <CheckBox
                           checked={this.state.checked}
                           // containerStyle={{ backgroundColor: 'yellow' }}
                           onPress={() => {
                              if (!this.state.checked) {
                                 this.setState({
                                    checked: !this.state.checked,
                                    cantidad: 1,
                                 });
                                 agregarDisminuirItemCarro(
                                    {
                                       id: producto.id,
                                       nombre: producto.nombre,
                                       unidad: producto.unidad,
                                       cantidadItem: producto.cantidad,
                                       precio: producto.precio,
                                    },
                                    global.usuario,
                                    1
                                 );
                              } else {
                                 this.setState({
                                    checked: !this.state.checked,
                                    cantidad: 1,
                                 });
                                 eliminarItemCarro(
                                    {
                                       id: producto.id,
                                    },
                                    global.usuario
                                 );
                              }
                           }}
                           checkedColor={colores.colorPrimarioVerde}
                           size={30}
                           uncheckedColor={colores.colorPrimarioVerde}
                        ></CheckBox>

                        <View
                           style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 5,
                              marginHorizontal: 0,
                           }}
                        >
                           <Button
                              buttonStyle={styles.botonModificar}
                              onPress={() => {
                                 let nuevaCantidad =
                                    parseInt(producto.itemCarro.cantidad) - 1;
                                 if (nuevaCantidad > 0) {
                                    this.setState({ cantidad: nuevaCantidad });
                                    agregarDisminuirItemCarro(
                                       {
                                          id: producto.itemCarro.id,
                                          alias: producto.itemCarro.alias,
                                          precio: producto.itemCarro.precio,
                                       },
                                       global.usuario,
                                       -1
                                    );
                                 }
                              }}
                              icon={
                                 <Icon
                                    name="minus-circle"
                                    size={20}
                                    color="white"
                                 />
                              }
                           />
                           <Separador alto={5}></Separador>
                           <Text
                              style={[
                                 styles.caja,
                                 textEstilo(
                                    colores.colorPrimarioTexto,
                                    15,
                                    'bold'
                                 ),
                              ]}
                           >
                              <Text>{this.state.cantidad}</Text>
                           </Text>
                           <Separador alto={5}></Separador>

                           <Button
                              buttonStyle={styles.botonModificar}
                              onPress={() => {
                                 let nuevaCantidad = 1;
                                 nuevaCantidad =
                                    parseInt(producto.itemCarro.cantidad) + 1;
                                 if (nuevaCantidad < 100) {
                                    this.setState({ cantidad: nuevaCantidad });
                                    agregarDisminuirItemCarro(
                                       {
                                          id: producto.itemCarro.id,
                                          nombre: producto.itemCarro.alias,
                                          precio: producto.itemCarro.precio,
                                       },
                                       global.usuario,
                                       1
                                    );
                                 }
                              }}
                              icon={
                                 <Icon
                                    name="plus-circle"
                                    size={20}
                                    color="white"
                                 />
                              }
                           />
                        </View>
                     </View>
                  ) : (
                     <View
                        style={{
                           marginHorizontal: 5,
                           //backgroundColor: 'blue',
                           flex: 4,
                           alignItems: 'center',
                           justifyContent: 'center',
                        }}
                     >
                        <CheckBox
                           checked={this.state.checked}
                           onPress={() => {
                              if (!this.state.checked) {
                                 agregarDisminuirItemCarro(
                                    {
                                       id: producto.id,
                                       nombre: producto.nombre,
                                       unidad: producto.unidad,
                                       cantidadItem: producto.cantidad,
                                       precio: producto.precio,
                                    },
                                    global.usuario,
                                    1
                                 );
                              } else {
                                 eliminarItemCarro(
                                    {
                                       id: producto.id,
                                    },
                                    global.usuario
                                 );
                              }

                              this.setState({
                                 checked: !this.state.checked,
                              });
                           }}
                           checkedColor={colores.colorPrimarioVerde}
                           size={30}
                           uncheckedColor={colores.colorPrimarioVerde}
                        ></CheckBox>
                     </View>
                  )}
               </View>
            ) : (
               <View></View>
            )}
         </View>
      );
   }
}

const borderLinea = 15;

const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   boton: {
      //paddingVertical: 5,
      //marginRight: 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
   },
   botonModificar: {
      backgroundColor: colores.colorPrimarioVerde,
   },
   fila: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorBlanco,
      marginTop: 2,

      borderBottomColor: colores.colorPrimarioVerde,
      borderBottomWidth: 1,

      // marginLeft: 15,
      // borderBottomLeftRadius: 6,
      // borderTopLeftRadius: 6,
   },
   filaSeleccionada: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorPrimarioAmarilloRgba,
      marginTop: 2,
      // marginLeft: 15,
      //      borderBottomLeftRadius: 6,
      //    borderTopLeftRadius: 6,
      borderBottomColor: colores.colorPrimarioVerde,
      borderBottomWidth: 1,
   },
   imagenes: {
      flex: 3,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
   },
   informacion: {
      flex: 10,
      flexDirection: 'column',
      marginBottom: 5,
   },
   descripcion: {
      flex: 1,
      marginLeft: 5,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      // backgroundColor: 'pink',
   },

   filaFlexEnd: {
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'center',
   },
   contenido: {
      flex: 5,
      flexDirection: 'row',
      backgroundColor: 'red',
   },
   checked: {
      flex: 1,
      // backgroundColor: 'yellow',
      alignItems: 'center',
      justifyContent: 'flex-start',
      //paddingBottom: 24.5,
   },

   textoNegrita: {
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
   /*colorLinea: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 5,
      borderTopStartRadius: borderLinea,
      borderBottomStartRadius: borderLinea,
   },*/
});
