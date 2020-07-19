import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   FlatList,
   TouchableHighlightBase,
   Alert,
} from 'react-native';
import { Text, Icon, Button } from 'react-native-elements';
import {
   ServicioPedidos,
   cancelarPedido,
} from '../../servicios/ServicioPedidos';
import { ItemDetallePedido } from './componentes/ItemDetallePedido';
import { SafeAreaView } from 'react-native-safe-area-context';

//Importacion de los colores
import * as colores from '../../constants/Colores';
import {
   agregarDisminuirItemCarro,
   ServicioCarroCompras,
} from '../../servicios/ServicioCarroCompras';
import Separador from '../../components/Separador';
import { ESTADOS } from '../../constants/Estados';
import { ArregloUtil } from '../../utils/utils';
import { callNumber } from '../../utils/Contacto';
import { ServicioParametros } from '../../servicios/ServicioParametros';

export class DetallePedido extends Component {
   constructor(props) {
      super(props);
      this.pedido = this.props.route.params.pedido;
      let detallePedido = [];
      this.state = {
         cantidad: '0',
         listDetallePedido: detallePedido,
         estado: this.pedido.estado,
         indice: null,
         limiteCancela: true
      };

      let serv = new ServicioParametros();
      serv.getObtenerParametroId('fechaCorte', this.limiteFecha);
   }

   componentDidMount() {
      const indiceEstado = this.buscarIndice(
         ESTADOS.PEDIDOS,
         this.state.estado
      );
      let estadoFinal =
         indiceEstado < 0
            ? this.state.estado
            : ESTADOS.PEDIDOS[indiceEstado].descripcion;
      this.setState({
         estado: estadoFinal,
      });

      let srvDetallePedido = new ServicioPedidos();
      let detallePedido = [];
      srvDetallePedido.recuperarDetallePedido(
         detallePedido,
         this.repintarLista,
         this.pedido
      );
   }

   buscarIndice(array, id) {
      let arregloUtil = new ArregloUtil(array);
      let indice = arregloUtil.buscar({ id: id });
      return indice;
   }

   repintarLista = detallePedido => {
      this.setState({
         listDetallePedido: detallePedido,
      });
   };

   repetir = () => {
      new ServicioCarroCompras().eliminarCarro(global.usuario);
      for (let i = 0; i < this.state.listDetallePedido.length; i++) {
         agregarDisminuirItemCarro(
            this.state.listDetallePedido[i],
            global.usuario,
            0
         );
      }
   };

   repintarCancelado = () => {
      this.setState({ estado: 'Cancelado' });
   };

