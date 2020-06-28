import React, { Component } from 'react';
import {
   View,
   Text,
   StyleSheet,
   Image,
   Alert,
   TouchableOpacity,
   Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../constants/Colores';
import { Badge } from 'react-native-elements';
import * as servPedidos from '../../servicios/ServicioPedidos';
import { SeleccionarYapa } from '../carroCompras/SeleccionarYappa';
export class BotonConfirmar extends Component {
   constructor(props) {
      super(props);
      this.yapas = [];
      this.tramaYapa = [];

      this.state = {
         subtotal: 0,
         mostrarModalYapa: false,
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

   componentDidMount() {
      this.todasYapas();
   }

   todasYapas = async () => {
      global.db
         .collection('yapas')
         .get()
         .then(querySnapshot => {
            let documentos = querySnapshot.docs;
            let yapa = null;

            for (let i = 0; i < documentos.length; i++) {
               yapa = documentos[i].data();
               yapa.id = documentos[i].id;
               this.yapas.push(yapa);
            }
            console.log('TODAS YAPAS' + this.yapas);
         })
         .catch(error => {
            response.send('Errorcito' + error);
         });
   };

   mostrarModalYapa = async bandera => {
      this.tramaYapa = [];
      console.log('Ingesar a Mostrar Modal');
      console.log('SUBTOTAL' + this.state.subtotal.toFixed(2));
      if (
         this.state.subtotal.toFixed(2) >= 10 &&
         this.state.subtotal.toFixed(2) < 20
      ) {
         console.log('ENTRE 10 Y 20');
         for (var i = 0; i < this.yapas.length; i++) {
            if (this.yapas[i].tipo == 1) {
               this.tramaYapa.push(this.yapas[i]);
            }
         }
      }

      if (this.state.subtotal.toFixed(2) >= 20) {
         console.log('MAS DE 20');
         for (var i = 0; i < this.yapas.length; i++) {
            if (this.yapas[i].tipo == 2) {
               this.tramaYapa.push(this.yapas[i]);
            }
         }
      }
      this.setState({ mostrarModalYapa: bandera });
   };
   validarMonto = () => {
      if (
         global.montoYapa >= 10 &&
         global.montoYapa < 20 &&
         this.state.subtotal.toFixed(2) >= 10 &&
         this.state.subtotal.toFixed(2) < 20
      ) {
         console.log('MISMA YAPA de 10');
      } else if (
         global.montoYapa >= 20 &&
         this.state.subtotal.toFixed(2) >= 20
      ) {
         console.log('MISMA YAPA de 20');
      } else {
         global.yapa = undefined;
      }
      if (this.state.subtotal.toFixed(2) < 10) {
         Alert.alert('Información', 'Monto mínimo de compra $10.00');
         return;
      } else if (this.state.subtotal.toFixed(2) >= 10 && !global.yapa) {
         global.montoYapa = this.state.subtotal.toFixed(2);
         this.mostrarModalYapa(true);
         return;
      } else if (global.yapa) {
         this.props.navigation.navigate('ConfirmarCompraScreen');
         return;
      }
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
                  
                                   //yappa
                  this.validarMonto();               }}
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
            <Modal
               animationType="slide"
               transparent={true}
               visible={this.state.mostrarModalYapa}
            >
               <SeleccionarYapa
                  mostrarModal={this.mostrarModalYapa}
                  listaYapa={this.tramaYapa}
                  navigation={this.props.navigation}
               ></SeleccionarYapa>
            </Modal>
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
