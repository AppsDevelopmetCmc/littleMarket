import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import * as colores from '../../../constants/Colores';
import Separador from '../../../components/Separador';

export class ItemPedido extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <TouchableHighlight
            onPress={() => {
               this.props.nav.navigate('DetallePedidoScreen', {
                  pedido: this.props.pedido,
               });
            }}
         >
            <View style={styles.fila}>
               <View style={styles.contenido}>
                  <View style={styles.contenidoDetalle}>
                     <Text style={styles.textoNegrita}>
                        Orden: 0000000000001
                     </Text>
                     <Text style={styles.textoNegrita}>
                        {this.props.pedido.fechaPedido + ' | 12:00 pm'}
                     </Text>
                     <View style={styles.contenedorPares}>
                        <Text style={styles.texto}>Fecha de Entrega</Text>
                        <Text style={styles.textoNegrita}>
                           {this.props.pedido.fechaEntrega}
                        </Text>
                     </View>
                     <View style={styles.contenedorPares}>
                        <Text style={styles.texto}>Forma de Pago</Text>
                        <Text style={styles.textoNegrita}>Efectivo</Text>
                     </View>
                  </View>
                  <Separador alto={30}></Separador>
                  <View style={styles.contenidoDetalle}>
                     {/* <Text style={styles.texto}>Dirección</Text>
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 12, 'bold')}
                     >
                        {this.props.pedido.direccion}
                     </Text> */}

                     <View style={styles.contenedorPares}>
                        <Text style={styles.texto}>Estado</Text>
                        <View style={styles.estiloEstado}>
                           <Text
                              style={textEstilo(
                                 colores.colorBlancoTexto,
                                 13,
                                 'bold'
                              )}
                           >
                              {this.props.pedido.estado + 'Entregado'}
                           </Text>
                        </View>
                     </View>
                     <View style={styles.contenedorPares}>
                        <Text style={styles.texto}>Total:</Text>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              20,
                              'bold'
                           )}
                        >
                           {this.props.pedido.total}
                        </Text>
                     </View>
                  </View>
               </View>
            </View>
         </TouchableHighlight>
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
      marginTop: 5,
      borderTopStartRadius: 30,
      borderBottomStartRadius: 30,
   },

   contenido: {
      paddingVertical: 10,
      flex: 1,
      paddingHorizontal: 10,
      flexDirection: 'row',
   },

   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 14,
   },
   texto: {
      fontSize: 13,
   },
   contenidoDetalle: {
      paddingVertical: 10,
      justifyContent: 'center',
      paddingHorizontal: 10,
   },
   contenedorPares: { marginTop: 15 },
   estiloEstado: {
      backgroundColor: colores.colorOscuroPrimarioTomate,
      width: 100,
      height: 25,
      borderRadius: 5,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
   },
});