   limiteFecha = (fechaCorte) => {
      console.log("ENTRA LIMITE FECHA");
      var fechaHoy = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      var fechaLimite = new Date(fechaCorte.fecha.toString().replace(/-/g, "."));
      console.log("fecha hoy" + fechaHoy);
      console.log("fecha Limite" + fechaLimite);
      if (fechaHoy.getTime() > fechaLimite.getTime()) {
         //this.limiteCancela = false;
         this.setState({ limiteCancela: false });
         console.log("PUEDE CANCELAR" + this.state.limiteCancela);
      }
   }
   cancelarPedido = idDoc => {
      Alert.alert(
         'Cancelar Pedido',
         '¿Está seguro que desea Cancelar el pedido en curso?',
         [
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               //TO DO: Se debe cerrar el drawer?
               style: 'cancel',
            },
            {
               text: 'OK',
               onPress: () => {
                  global.db
                     .collection('pedidos')
                     .doc(idDoc)
                     .update({ estado: 'CA' })
                     .then(this.repintarCancelado());
               },
            },
         ],
         { cancelable: false }
      );
   };
   flatListItemSeparator = () => {
      return (
         <View
            style={{
               width: '100%',
               marginVertical: 5,
               alignItems: 'center',
               justifyContent: 'center',
               alignContent: 'center',
            }}
         >
            <View
               style={{
                  height: 1,
                  width: '85%',
                  backgroundColor: colores.colorOscuroPrimarioAmarillo,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
               }}
            ></View>
         </View>
      );
   };

   render() {
      console.log("boolean permite" + this.state.limiteCancela)
      this.pedido = this.state.indice
         ? global.pedidos[this.state.indice]
         : this.pedido;
      const { navigation } = this.props;
      return (
         <View style={styles.container}>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 20, 'bold')}>
                  Detalle de Pedido
               </Text>
            </View>
            <View style={styles.pie}>
               <View style={styles.contenedorLista}>
                  <View style={styles.cabeceraContenedorLista}>
                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Orden:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.pedido.orden}
                        </Text>
                     </View>

                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Dirección:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={[
                              textEstilo(
                                 colores.colorOscuroTexto,
                                 14,
                                 'normal'
                              ),
                              { flex: 2 },
                           ]}
                        >
                           <Text>{this.pedido.direccion}</Text>
                        </Text>
                     </View>

                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Fecha de entrega:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.pedido.fechaEntrega}
                        </Text>
                     </View>
                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Hora de entrega:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.pedido.horarioEntrega}
                        </Text>
                     </View>
                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Estado:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.state.estado}
                        </Text>
                     </View>
                     {(this.pedido.estado === 'AA' ||
                        this.pedido.estado === 'IE' ||
                        this.pedido.estado === 'PE') && (
                        <View>
                           <View style={styles.textoPares}>
                              <Text
                                 style={textEstilo(
                                    colores.colorOscuroTexto,
                                    14,
                                    'bold'
                                 )}
                              >
                                 Repartidor:
                              </Text>
                              <Separador alto={10}></Separador>
                              <Text
                                 style={textEstilo(
                                    colores.colorOscuroTexto,
                                    14,
                                    'normal'
                                 )}
                              >
                                 {this.pedido.nombreAsociado}
                              </Text>
                           </View>

                           <View style={styles.textoPares}>
                              <Text
                                 style={textEstilo(
                                    colores.colorOscuroTexto,
                                    14,
                                    'bold'
                                 )}
                              >
                                 Teléfono Repartidor:
                              </Text>
                              <Separador alto={10}></Separador>
                              <Text
                                 style={textEstilo(
                                    colores.colorOscuroTexto,
                                    14,
                                    'normal'
                                 )}
                              >
                                 {this.pedido.telefonoAsociado}
                              </Text>
                              <Icon
                                 name="phone-outgoing"
                                 type="material-community"
                                 color={colores.colorNegro}
                                 size={28}
                                 onPress={() => {
                                    callNumber(this.pedido.telefonoAsociado);
                                 }}
                              />
                           </View>
                        </View>
                     )}
                  </View>

                  <View
                     style={{
                        //paddingLeft: 20,
                        borderColor: colores.colorOscuroPrimarioAmarillo,
                        borderRadius: 2,
                        marginHorizontal: 20,
                        paddingBottom: 10,
                        backgroundColor: colores.colorBlanco,
                        shadowColor: colores.colorBlanco,
                        shadowOffset: {
                           width: 0,
                           height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        elevation: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                     }}
                  >
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 15, 'bold')}
                     >
                        YAPA
                     </Text>
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 15, 'bold')}
                     >
                        {this.pedido.yapa == 'D'
                           ? 'Donado a la Fundación Aliñambi'
                           : this.pedido.yapa}
                     </Text>
                  </View>
                  <View
                     style={{
                        borderBottomWidth: 1,
                        marginVertical: 20,
                        borderColor: colores.colorOscuroPrimarioAmarillo,
                     }}
                  ></View>
                  <View style={{ flex: 1, paddingBottom: 10 }}>
                     <FlatList
                        data={this.state.listDetallePedido}
                        renderItem={objeto => {
                           return (
                              <ItemDetallePedido
                                 detallePedido={objeto.item}
                                 nav={this.props.navigation}
                              />
                           );
                        }}
                        keyExtractor={objeto => {
                           return objeto.id;
                        }}
                        ItemSeparatorComponent={this.flatListItemSeparator}
                     />
                  </View>
               </View>
            </View>
            {false &&
            (this.pedido.estado == 'PC' ||
               this.pedido.estado == 'CA' ||
               this.state.estado == 'Cancelado') ? (
               <View
                  style={{
                     alignItems: 'center',
                     backgroundColor: colores.colorBlanco,
                  }}
               >
                  <Button
                     title="Repetir"
                     buttonStyle={{
                        backgroundColor: colores.colorPrimarioTomate,
                     }}
                     onPress={() => {
                        this.repetir();
                        navigation.navigate('CarroComprasScreen');
                     }}
                  ></Button>
               </View>
            ) : null}

            {
               ((((this.pedido.estado == 'PI' || this.pedido.estado == 'AA') &&
               this.pedido.formaPago == 'EFECTIVO') ||
               (this.pedido.formaPago == 'TRANSFERENCIA' &&
                  this.pedido.estado == 'CT')) &&
                  this.state.estado != 'Cancelado') ? (

               <View
                  style={{
                     alignItems: 'center',
                     backgroundColor: colores.colorBlanco,
                     paddingBottom: 20,
                  }}
               >
                  <Button
                           disabled={!this.state.limiteCancela}
                     buttonStyle={{
                        backgroundColor: colores.colorPrimarioTomate,
                     }}
                     title="Cancelar Pedido"
                     onPress={() => {
                        this.cancelarPedido(this.pedido.id);
                     }}
                  ></Button>
                        {
                           !this.state.limiteCancela ? (<Text>Cancelación deshabilitada, tu pedido ya fue procesado.</Text>) : null
                        }

               </View>
            ) : null}
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
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
      paddingHorizontal: 20,
      marginTop: 15,
   },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 30,
   },
   contenedorLista: {
      flex: 1,
      backgroundColor: colores.colorBlanco,
      marginTop: 20,
      marginBottom: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colores.colorPrimarioAmarillo,
   },
   cabeceraContenedorLista: {
      backgroundColor: colores.colorPrimarioAmarilloRgba,

      borderTopStartRadius: 5,
      borderTopEndRadius: 5,
      paddingVertical: 15,
      alignContent: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      paddingLeft: 20,
   },
   textoPares: { flexDirection: 'row' },
});
