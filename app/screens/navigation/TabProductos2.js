import React, { Component } from 'react';
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Alert,
   Modal,
   TouchableOpacity,
} from 'react-native';
import * as serviciosItem from '../../servicios/ServiciosItem';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Badge, withBadge } from 'react-native-elements';

import { ServiciosItem } from '../../servicios/ServiciosItem';

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
import { BotonConfirmar } from '../productos/BotonConfirmar';
import * as srvDirecciones from '../../servicios/ServicioDirecciones';
import { ServicioSectores } from '../../servicios/ServicioSectores';

export class TabProductos2 extends Component {
   constructor(props) {
      super(props);
      this.tramaSectorIni = '';
      this.state = {
         listaProductos: [],
      };
      console.log('CONSTRUCTOR DE TAB 2');
      //TODO: la primera de la lista de categorias
      global.pintarTab2 = this.pintarLista;
   }

   pintarLista = () => {
      if (global.productos) {
         console.log('PINTANDO LISTA DE VERDURAS');
         this.setState({ listaProductos: global.productos.get('V') });
      }
   };
   componentDidMount() {
      console.log('----------ASIGNANDO DIRECCION----------');
      srvDirecciones.asignarDireccionPedido(
         global.usuario,
         this.crearDireccionPedido,
         this.asignarSector
      );
   }
   asignarSector = async (latitud, longitud) => {
      let srvSector = new ServicioSectores();
      console.log('** ASIGNAR SECTOR ** LATITUD INICIAL' + latitud);
      console.log('** ASIGNAR SECTOR ** LONGITUD INICIAL' + longitud);

      this.tramaSectorIni = await srvSector.consultarSector(latitud, longitud);
      this.setState({ sector: this.tramaSectorIni.sector });
      global.sector = this.tramaSectorIni.sector;
      console.log('SECTOR ------->' + this.tramaSectorIni.sector);

      if (!this.tramaSectorIni.sector) {
            Alert.alert(
               'Lo Sentimos',
               'Al momento no tenemos cobertura en tu sector, pronto estaremos contigo.'
            );
      }
   };
   crearDireccionPedido = async () => {
      console.log('---------CREANDO DIRECCION----------');
      Geocoder.init(APIKEY);
      let response = await Location.requestPermissionsAsync();
      if (response.status !== 'granted') {
         console.log('No se otorgaron permisos en el dispositivo');
         global.localizacionActual = {
            latitude: -0.204896,
            longitude: -78.490963,
         };
      } else {
         let actualLocation = await Location.getCurrentPositionAsync({});
         global.localizacionActual = actualLocation.coords;
         console.log('actual location:', global.localizacionActual);
      }
      srvDirecciones.generarDireccion(
         global.localizacionActual.latitude,
         global.localizacionActual.longitude,
         this.guardarPedido
      );
   };

   guardarPedido = async (direccionNombre, latitud, longitud) => {
      console.log('---------GUARDANDO DIRECCION----------');
      await this.asignarSector(latitud, longitud);

      new ServicioDirecciones().crear(global.usuario, {
         descripcion: direccionNombre,
         latitud: latitud,
         longitud: longitud,
         alias: '',
         principal: 'N',
         referencia: '',
         //tieneCoberturaDireccion: this.tramaSectorIni.sector ? 'S' : 'N',
         sector: this.tramaSectorIni.sector ? this.tramaSectorIni.sector : '',
      });
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
