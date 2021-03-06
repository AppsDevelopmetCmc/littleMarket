import React, { Component } from 'react';
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Alert,
   Modal,
   TouchableOpacity,
   StatusBar,
} from 'react-native';
import * as serviciosItem from '../../servicios/ServiciosItem';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Badge, withBadge } from 'react-native-elements';

import { ServiciosItem } from '../../servicios/ServiciosItem';
import { BotonConfirmar } from '../productos/BotonConfirmar';

// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import { ServicioMonederos } from '../../servicios/ServicioMonederos';
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
import { TouchableHighlight } from 'react-native-gesture-handler';
import { ServicioNotificaciones } from '../../servicios/ServicioNotificaciones';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import { Bienvenida } from '../combos/Bienvenida';
import { ItemProductoNuevo } from '../productos/ItemProductoNuevo';
import { NotificacionesPush } from '../notificacionesPush/NotificacionesPush';

export class TabProductos1 extends Component {
   constructor(props) {
      super(props);
      this.montado = false;
      this.state = {
         listaProductos: [],
         mostrarInstrucciones: true,
         pedidoCalifica: {},
         estadocalifica: false,
      };
      console.log('CONSTRUCTOR DE TAB 1');
      global.pintarTab1 = this.pintarLista;
      global.items = null;
      global.productos = null;
   }

   pintarLista = () => {
      if (global.productos && this.montado) {
         console.log('PINTANDO LISTA DE FRUTAS');
         this.setState({ listaProductos: global.productos.get('F') });
      }
   };
   componentDidMount() {
      this.montado = true;
      console.log('--ListaProductos recuperarItems TABS 2');
      serviciosItem.recuperarItems();
      let notifPush = new NotificacionesPush();
      notifPush.registerForPushNotificationsAsync();
   }
   componentWillUnmount() {
      this.montado = false;
      console.log('--MUERE EL TAB 1');
      if (global.productos) {
         global.productos.clear();
         global.productos = null;
      }
   }
   cerrarBienvenida = () => {
      this.setState({ mostrarInstrucciones: false });
   };

   cambioVisibleCalifica = visible => {
      this.setState({ estadocalifica: visible });
   };

   seteoPedidoCalifica = pedido => {
      this.setState({ pedidoCalifica: pedido });
   };
   seteoEstadoCalifica = valor => {
      this.setState({ estadocalifica: valor });
   };
   render() {
      console.log('--ListaProductos render');
      return (
         <SafeAreaProvider style={styles.container}>
            <View style={styles.pie}>
               <View style={styles.lista}>
                  <FlatList
                     data={this.state.listaProductos}
                     renderItem={({ item }) => {
                        return (
                           <ItemProductoNuevo
                              nav={this.props.navigation}
                              producto={item}
                           />
                        );
                     }}
                     keyExtractor={producto => {
                        return producto.id;
                     }}
                     // ItemSeparatorComponent={this.flatListItemSeparator}
                  />
               </View>
            </View>
            <View
               style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  paddingRight: 12,
                  flexDirection: 'row',
                  borderTopColor: colores.colorPrimarioTomate,
                  borderTopWidth: 1,
               }}
            >
               <BotonConfirmar
                  navigation={this.props.navigation}
               ></BotonConfirmar>
            </View>
            <Modal
               //animationType="slide"
               transparent={true}
               visible={this.state.mostrarInstrucciones}
            >
               <Bienvenida
                  cerrar={this.cerrarBienvenida}
                  pedidoCalifica={this.seteoPedidoCalifica}
                  estadocalifica={this.seteoEstadoCalifica}
               ></Bienvenida>
            </Modal>
            <PopupCalificaciones
               isVisible={this.state.estadocalifica}
               pedido={this.state.pedidoCalifica}
               cambioVisibleCalifica={this.cambioVisibleCalifica}
            ></PopupCalificaciones>
         </SafeAreaProvider>
      );
   }
}
const styles = StyleSheet.create({
   boton: {
      paddingVertical: 5,
      marginRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
   },
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
      /* alignItems: 'stretch',
         justifyContent: 'center',*/
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
      marginBottom: 10,
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
      //borderTopStartRadius: 20,
      // borderTopEndRadius: 20,
      marginTop: 10,
      paddingTop: 10,
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
   cabeceraContenedor: {
      flexDirection: 'row',
      // height: 50,
      marginRight: 20,
      marginLeft: 10,
   },
   cabeceraBoton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   cabeceraTitulo: {
      flex: 5,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginHorizontal: 10,
      //backgroundColor: 'red',
   },
   titulo: {
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
   },
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
