import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   TextInput,
   FlatList,
   Text,
   SafeAreaView,
   Dimensions,
} from 'react-native';
import * as colores from '../../constants/Colores';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

import { Selector } from '../../components/Selector';
import RadioForm, {
   RadioButton,
   RadioButtonInput,
   RadioButtonLabel,
} from 'react-native-simple-radio-button';

import { ItemDireccionSeleccion } from '../map/compnentes/ItemDireccionSeleccion';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import { ServicioYapas } from '../../servicios/ServicioYapas';
import { convertir } from '../../utils/ConvertidorUnidades';
import * as servPedidos from '../../servicios/ServicioPedidos';

let { width, height } = Dimensions.get('window');
let anchoModal = parseInt(width * 0.7);
console.log('ANCHO MODAL', anchoModal);
export class SeleccionarYapa extends Component {
   constructor(props) {
      super(props);
      this.listaItemYapa = [];
      this.state = {
         yapaSeleccionada: null,
         mensaje: '',
      };
      this.montado = false;
   }
   seleccionarYapa = seleccionada => {
      if (seleccionada == 'D') {
         global.yapa = {
            id: 'yapa',
            nombre: 'Yappa Donada a Fundación',
            cantidad: 1,
            empacado: false,
            recibido: false,
            precio: 0,
            subtotal: 0,
            unidad: 'D',
            posicionEmpacado: 2000,
         };
      } else {
         console.log('seleccionado', this.props.listaYapa[seleccionada]);
         global.yapa = {
            id: 'yapa',
            nombre: this.props.listaYapa[seleccionada].nombre,
            cantidad: '' + this.props.listaYapa[seleccionada].cantidad,
            empacado: false,
            recibido: false,
            precio: 0,
            subtotal: 0,
            unidad: this.props.listaYapa[seleccionada].unidad,
            posicionEmpacado: 2000,
         };
      }
   };
   componentDidMount = () => {
      this.montado = true;
      /*new ServicioDirecciones().registrarEscuchaDireccion(
         global.usuario,
         this.repintarLista
      );
      if (global.direcciones) this.repintarLista();*/
      //Lista de data para el radio
      this.consultaItemRadioYapa();
   };

   consultaItemRadioYapa = () => {
      this.listaItemYapa = [];
      //valor quemado para el item Alinambi
      let itemAlinambi = {};
      itemAlinambi.label = 'Donar su Yappa a Fundación Aliñambi';
      itemAlinambi.value = 'D';
      //continuo con el for
      for (let i = 0; i < this.props.listaYapa.length; i++) {
         let itemYapa = {};
         itemYapa.label =
            this.props.listaYapa[i].nombre +
            ' - ' +
            convertir(
               this.props.listaYapa[i].unidad,
               this.props.listaYapa[i].cantidad
            );
         /* itemYapa.value =
            this.props.listaYapa[i].nombre +
            ' - ' +
            convertir(
               this.props.listaYapa[i].unidad,
               this.props.listaYapa[i].cantidad
            );*/
         itemYapa.value = i;
         itemYapa.cantidad = this.props.listaYapa[i].cantidad;
         itemYapa.unidad = this.props.listaYapa[i].unidad;
         console.log('data itemYapa', itemYapa);
         this.listaItemYapa.push(itemYapa);
      }
      this.listaItemYapa.push(itemAlinambi);
      console.log('listaItemYapa', this.listaItemYapa);
      this.setState({
         yapaSeleccionada: this.listaItemYapa[0].value,
         mensaje: 'Qué Yappa desea llevar?',
      });
   };
   componentWillUnmount = () => {
      this.montado = false;
   };
   obtenerUbicacionActual = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
         Alert.alert('Información', 'Error al otorgar el permiso');
         return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('actual location:', location);
      global.localizacionActual = location;
      this.props.navigation.navigate('Mapa', {
         origen: 'actual',
         coordenadasActuales: null,
         pantallaOrigen: 'lsCombo',
      });
   };

   recuperarCoordenadas = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
         Alert.alert('Información', 'Error al otorgar el permiso');
         return;
      }

      let location = await Location.getCurrentPositionAsync({});
      global.localizacionActual = location;
   };
   repintarLista = () => {
      if (this.montado) {
         console.log('repinta lista direcciones:', global.direcciones);
         this.setState({ listaDireccionesCobertura: global.direcciones });
      }
   };
   seleccionarYappa = valor => {
      this.setState({ yapaSeleccionada: valor });
   };
   render() {
      return (
         <View style={styles.centeredView}>
            <View style={styles.modalView}>
               <View
                  style={{
                     flex: 1,
                     width: anchoModal,
                     justifyContent: 'center',
                     alignItems: 'stretch',
                  }}
               >
                  <View>
                     <Text
                        style={{
                           marginBottom: 20,
                           fontWeight: 'bold',
                           fontSize: 20,
                        }}
                     >
                        {this.state.mensaje}
                     </Text>

                     {this.listaItemYapa.length > 0 ? (
                        <Selector
                           valor1={{
                              contenido: this.listaItemYapa[0].label,
                              valor: this.listaItemYapa[0].value,
                           }}
                           valor2={{
                              contenido: this.listaItemYapa[1].label,
                              valor: this.listaItemYapa[1].value,
                           }}
                           valor3={{
                              contenido: this.listaItemYapa[2].label,
                              valor: this.listaItemYapa[2].value,
                           }}
                           seleccionado={this.listaItemYapa[0].value}
                           fnSeleccionar={this.seleccionarYappa}
                        ></Selector>
                     ) : (
                        <View></View>
                     )}
                  </View>

                  <View style={{ marginTop: 20 }}>
                     <Button
                        title="Aceptar"
                        onPress={() => {
                           this.seleccionarYapa(this.state.yapaSeleccionada);
                           this.props.mostrarModal(false);
                           servPedidos.eliminarItemPedido(global.yapa);
                           servPedidos.agregarItemPedido(global.yapa);
                           this.props.navigation.navigate(
                              'ConfirmarCompraScreen'
                           );
                        }}
                        buttonStyle={styles.estiloBotonNaranja}
                     />
                  </View>
               </View>
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.75)',
      paddingVertical: 125,
   },
   modalView: {
      flex: 1,
      marginHorizontal: 20,
      marginVertical: 20,
      justifyContent: 'center',
      backgroundColor: colores.colorBlanco,
      borderRadius: 15,
      paddingHorizontal: 30,
      //paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#0000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   contenido: {
      flex: 1,
      //paddingVertical: 50,
      justifyContent: 'center',
      // width: anchoModal,
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
      borderRadius: 10,
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
      paddingTop: 10,
   },
   estiloBotonBlanco: {
      backgroundColor: colores.colorBlanco,
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
   estiloBotonNaranja: {
      backgroundColor: colores.colorPrimarioTomate,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
   },
   estiloContenedor: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   iconos: { marginRight: 5 },
   textoNormal: {
      color: colores.colorOscuroTexto,
      fontSize: 13,
      //fontWeight: 'bold',
   },
   textoTitulo: {
      color: colores.colorOscuroTexto,
      fontSize: 13,
      fontWeight: 'bold',
   },
   boton: {
      alignItems: 'stretch',
      paddingVertical: 20,
   },
});
