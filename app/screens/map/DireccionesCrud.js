import React, { Component } from 'react';
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Alert,
   ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import { ServicioParametros } from '../../servicios/ServicioParametros';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importacion de mensajes en la aplicacion label y text
import * as msg from '../../constants/Mensajes';

//Importacion de los colores
import * as colores from '../../constants/Colores';
import Separador from '../../components/Separador';
import * as Location from 'expo-location';
import { ItemDireccionCrud } from './compnentes/ItemDireccionCrud';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

import * as estilos from '../../estilos/estilos';
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
export class DireccionesCrud extends Component {
   constructor(props) {
      super(props);
      const { navigation } = props;
      this.localizacionActual = [];
      let direcciones = [];
      if (this.props.route.params != null) {
         this.notienecobertura = this.props.route.params.notienecobertura;
      }
      this.state = {
         listaDirecciones: global.direcciones,
      };
   }

   componentDidMount() {
      if (global.usuario == null) {
         let user = firebase.auth().currentUser;
         if (user) {
            global.usuario = user.email;
            global.infoUsuario = user.providerData[0];
         }
      }
      /*new ServicioDirecciones().registrarEscuchaDireccion(
         global.usuario,
         this.repintarLista
      );*/

      this.obtenerCoordenadas();
      console.log('DireccionesCrud: ' + global.direcciones);
      //if (global.direcciones) this.repintarLista();
      //  this.notienecobertura=this.props.route.params.notienecobertura1
      if (this.notienecobertura == 'N') {
         Alert.alert('No existe Cobertura para la Direccion ');
      }

      this._unsubscribe = this.props.navigation.addListener('focus', () => {
         console.log('DRAWER FOCUS');
         this.repintarLista();
         new ServicioDirecciones().registrarEscuchaDireccion(
            global.usuario,
            this.repintarLista
         );
      });
   }

   componentWillUnmount() {
      console.log('Crud Direcciones componentWillUnmount');
      this._unsubscribe();
   }

   obtenerCoordenadas = async () => {
      Geocoder.init(APIKEY);
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
         setErrorMsg('Error al otorgar el permiso');
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('actual location:', location);
      global.localizacionActual = location;
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
         coordenadasActuales: this.localizacionActual,
         pantallaOrigen: 'Crud',
      });
   };

   actualizar = direccion => {
      this.props.navigation.navigate('Mapa', {
         origen: 'actualizar',
         direccion: direccion,
         pantallaOrigen: 'Crud',
      });
   };
   eliminar = direccion => {
      console.log('ELIMINA:', direccion);
      //si se borra la dirección elegida para la entrega
      if (global.direccionPedido.id == direccion.id) {
         for (let i = 0; i < global.direcciones.length; i++) {
            if (global.direcciones[i].principal == 'S') {
               global.direccionPedido = global.direcciones[i];
               break;
            }
         }
         global.repintarDireccion();
      }

      let servDirecciones = new ServicioDirecciones();
      if (direccion.principal != 'S') {
         servDirecciones.eliminarDir(global.usuario, direccion.id);
      } else {
         Alert.alert('No se puede eliminar la dirección principal');
      }
   };

   repintarLista = () => {
      this.setState({
         listaDirecciones: global.direcciones,
      });
   };

   validarCoberturaGlobalDireccion = async () => {
      let servDirecciones = new ServicioDirecciones();
      let coberturaDireccion = await servDirecciones.getValidarCoberturaGlobal(
         global.usuario
      );
      if (coberturaDireccion == true) {
         global.activarCobertura(true);
      } else {
         Alert.alert('Ninguna de las Direcciones Ingresadas tiene Cobertura');
      }
   };
   regresoPagina = () => {
      this.props.navigation.goBack();
   };

   render() {
      return (
         <SafeAreaView style={styles.contenedorPagina}>
            <CabeceraPersonalizada
               iconoComponente={
                  <Icon
                     name="arrow-left"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={24}
                     onPress={this.regresoPagina}
                  />
               }
            ></CabeceraPersonalizada>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 24, 'bold')}>
                  Mis direcciones
               </Text>
               <Icon
                  name="map-marker"
                  size={40}
                  color={'rgba(255, 255, 255, 0.5)'}
                  style={styles.iconos}
               />
            </View>
            <View style={styles.pie}>
               <View style={styles.boton}>
                  <Button
                     buttonStyle={estilos.botones.blanco}
                     titleStyle={estilos.textos.botonBlanco}
                     title="Agregar ubicación actual"
                     onPress={() => {
                        this.obtenerUbicacionActual();
                     }}
                     icon={
                        <Icon
                           name="crosshairs-gps"
                           size={20}
                           color={colores.colorPrimarioTomate}
                           style={styles.iconos}
                        />
                     }
                  />
                  <Button
                     buttonStyle={estilos.botones.blanco}
                     titleStyle={estilos.textos.botonBlanco}
                     title="Agregar nueva ubicación"
                     onPress={() => {
                        this.props.navigation.navigate(
                           'BusquedaDireccionesScreen',
                           {
                              origen: 'nuevo',
                              pantallaOrigen: 'Crud',
                           }
                        );
                     }}
                     icon={
                        <Icon
                           name="map-marker"
                           size={20}
                           color={colores.colorPrimarioTomate}
                           style={styles.iconos}
                        />
                     }
                  />
               </View>

               <View style={styles.contenedorTituloSubr}>
                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 13, 'bold'),
                        styles.estiloContenedorTitulo,
                     ]}
                  >
                     Mis Direcciones
                  </Text>
               </View>
               <View style={{ flex: 1 }}>
                  <FlatList
                     data={this.state.listaDirecciones}
                     renderItem={objeto => {
                        return (
                           <ItemDireccionCrud
                              direccion={objeto.item}
                              fnActualizar={this.actualizar}
                              fnEliminar={this.eliminar}
                           />
                        );
                     }}
                     keyExtractor={objetoCombo => {
                        return objetoCombo.id;
                     }}
                     ItemSeparatorComponent={flatListItemSeparator}
                  />
               </View>
            </View>
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
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
   },
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
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
   contenedorTituloSubr: {
      borderBottomColor: colores.colorOscuroTexto,
      borderBottomWidth: 1,
   },

   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },

   estiloContenedorTitulo: {
      paddingBottom: 10,
   },
   boton: {
      alignItems: 'stretch',
      paddingBottom: 30,
      paddingTop: 30,
   },
   btnViewContinuar: {
      flex: 1,
      alignItems: 'flex-end',
      flexDirection: 'row',
   },
   estiloBotonBlanco: {
      backgroundColor: colores.colorBlanco,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   btnContinuar: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 200,
      height: 45,
      borderRadius: 25,
      marginBottom: 50,
   },
   cabeceraApp: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 20,
      paddingTop: 30,
   },
   cabecera: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 20,
      paddingTop: 10,
      alignItems: 'center',
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 20,
      marginTop: 30,
   },
   estiloContenedor: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   iconos: { marginRight: 10 },
});
