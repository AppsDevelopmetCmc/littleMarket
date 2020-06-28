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

export class TabProductos3 extends Component {
   constructor(props) {
      super(props);
      this.state = {
         listaProductos: [],
      };
      console.log('CONSTRUCTOR DE TAB 3');
      //TODO: la primera de la lista de categorias
      global.pintarTab3 = this.pintarLista;
   }

   pintarLista = () => {
      this.setState({ listaProductos: global.productos.get('O') });
   };
   componentDidMount() {
      console.log('--ListaProductos recuperarItems TAB 3');
   }
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
                  flex: 2,
                  paddingVertical: 20,
                  paddingHorizontal: 20,
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
      marginTop: 15,
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
