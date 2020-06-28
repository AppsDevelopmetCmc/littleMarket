import React, { Component } from 'react';
import {
   View,
   Text,
   StyleSheet,
   Image,
   Alert,
   TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../constants/Colores';
import { Badge } from 'react-native-elements';
import * as servPedidos from '../../servicios/ServicioPedidos';
export class BotonConfirmar extends Component {
   constructor(props) {
      super(props);
      this.state = {
         subtotal: 0,
      };
      if (global.refrescarBotones == null) {
         global.refrescarBotones = [];
      }
      global.refrescarBotones.push(this.refrescarBoton);
   }

   refrescarBoton = valor => {
      this.setState({
         subtotal: valor,
      });
   };
   navegarConfirmarCompra = () => {
      this.props.navigation.navigate('ConfirmarCompraScreen');
   };
   render() {
      console.log('Repinta el botón: ', this.state.subtotal);
      return (
         <View style={{ flex: 1 }}>
            <TouchableOpacity
               onPress={() => {
                  //this.asignarSector();

                  //TEMPORAL
                  if (!global.direccionPedido) {
                     Alert.alert(
                        'aguanta todavía no tengo DIRECCION DEL PEDIDO'
                     );
                  } else {
                     global.yapa = { descripcion: 'PENDIENTE ' };
                     this.navegarConfirmarCompra();
                  }
                  /*global.direccionPedido = {
                     descripcion: 'Cualquier cosa',
                     latitud: 0.0,
                     longitud: 0.0,
                  };*/
               }}
            >
               <View
                  style={{
                     flexDirection: 'row',
                     paddingHorizontal: 10,
                     height: 40,
                     borderRadius: 10,
                     backgroundColor: colores.colorPrimarioTomate,
                  }}
               >
                  <View style={{ flex: 2, alignItems: 'center' }}>
                     <View style={styles.areaBadge}>
                        <View>
                           <Icon
                              color={colores.colorBlanco}
                              type="material"
                              name="cart"
                              size={28}
                           />
                           {global.items && global.items.size > 0 ? (
                              <Badge
                                 value={global.items.size}
                                 containerStyle={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -4,
                                 }}
                                 status="error"
                              />
                           ) : (
                              <View></View>
                           )}
                        </View>
                     </View>
                  </View>
                  <View
                     style={{
                        flex: 7,
                        alignItems: 'center',
                        justifyContent: 'center',
                     }}
                  >
                     <Text
                        style={{
                           fontSize: 16,
                           fontWeight: 'bold',
                           color: colores.colorBlancoTexto,
                        }}
                     >
                        Confirmar
                     </Text>
                  </View>
                  <View
                     style={{
                        flex: 3,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                     }}
                  >
                     <Text
                        style={{
                           fontSize: 16,
                           fontWeight: 'bold',
                           color: colores.colorBlancoTexto,
                        }}
                     >
                        $ {this.state.subtotal.toFixed(2)}
                     </Text>
                  </View>
               </View>
            </TouchableOpacity>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   iconoBadge: {
      //  backgroundColor: 'pink',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flex: 2,
   },
   areaBadge: {
      //  backgroundColor: 'blue',
      //flex: 1,
      paddingTop: 10,
      paddingBottom: 5,
      paddingHorizontal: 5,
   },
});
