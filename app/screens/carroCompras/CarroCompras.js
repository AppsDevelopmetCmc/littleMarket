import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Numero } from './componentes/Numero';
import {
   registrarEscucha,
   ServicioCarroCompras,
} from '../../servicios/ServicioCarroCompras';
import { ItemCarro } from '../../screens/carroCompras/componentes/ItemCarro';
import { StackActions } from '@react-navigation/native';
import * as colores from '../../constants/Colores';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SeleccionarYapa } from '../carroCompras/SeleccionarYappa';
// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import {
   recuperarPrincipal,
   ServicioDirecciones,
} from '../../servicios/ServicioDirecciones';
import Separador from '../../components/Separador';
import { transformDinero } from '../../utils/Validaciones';
import { convertir } from '../../utils/ConvertidorUnidades';
import { ServicioYapas } from '../../servicios/ServicioYapas'

export class CarroCompras extends Component {
   constructor(props) {
      super(props);
      this.pintarBoton = false;
      this.tramaYapa = [];
      this.state = {
         listItems: [],
         subtotal: '0',
         delivery: '1.5',
         total: '0',
         pintarYapa: true,
         mostrarModalYapa: false,
      };
      this.montado = false;
   }

   componentDidMount() {
      this.montado = true;
      registrarEscucha(global.usuario, this.repintarLista);
      this.repintarLista();
   }

   repintarLista = () => {
      if (this.montado) {
         let subtotal = 0;
         let delivery = 1.5;
         for (let i = 0; i < global.items.length; i++) {
            subtotal += Number(global.items[i].subtotal);
         }
         global.total = subtotal + delivery;
         this.setState({
            listItems: global.items,
            subtotal: subtotal,
            total: subtotal + delivery,
         });
      }
   };

   repintarYapa = () => {
      this.setState({ pintarYapa: true });
   };
   eliminarCarro = mail => {
      let srvItemsCarro = new ServicioCarroCompras();
      srvItemsCarro.eliminarCarro(mail);
   };

   eliminarItemCarro = (item, mail) => {
      let srvItemsCarro = new ServicioCarroCompras();
      srvItemsCarro.eliminarItemCarro(item, mail);
   };
   textEstilo = (color, tamaño, tipo) => {
      return {
         color: color,
         fontSize: tamaño,
         fontWeight: tipo,
      };
   };
   abrirMonedero = () => {
      //mostrar el valor
      //this.props.navigation.navigate('CarroComprasScreen');
   };

