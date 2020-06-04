import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import { ItemCombo } from '../combos/componentes/ItemCombo';
import { ServicioCombos } from '../../servicios/ServicioCombos';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import {
   recuperarPrincipal,
   ServicioDirecciones,
} from '../../servicios/ServicioDirecciones';
import * as serviciosCarrito from '../../servicios/ServicioCarroCompras';
//Importando los colores
import * as colores from '../../constants/Colores';
import { ItemDireccionSeleccion } from '../map/compnentes/ItemDireccionSeleccion';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

import * as Permisos from 'expo-permissions';
import { Notificaciones } from 'expo';

import { PopupCalificaciones } from '../calificacion/PopupCalificaciones';
import { SeleccionarDireccion } from '../direcciones/SeleccionarDireccion';
import Separador from '../../components/Separador';
import { ServicioMonederos } from '../../servicios/ServicioMonederos'
/*const getToken= async()=>{
   const{status}= await Permisos.getAsync(Permisos.NOTIFICATIONS);
   if(status !== "granted"){
      return;
   }
   const token = await Notificaciones.getExpoPushTokenAsync();
   console.log(token);
   return token;

}*/

export class ListCombo extends Component {
   constructor(props) {
      super(props);
      let items = [];
      let direcciones = [];
      if (this.props.route.params != null) {
         this.notienecobertura = this.props.route.params.notienecobertura;
      }
      this.state = {
         listItems: items,
         listaDireccionesCobertura: direcciones,
         mostrarModalDirecciones: false,
         direccionPedido: null,
         pedidoCalifica: {},
         estadocalifica: false,
         valorMonedero: 0,
      };
      let srvCombos = new ServicioCombos();
      srvCombos.recuperarItems(this.repintarLista);
      global.repintarDireccion = this.repintarDireccionPrincipal;
      global.repintarSeleccionProductos = this.repintarSeleccionProductos;
   }
   repintarDireccionPrincipal = () => {
      if (global.direccionPedido) {
         this.setState({ direccionPedido: global.direccionPedido.descripcion });
      }
   };
   cambioVisibleCalifica = visible => {
      this.setState({ estadocalifica: visible });
   };
   repintarSeleccionProductos = () => {
      console.log('*********repintar seleccion', global.items); //los productos del carrito
      console.log('*********repintar seleccion ELEGIR', global.productos);
      if (global.productos) {
         for (let i = 0; i < global.productos.length; i++) {
            global.productos[i].checked = false;
            console.log('***********IDS Elegidos: ' + global.productos[i].id);
            if (global.items) {
               for (let j = 0; j < global.items.length; j++) {
                  console.log(
                     '***********IDS itemsElegir: ' + global.items[j].id
                  );
                  if (global.productos[i].id == global.items[j].id) {
                     console.log(
                        '*********coincide>>>>>>>>>',
                        global.productos[i]
                     );
                     global.productos[i].checked = true;
                  }
               }
            }
         }
      }
      //this.setState({ listItems: null });
      this.setState({ listItems: global.productos });
      //}
   };

   componentDidMount() {
      //  this.obtenerPedidoCalifica(global.usuario);

      this.obtenerCoordenadas();
      //  this.notienecobertura=this.props.route.params.notienecobertura1
      if (this.notienecobertura == 'N') {
         Alert.alert('No existe Cobertura para la Direccion ');
      }
      new ServicioDirecciones().recuperarPrincipal(
         global.usuario,
         this.refrescarDireccion
      );
      // getToken();
      //global.repintarSeleccionProductos = this.repintarSeleccionProductos;
      serviciosCarrito.registrarEscucha(
         global.usuario,
         this.repintarSeleccionProductos
      );

      this._unsubscribe = this.props.navigation.addListener('focus', () => {
         console.log('FOCUS LISTA COMBOS');
         this.repintarSeleccionProductos();
      });

let srvMonederos = new ServicioMonederos();
      srvMonederos.registarEscuchaMonedero(global.usuario, this.repintarMonedero);
   }

   repintarMonedero = monedero => {
      console.log("mondero", monedero)
      if (monedero) {
         this.setState({ valorMonedero: monedero.valor })
      }
      else {
         this.setState({ valorMonedero: 0 })
      }
   };
   repintarLista = combos => {
      this.setState({
         listCombos: combos,
      });
   };

   obtenerCoordenadas = async () => {
      Geocoder.init(APIKEY);
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
         setErrorMsg('Error al otorgar el permiso');
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('actual location:', location);
      this.localizacionActual = location;
   };

   repintarLista = items => {
      global.productos = items;
      repintarSeleccionProductos();
      /* this.setState({
         listItems: global.productos,
      });*/
   };

   obtenerPedidoCalifica = async mail => {
      console.log('mail', mail);
      console.log('Ingreso a recuperar el pedido');

      await global.db
         .collection('pedidos')
         .where('mail', '==', mail)
         .where('estado', '==', 'PE')
         .get()
         .then(querySnapshot => {
            let pedido = {};
            querySnapshot.forEach(doc => {
               console.log('doc', doc);
               if (doc.exists) {
                  pedido = doc.data();
                  pedido.id = doc.id;
                  this.setState({
                     pedidoCalifica: pedido,
                     estadocalifica: true,
                  });
               }
            });
         })
         .catch(error => {
            console.log(error);
         });
   };

   abrirDrawer = () => {
      this.props.navigation.openDrawer();
   };

   abrirCarrito = () => {
      this.props.navigation.navigate('CarroComprasScreen');
   };

   abrirMonedero = () => {
      //mostrar el valor
      //this.props.navigation.navigate('CarroComprasScreen');
   };

