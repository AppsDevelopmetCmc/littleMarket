import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import * as colores from '../../../constants/Colores';
import Separador from '../../../components/Separador';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { transformDinero } from '../../../utils/Validaciones';

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
               <Text style={styles.textoNegrita}>
                  {'Orden:' + this.props.pedido.orden}
               </Text>
               <Text style={styles.textoNegrita}>
                  {this.props.pedido.fechaPedido +
                     ' | ' +
                     this.props.pedido.horaCreacion}
               </Text>
               <View style={styles.contenido}>
                  <View>
                     <View style={styles.contenedorPares}>
                        <Text style={styles.texto}>Fecha de Entrega</Text>
                        <Text style={styles.textoNegrita}>
                           {this.props.pedido.fechaEntrega}
                        </Text>
                     </View>
                     <View style={styles.contenedorPares}>
                        <Text style={styles.texto}>Forma de Pago</Text>
                        <Text style={styles.textoNegrita}>
                           {this.props.pedido.formaPago}
                        </Text>
                     </View>
                  </View>
                  <Separador alto={40}></Separador>
                  <View>
                     <View style={styles.contenedorPares}>
                        <Text style={styles.texto}>Estado</Text>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           {this.props.pedido.estado}
                        </Text>
                     </View>
                     <View style={styles.contenedorPares}>
                        <Text style={styles.texto}>Total:</Text>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           {transformDinero(this.props.pedido.total)}
                        </Text>
                     </View>
                  </View>
                  <View style={styles.estiloFlecha}>
                     <Icon
                        name="arrow-right-bold-circle"
                        size={28}
                        color="white"
                     />
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
      backgroundColor: colores.colorPrimarioAmarillo,
      marginTop: 5,
      borderTopStartRadius: 30,
      borderBottomStartRadius: 30,
      paddingHorizontal: 25,
      paddingVertical: 20,
   },

   contenido: {
      flexDirection: 'row',
   },

   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 14,
   },
   texto: {
      fontSize: 13,
   },

   contenedorPares: { marginTop: 15, height: 40 },
   estiloEstado: {
      backgroundColor: colores.colorOscuroPrimarioTomate,
      width: 100,
      height: 15,
      borderRadius: 5,
   },
   estiloFlecha: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      alignContent: 'flex-end',
   },
});