   abrirNotificacion = () => {
      this.props.navigation.navigate('NotificacionScreen');
   };
   render() {
      let items = [];
      if (global.items) {
         items = global.items;
      }
      return (
         <SafeAreaView style={styles.contenedorPagina}>
            <View style={styles.cabecera}>
               <View style={styles.tituloCabecera}>
                  <Text
                     style={this.textEstilo(
                        colores.colorBlancoTexto,
                        22,
                        'bold'
                     )}
                  >
                     Tu carrito de compra
                  </Text>
               </View>

               <View style={styles.contenedorBoton}>
                  <Button
                     title="Seguir 
                     comprando"
                     onPress={() => {
                        this.props.navigation.dispatch(StackActions.popToTop());
                     }}
                     titleStyle={this.textEstilo(
                        colores.colorBlancoTexto,
                        12,
                        'normal'
                     )}
                     buttonStyle={styles.estiloBotonS}
                     icon={
                        <Icon
                           name="arrow-left-bold-circle"
                           size={20}
                           color="white"
                           style={styles.iconoIzquierda}
                        />
                     }
                  />

                  {items.length > 0 ? (
                     <Button
                        title="Vaciar"
                        onPress={() => {
                           this.eliminarCarro(global.usuario);
                        }}
                        titleStyle={this.textEstilo(
                           colores.colorBlancoTexto,
                           12,
                           'normal'
                        )}
                        buttonStyle={styles.estiloBotonVaciar}
                        icon={
                           <Icon
                              name="cart-remove"
                              size={20}
                              color="white"
                              style={styles.iconoIzquierda}
                           />
                        }
                     />
                  ) : (
                        <Text></Text>
                     )}
               </View>
            </View>

            <View style={styles.pie}>
               {/* Se cambia la forma de presentar el texto en el carrito */}
               {items.length === 0 && (
                  <View
                     style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                     }}
                  >
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 15, 'bold')}
                     >
                        No tiene productos agregados al carrito
                     </Text>
                     <Separador alto={10} />
                     <Text
                        style={textEstilo(
                           colores.colorOscuroTexto,
                           15,
                           'normal'
                        )}
                     >
                        Por favor siga comprando
                     </Text>
                  </View>
               )}

               {global.yapa ? (
                  global.yapa.tipo == 'D' ? (
                     <View style={styles.contenedorYapa}>
                        <View style={styles.tituloContenedorYapa}>
                           <View style={{ flexDirection: 'row' }}>
                              <View
                                 style={{ flex: 7, alignItems: 'flex-start' }}
                              >
                                 <Text style={{ fontWeight: 'bold' }}>
                                    YAPA
                                 </Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                 <Icon
                                    name="delete"
                                    size={20}
                                    color={colores.colorBlanco}
                                    style={styles.iconoStilos}
                                    onPress={() => {
                                       global.yapa = undefined;
                                       this.repintarYapa();
                                    }}
                                 />
                              </View>
                           </View>
                        </View>
                        <View
                           style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              marginLeft: 20,
                           }}
                        >
                           <Text>
                              Gracias por donar su Yapa a la Fundación Aliñambi
                           </Text>
                        </View>
                     </View>
                  ) : (
                        <View style={styles.contenedorYapa}>
                           <View style={styles.tituloContenedorYapa}>
                              <View style={{ flexDirection: 'row' }}>
                                 <View
                                    style={{ flex: 7, alignItems: 'flex-start' }}
                                 >
                                    <Text style={{ fontWeight: 'bold' }}>
                                       YAPA
                                 </Text>
                                 </View>
                                 <View style={{ flex: 1 }}>
                                    <Icon
                                       name="delete"
                                       size={20}
                                       color={colores.colorBlanco}
                                       style={styles.iconoStilos}
                                       onPress={() => {
                                          global.yapa = undefined;
                                          this.repintarYapa();
                                       }}
                                    />
                                 </View>
                              </View>
                           </View>
                           <View
                              style={{
                                 flex: 1,
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 justifyContent: 'flex-start',
                                 marginLeft: 20,
                              }}
                           >
                              <Text>{global.yapa.descripcion}</Text>
                           </View>
                        </View>
                     )
               ) : this.state.subtotal > 10 ? (
                  <View style={{ alignItems: 'center', marginBottom: 10 }}>
                     <Button
                        onPress={() => {
                           this.mostrarModalYapa(true);
                        }}
                        title="Seleccione su Yapa"
                        buttonStyle={{
                           backgroundColor: colores.colorPrimarioTomate,
                        }}
                     ></Button>
                  </View>
               ) : (
                        <View></View>
                     )}
               <View style={styles.contenedorFlatList}>
                  <FlatList
                     data={this.state.listItems}
                     renderItem={objeto => {
                        return (
                           <ItemCarro
                              item={objeto.item}
                              fnEliminarItemCarro={this.eliminarItemCarro}
                           />
                        );
                     }}
                     keyExtractor={objetoCarro => {
                        return objetoCarro.id;
                     }}
                  />
               </View>
            </View>
            {items.length > 0 && (
               <View
                  style={{
                     flexDirection: 'row',
                     borderTopWidth: 1,
                     paddingVertical: 25,
                     borderColor: colores.colorOscuroPrimarioVerde,
                     backgroundColor: colores.colorBlanco,
                  }}
               >
                  <View
                     style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        paddingRight: 12,
                     }}
                  >
                     <Button
                        title="Confirmar"
                        onPress={() => {
                           this.props.navigation.navigate(
                              'ConfirmarCompraScreen'
                           );
                        }}
                        titleStyle={this.textEstilo(
                           colores.colorBlanco,
                           13,
                           'bold'
                        )}
                        buttonStyle={styles.estiloBoton}
                        iconRight
                        icon={
                           <Icon
                              name="arrow-right-bold-circle"
                              size={30}
                              color="white"
                              style={styles.iconoDerecha}
                           />
                        }
                     />
                  </View>
                  <View style={{ flex: 1 }}>
                     <Numero
                        titulo="SUBTOTAL:"
                        valor={transformDinero(this.state.subtotal)}
                     ></Numero>
                     <Numero
                        titulo="ENVÍO:"
                        valor={transformDinero(this.state.delivery)}
                     ></Numero>
                     <Numero
                        titulo="TOTAL:"
                        valor={transformDinero(this.state.total)}
                        estiloNumero={{ fontWeight: 'bold', fontSize: 18 }}
                     ></Numero>
                  </View>
               </View>
            )}
            <Modal
               animationType="slide"
               transparent={true}
               visible={this.state.mostrarModalYapa}
            >
               <SeleccionarYapa
                  mostrarModal={this.mostrarModalYapa}
                  listaYapa={this.tramaYapa}
               ></SeleccionarYapa>
            </Modal>
         </SafeAreaView>
      );
   }
   mostrarModalYapa = async bandera => {
      ///llamada al servicio de yapas
      console.log("Ingesar a Mostrar Modal")
      let srvYapas = new ServicioYapas();
      this.tramaYapa = await srvYapas.conusultarYapas(this.state.subtotal);

      this.setState({ mostrarModalYapa: bandera });
   };
   componentWillUnmount() {
      this.mondado = false;
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
   contenedorYapa: {
      flex: 2,
      backgroundColor: colores.colorPrimarioAmarilloRgba,
      //marginTop: 5,
      borderRadius: 20,
      marginBottom: 10,
      //height: 10,
   },
   tituloContenedorYapa: {
      backgroundColor: colores.colorPrimarioTomate,
      borderTopStartRadius: 20,
      borderTopEndRadius: 20,
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      //   flex: 1,
      //      justifyContent: 'stretch',
   },
   contenedorBoton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 30,
      paddingTop: 30,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 25,
      marginTop: 30,
      paddingTop: 20,
   },
   tituloCabecera: { paddingBottom: 20 },
   estiloBoton: {
      backgroundColor: colores.colorOscuroPrimarioTomate,
      width: 145,
      height: 40,
      borderRadius: 100,
      paddingHorizontal: 15,
   },
   estiloBotonS: {
      backgroundColor: colores.colorOscuroPrimarioVerde,
      width: '90%',
      height: 40,
      borderRadius: 25,
      paddingHorizontal: 15,
   },
   estiloBotonVaciar: {
      backgroundColor: colores.colorOscuroPrimarioVerde,
      width: 100,
      height: 40,
      borderRadius: 25,
      paddingHorizontal: 15,
   },
   iconoDerecha: { paddingLeft: 5 },
   iconoIzquierda: { paddingRight: 5 },
   contenedorFlatList: { paddingBottom: 10, flex: 8 },
});