   abrirNotificacion = () => {
      this.props.navigation.navigate('NotificacionScreen');
   };

   repintarDireccion = direcciones => {
      this.setState({
         listaDireccionesCobertura: direcciones,
         mostrarModalDirecciones: true,
      });
   };

   seleccionarDireccion = direccion => {
      if (direccion.tieneCoberturaDireccion == 'S') {
         global.direccionPedido = direccion;
         this.refrescarDireccion();
      } else {
         Alert.alert('La Dirección Seleccionada no tiene Cobertura');
      }
      this.setState({ mostrarModalDirecciones: false });
   };

   refrescarDireccion = () => {
      this.setState({
         direccionPedido: global.direccionPedido.descripcion,
      });
   };

   mostrarModal = bandera => {
      this.setState({ mostrarModalDirecciones: bandera });
   };
   render() {
      console.log('invoca a render');
      return (
         <SafeAreaView style={styles.container}>
            <CabeceraPersonalizada
               titulo={'Yappando'}
               iconoComponente={
                  <Icon
                     name="menu"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirDrawer}
                  />
               }
               monedero={this.state.valorMonedero}
               iconoMonedero={
                  <Icon
                     name="coin"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     openDrawer={this.abrirMonedero}
                     //onPress={this.abrirMonedero}
                     underlayColor={colores.colorPrimarioVerde}
                  />
               }
               iconoNotificacion={
                  <Icon
                     name="bell-circle-outline"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirNotificacion}
                     underlayColor={colores.colorPrimarioVerde}
                  />
               }
               iconoDeTienda={
                  <Icon
                     name="cart"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirCarrito}
                     underlayColor={colores.colorPrimarioVerde}
                  />
               }
            ></CabeceraPersonalizada>

            {this.state.direccionPedido ? (
               <View style={{ paddingVertical: 10 }}>
                  <Text style={{ marginLeft: 20, color: 'gray' }}>
                     Dirección de Entrega
                  </Text>
                  <Separador alto={5} />
                  <View style={styles.contenedorDireccione}>
                     <View style={{ flex: 1 }}>
                        <Icon
                           name="map-marker"
                           size={20}
                           color="black"
                           style={styles.iconos}
                        />
                     </View>
                     <View style={{ flex: 10 }}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              11,
                              'normal'
                           )}
                        >
                           {this.state.direccionPedido}
                        </Text>
                     </View>
                     <View style={{ flex: 2 }}>
                        <Button
                           onPress={() => {
                              this.setState({ mostrarModalDirecciones: true });
                           }}
                           buttonStyle={{
                              backgroundColor: 'rgba(255,255,255,0)',
                           }}
                           icon={
                              <Icon
                                 name="pencil"
                                 size={20}
                                 color={colores.colorPrimarioTomate}
                                 style={styles.iconos}
                              />
                           }
                        ></Button>
                     </View>
                  </View>
               </View>
            ) : (
               <View>
                  <Text style={{ marginLeft: 20, color: 'gray' }}>
                     Dirección de Entrega
                  </Text>
                  <View style={styles.contenedorDireccione}>
                     <Text></Text>
                  </View>
               </View>
            )}

            <Modal
               animationType="slide"
               transparent={true}
               visible={this.state.mostrarModalDirecciones}
            >
               <SeleccionarDireccion
                  mostrarModal={this.mostrarModal}
                  fnSeleccionar={this.seleccionarDireccion}
                  navigation={this.props.navigation}
               />
            </Modal>

            <View style={styles.pie}>
               <View style={styles.lista}>
                  <FlatList
                     data={this.state.listItems}
                     renderItem={({ item }) => {
                        return (
                           <ItemCombo
                              nav={this.props.navigation}
                              combo={item}
                           />
                        );
                     }}
                     keyExtractor={item => {
                        return item.id;
                     }}
                  />
               </View>
            </View>
            <PopupCalificaciones
               text="Iniciando Sesión con Facebook"
               isVisible={this.state.estadocalifica}
               pedido={this.state.pedidoCalifica}
               cambioVisibleCalifica={this.cambioVisibleCalifica}
            ></PopupCalificaciones>
         </SafeAreaView>
      );
   }
}
const flatListItemSeparator = () => {
   return (
      <View
         style={{
            width: '100%',

            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
         }}
      >
         <View
            style={{
               height: 0.5,
               width: '100%',
               backgroundColor: colores.colorOscuroTexto,
               alignItems: 'center',
               justifyContent: 'center',
               alignContent: 'center',
            }}
         ></View>
      </View>
   );
};

const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      marginTop: 10,
   },
   modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
   },
   fondo: {
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 0,
      width: 200,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
   },
   cabecera: {
      flex: 1,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },
   lista: {
      flex: 15,
   },
   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },

   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
   },
   contenedorDireccione: {
      marginHorizontal: 20,
      backgroundColor: colores.colorBlanco,
      height: 40,
      borderRadius: 20,
      //justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 3,
      flexDirection: 'row',
      // backgroundColor: 'red',
   },
   pie: {
      flex: 3,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      paddingLeft: 10,
      marginTop: 15,
      paddingTop: 20,
   },
   texto: {
      fontSize: 13,
      fontWeight: 'bold',
   },
   estiloContenedorTitulo: {
      paddingBottom: 10,
   },
   contenedorTituloSubr: {
      borderBottomColor: colores.colorOscuroTexto,
      borderBottomWidth: 1,
   },
   estiloBotonBlanco: {
      backgroundColor: colores.colorPrimarioAmarillo,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   estiloBotonVerde: {
      backgroundColor: colores.colorPrimarioVerde,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   estiloContenedor: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   iconos: { marginRight: 0 },
});
