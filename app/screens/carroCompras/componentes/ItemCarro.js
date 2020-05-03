import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import * as colores from '../../../constants/Colores';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
   agregarDisminuirItemCarro,
   eliminarItemCarro,
} from '../../../servicios/ServicioCarroCompras';

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
               <View style={styles.subContenido}>
                  {/* <View style={styles.imagenes}>
                        <Avatar
                           rounded
                           size={70}
                           source={{ uri: this.props.combo.imagen }}
                        />
                     </View> */}
                  <View style={styles.contenido}>
                     <View style={styles.container}>
                        <Text style={styles.textoNegrita}>
                           {this.props.item.alias}
                        </Text>
                     </View>
                     <View style={styles.filaFlexEnd}>
                        <Text style={styles.textoNegrita}>Cantidad:</Text>
                        <Text style={styles.texto}>
                           {this.props.item.cantidad}
                        </Text>
                     </View>
                     <View style={styles.filaFlexEnd}>
                        <Text style={styles.textoNegrita}>
                           Precio Unitario:
                        </Text>
                        <Text style={styles.texto}>
                           {this.props.item.precio}
                        </Text>
                     </View>
                     <View style={styles.filaFlexEnd}>
                        <Text style={styles.textoNegrita}>Precio Total:</Text>
                        <Text style={styles.texto}>
                           {this.props.item.subtotal}
                        </Text>
                     </View>
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
               <Text style={styles.caja}> {this.props.item.cantidad}</Text>
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
      flex: 4,
      alignItems: 'stretch',
      //backgroundColor: 'pink',
   },
   checked: {
      flex: 1,
      //backgroundColor: 'yellow',
      alignItems: 'center',
      justifyContent: 'center',
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
   boton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
   },
   caja: {
      width: 40,
      height: 35,
      textAlign: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'black',
      borderWidth: 1,
      // marginLeft: 10,
      //marginRight: 10,
      //  textAlign: 'right',
      paddingRight: 5,
      backgroundColor: 'white',
   },
   plusButton: {
      backgroundColor: colores.colorOscuroPrimarioTomate,
   },
});
