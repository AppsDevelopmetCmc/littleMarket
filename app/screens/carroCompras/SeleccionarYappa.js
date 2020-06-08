import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   TextInput,
   FlatList,
   Text,
   SafeAreaView,
} from 'react-native';
import * as colores from '../../constants/Colores';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

import RadioForm, {
   RadioButton,
   RadioButtonInput,
   RadioButtonLabel,
} from 'react-native-simple-radio-button';

import { ItemDireccionSeleccion } from '../map/compnentes/ItemDireccionSeleccion';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

export class SeleccionarYapa extends Component {
   constructor(props) {
      super(props);
      this.state = {
         yapaSeleccionada: null,
      };
      this.montado = false;
      this.radio_props = [
         { label: 'Ají - 10 unidades', value: 'Y1' },
         { label: 'Naranja - 20 unidades', value: 'Y2' },
         { label: 'Donar su Yapa a la Fundación Aliñambi', value: 'D' },
      ];
   }
   seleccionarYapa = seleccionada => {
      if (seleccionada == 'D') {
         global.yapa = { tipo: 'D' };
      } else {
         if (seleccionada == 'Y1') {
            global.yapa = {
               nombre: 'Aji',
               cantidad: 10,
               unidad: 'u',
               //tipo: 'D',//D es donar
            };
         } else {
            global.yapa = {
               nombre: 'Naranja',
               cantidad: 20,
               unidad: 'u',
               //tipo: 'D',//D es donar
            };
         }
      }
   };
   componentDidMount = () => {
      this.montado = true;
      new ServicioDirecciones().registrarEscuchaDireccion(
         global.usuario,
         this.repintarLista
      );
      if (global.direcciones) this.repintarLista();
   };
   componentWillUnmount = () => {
      this.montado = false;
   };
   obtenerUbicacionActual = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
         Alert.alert('Error al otorgar el permiso');
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
         Alert.alert('Error al otorgar el permiso');
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
   render() {
      return (
         <View style={styles.centeredView}>
            <View style={styles.modalView}>
               <View style={styles.contenido}>
                  <View>
                     <Text
                        style={{
                           marginBottom: 20,
                           fontWeight: 'bold',
                           fontSize: 18,
                        }}
                     >
                        Qué Yapa le gustaría llevar?
                     </Text>
                     <RadioForm
                        buttonColor={colores.colorPrimarioTomate}
                        selectedButtonColor={colores.colorPrimarioTomate}
                        radio_props={this.radio_props}
                        initial={global.pagoSeleccionado == 'TR' ? 1 : 0}
                        formHorizontal={false}
                        buttonSize={10}
                        buttonOuterSize={20}
                        onPress={value => {
                           this.setState({ yapaSeleccionada: value });
                        }}
                        wrapStyle={{ fontSize: 20 }}
                     />
                  </View>

                  <View style={{ marginTop: 20 }}>
                     <Button
                        title="Aceptar"
                        onPress={() => {
                           this.seleccionarYapa(this.state.yapaSeleccionada);

                           this.props.mostrarModal(false);
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
      paddingVertical: 50,
   },
   modalView: {
      flex: 1,
      marginHorizontal: 20,
      marginVertical: 150,
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
