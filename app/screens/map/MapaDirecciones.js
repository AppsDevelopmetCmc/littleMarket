import React, { Component, useState } from 'react';
import {
   View,
   StyleSheet,
   Dimensions,
   Alert,
   Modal,
   useColorScheme,
   FlatList,
   TextInput,
   Image,
   SafeAreaView,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, CheckBox, Text, Avatar } from 'react-native-elements';
import MapInput from '../../components/MapInput';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import * as serviciosDirecciones from '../../servicios/ServicioDirecciones';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ServicioCobertura } from '../../servicios/ServicioCobertura';
import Geocoder from 'react-native-geocoding';
import _ from 'lodash';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';
import { ServicioParametros } from '../../servicios/ServicioParametros';
import * as Location from 'expo-location';
import {
   colorOscuroTexto,
   colorPrimarioAmarillo,
} from '../../constants/Colores';

import * as colores from '../../constants/Colores';
import * as estilos from '../../estilos/estilos';
import { ItemMapDireccion } from '../map/compnentes/ItemMapDireccion';
import { ScrollView } from 'react-native-gesture-handler';

import { ServicioSectores } from '../../servicios/ServicioSectores';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02 / 2;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export class MapaDirecciones extends Component {
   constructor(props) {
      console.log('CONSTRUCTOR MAPA DIRECCIONES');
      super(props);
      //cuando vengo por actualizar direccion obtengo los datos de la
      //direccion seleccionada
      this.origen = this.props.route.params.origen;
      this.direccion = this.props.route.params.direccion;
      this.direccionTmp = this.props.route.params.direccion;
      this.coordenadasBusqueda = this.props.route.params.coordenadasBusqueda;
      this.coordenadasActuales = this.props.route.params.coordenadasActuales;
      this.pantallaOrigen = this.props.route.params.pantallaOrigen;
      this.pintarElemento = false;
      this.tieneCoberturaDireccion = 'N';
      this.idDireccion = '';
      this.montado = false;
      let direcciones = [];
      this.actualizarNombre = false;
      this.tramaSectorAct = '';
      if (
         this.origen == 'nuevo' ||
         this.origen == 'actual' ||
         this.origen == 'busquedaDirecciones'
      ) {
         this.pintarElemento = true;
      }

      this.state = {
         vaciar: false,
         modalVisible: true,
         isMapReady: false,
         direccion: '',
         coordinate: {
            latitude: 0,
            longitude: 0,
         },
         mostrarModal: false,
         alias: '',
         referencia: '',
         principal: false,
         listaDirecciones: direcciones,
         validarReferencia: '',
         siguienteMapa: false,
      };
      let servCobertura = new ServicioCobertura();
      servCobertura.getRegistrarCoberturaTodas();

      let servParametros = new ServicioParametros();
      servParametros.getObtenerParametroId(
         'geo',
         this.obtenerParametroCobertura
      );
   }

   obtenerParametroCobertura = parametro => {
      global.parametrosGeo = parametro;
      console.log('parametrosGeo', global.parametrosGeo.cobertura);
   };

   obtenerCoordenadas = async () => {
      console.log('OBTENER COORDENADAS---', this.origen);
      /*Geocoder.init('AIzaSyBeK8BWXsKDTMtwV_bC2FI4GADQklc-nuA');*/
      if (this.origen == 'actual') {
         this.setState({
            region: {
               latitude: global.localizacionActual.coords.latitude,
               longitude: global.localizacionActual.coords.longitude,
               latitudeDelta: LATITUDE_DELTA,
               longitudeDelta: LONGITUDE_DELTA,
            },
            coordinate: {
               latitude: global.localizacionActual.coords.latitude,
               longitude: global.localizacionActual.coords.longitude,
            },
         });
      } else if (this.origen == 'nuevo') {
         this.setState({
            region: {
               latitude: this.coordenadasBusqueda.lat,
               longitude: this.coordenadasBusqueda.lng,
               latitudeDelta: LATITUDE_DELTA,
               longitudeDelta: LONGITUDE_DELTA,
            },
            coordinate: {
               latitude: this.coordenadasBusqueda.lat,
               longitude: this.coordenadasBusqueda.lng,
            },

            // direccion: response.results[0].formatted_address,
         });
      } else if (this.origen == 'actualizar') {
         this.setState({
            region: {
               latitude: this.direccion.latitud,
               longitude: this.direccion.longitud,
               latitudeDelta: LATITUDE_DELTA,
               longitudeDelta: LONGITUDE_DELTA,
            },
            coordinate: {
               latitude: this.direccion.latitud,
               longitude: this.direccion.longitud,
            },
            direccion: this.direccion.descripcion,
            tieneCoberturaDireccion: this.direccion.tieneCoberturaDireccion,
            alias: this.direccion.alias,
            referencia: this.direccion.referencia,
            principal: this.direccion.principal == 'S' ? true : false,
         });
      } else if (this.origen == 'busquedaDirecciones') {
         this.setState({
            region: {
               latitude: this.direccion.latitud,
               longitude: this.direccion.longitud,
               latitudeDelta: LATITUDE_DELTA,
               longitudeDelta: LONGITUDE_DELTA,
            },
            coordinate: {
               latitude: this.direccion.latitud,
               longitude: this.direccion.longitud,
            },
            direccion: this.direccion.descripcion,
            // direccion: response.results[0].formatted_address,
         });
      }
   };
   componentDidMount() {
      this.obtenerCoordenadas();
      let srvDirecciones = new ServicioDirecciones();
      this._unsuscribe = srvDirecciones.registrarEscuchaMapaDireccion(
         global.usuario,
         this.repintarLista
      );
      this.montado = true;
   }

   repintarLista = () => {
      //  this.validarCoberturaGlobalDireccion();
      const direcciones = global.direcciones;
      console.log('---- seleccionado---> ', global.direccionPedido.id);
      let existeSeleccionado = false;
      for (let i = 0; i < direcciones.length; i++) {
         if (direcciones[i].id == global.direccionPedido.id) {
            direcciones[i].itemSeleccionado = true;
            existeSeleccionado = true;
         } else {
            direcciones[i].itemSeleccionado = false;
         }
      }
      if (!existeSeleccionado) {
         //global.direccionPedido = direcciones[0];
         //global.direccionPedido.itemSeleccionado = true;
         this.actualizarDireccion(direcciones[0]);
      }
      this.setState({
         listaDirecciones: direcciones,
      });
      console.log('---- seleccionado---> ', direcciones);
   };

   componentWillUnmount = () => {
      console.log('UNSUSCRIBE!!!');
      if (this._unsuscribe) {
         this._unsuscribe();
      }
   };
   obtenerDireccion = async (latitude, longitude) => {
      let addressComponent = '';
      Geocoder.from(latitude, longitude)
         .then(json => {
            addressComponent = json.results[0].formatted_address;
            console.log(addressComponent);
            this.setState({ direccion: addressComponent });
         })
         .catch(error => console.warn(error));
   };

   onMapLayout = () => {
      this.setState({ isMapReady: true });
   };

   actualizarLocalizacion(localizacion) {
      this.setState({
         region: {
            latitude: localizacion.latitude,
            longitude: localizacion.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
         },
         coordinate: {
            latitude: localizacion.latitude,
            longitude: localizacion.longitude,
         },
         direccion: localizacion.descripcion,
      });
   }
   obtenerCoords(localizacion) {
      this.actualizarLocalizacion({
         latitude: localizacion.coord.lat,
         longitude: localizacion.coord.lng,
         descripcion: localizacion.descripcion,
      });
   }

   handleRegionChange = mapData => {
      this.setState({
         coordinate: {
            latitude: mapData.latitude,
            longitude: mapData.longitude,
         },
         region: mapData,
      });
   };

   onMarkerDragEnd = coord => {
      let newRegion = {
         latitude: parseFloat(coord.latitude),
         longitude: parseFloat(coord.longitude),
         latitudeDelta: 0.0522,
         longitudeDelta: 0.0321,
      };
      this.setState({
         vaciar: true,
         region: newRegion,
         coordinate: {
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
         },
      });
      this.obtenerDireccion(newRegion.latitude, newRegion.longitude);
   };

   asignarDireccion = (nombreDireccion, latitud, longitud) => {
      this.setState({
         direccion: nombreDireccion,
         region: {
            latitude: latitud,
            longitude: longitud,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
         },
      });
   };

   onRegionChangeComplete = async region => {
      if (this.actualizarNombre) {
         this.nueva = new Date().getTime();
         console.log('DIRECCION', region.latitude, region.longitude);
         this.setState({});
         serviciosDirecciones.generarDireccion(
            region.latitude,
            region.longitude,
            this.asignarDireccion
         );
      } else {
         this.actualizarNombre = true;
      }
   };

   asignarSector = async (latAct, longAct) => {
      let srvSector = new ServicioSectores();
      console.log("LATITUD ACTUAL" + latAct);
      console.log("LONGITUD ACTUAL" + longAct);
      this.tramaSectorAct = await srvSector.consultarSector(latAct, longAct);
      global.sector = this.tramaSectorAct.sector;
      console.log("SECTOR ACTUAL------->" + global.sector);

      if (!this.tramaSectorAct.sector) {
         Alert.alert(
            'Lo Sentimos',
            'Al momento no tenemos cobertura en este sector, pronto estaremos contigo'
         );
      }
   }

   actualizarDireccion = direccion => {
      this.direccionTmp = direccion;
      // console.log('direccion', direccion);
      let siguienteMapaActual = this.state.siguienteMapa;
      // console.log('mapa Actual', siguienteMapaActual);
      this.setState({
         region: {
            latitude: direccion.latitud,
            longitude: direccion.longitud,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
         },
         coordinate: {
            latitude: direccion.latitud,
            longitude: direccion.longitud,
         },
         direccion: direccion.descripcion,
         tieneCoberturaDireccion: direccion.tieneCoberturaDireccion,
         alias: direccion.alias,
         referencia: direccion.referencia,
         principal: direccion.principal == 'S' ? true : false,
         siguienteMapa: !siguienteMapaActual,
         validarReferencia: '',
      });
      global.direccionPedido = direccion;
      //  console.log('siguienteMapa', this.state.siguienteMapa);
      this.repintarLista();
   };

   actualizarDireccionPedido = async () => {
      let validar = true;
      await this.asignarSector(this.state.region.latitude, this.state.region.longitude);
      if (!this.state.referencia) {
         Alert.alert(
            'Advertencia',
            'Debe ingresar información en el Campo Referencia'
         );
         this.setState({ validarReferencia: '*Campo obligatorio' });
         validar = false;
      }
      if (validar) {
         this.direccionTmp.descripcion = this.state.direccion;
         this.direccionTmp.referencia = this.state.referencia;
         this.direccionTmp.principal = 'S';
         this.direccionTmp.itemSeleccionado = true;
         this.direccionTmp.id = direccionPedido.id;
         this.direccionTmp.latitud = this.state.region.latitude;
         this.direccionTmp.longitud = this.state.region.longitude;
         this.direccionTmp.sector = this.tramaSectorAct.sector ? this.tramaSectorAct.sector : '';
         // this.direccionTmp.tieneCoberturaDireccion = this.tramaSectorAct.sector ? 'S' : 'N'
         global.direccionPedido = this.direccionTmp;
         console.log(this.direccionTmp);
         let srvDireccion = new ServicioDirecciones();
         // await srvDireccion.actualizarPrincipalTodosNo(global.usuario);
         srvDireccion.guardarDataReferencia(
            global.usuario,
            direccionPedido.id,
            this.direccionTmp
         );
         console.log('Envia Confirmar');

         this.props.navigation.navigate('ConfirmarCompraScreen', {
            origen: 'mapaDirecciones',
         });
      }
   };
   obtenerItemSeleccionado = () => {
      let direcciones = this.state.listaDirecciones;
      let indice = 0;
      for (let i = 0; i < direcciones.length; i++) {
         if (direcciones[i].itemSeleccionado) {
            indice = i;
         }
      }
      return indice;
   };

   eliminar = direccion => {
      console.log('ELIMINA:', direccion);
      let servDirecciones = new ServicioDirecciones();

      if (
         this.state.listaDirecciones &&
         this.state.listaDirecciones.length == 1
      ) {
         Alert.alert('No puede eliminar todas las direcciones');
      } else {
         servDirecciones.eliminarDir(global.usuario, direccion.id, () => {});
      }
   };
   render() {
      let indiceSeleccionado = this.obtenerItemSeleccionado();
      console.log('----RENDER MAPA----', this.state.listaDirecciones);
      const { navigation } = this.props;
      return (
         <View style={[styles.container]}>
            <View style={{ flex: 4 }}>
               <View
                  style={{
                     backgroundColor: 'white',
                     //height: 30,
                     borderRadius: 20,
                     marginBottom: 10,
                     marginHorizontal: 10,
                     paddingHorizontal: 10,
                     //paddingHorizontal: 10,
                     justifyContent: 'center',
                  }}
               >
                  <Input
                     // style={{ paddingVertical: 5, paddingHorizontal: 15 }}
                     inputStyle={{ fontSize: 14, borderWidth: 0 }}
                     containerStyle={{ borderWidth: 0 }}
                     inputContainerStyle={{
                        borderWidth: 0,
                        paddingHorizontal: 10,
                        // paddingVertical: 10,
                     }}
                     multiline={true}
                     value={this.state.direccion}
                     onChangeText={text => {
                        this.setState({ direccion: text });
                     }}
                     //label="Dirección"
                     placeholder="dirección"
                     //underlineColorAndroid={colores.colorBlanco}
                  ></Input>
               </View>
               <View
                  style={{
                     backgroundColor: 'white',
                     // height: 30,
                     borderRadius: 20,
                     marginBottom: 10,

                     marginHorizontal: 10,
                     paddingHorizontal: 10,
                     justifyContent: 'center',
                  }}
               >
                  <Input
                     //style={{ paddingVertical: 5, paddingHorizontal: 15 }}
                     inputStyle={{ fontSize: 14, borderWidth: 0 }}
                     containerStyle={{ borderWidth: 0 }}
                     inputContainerStyle={{
                        borderWidth: 0,
                        paddingHorizontal: 10,
                        // paddingVertical: 10,
                     }}
                     errorMessage={this.state.validarReferencia}
                     value={this.state.referencia}
                     multiline={true}
                     onChangeText={text => {
                        this.setState({ referencia: text });
                     }}
                     //label="Dirección"
                     placeholder="Edificio/Número Casa/Referencia"
                  ></Input>
               </View>
               {this.state.region ? (
                  <View style={{ flex: 5 }}>
                     {!this.state.siguienteMapa && (
                        <MapView
                           style={{ width: width, height: height / 2.5 }}
                           provider={PROVIDER_GOOGLE}
                           mapType="standard"
                           showsScale
                           showsCompass
                           showsPointsOfInterest
                           showsBuildings
                           showsUserLocation
                           loadingEnabled={true}
                           ref={map => (this.map = map)}
                           onLayout={this.onMapLayout}
                           initialRegion={this.state.region}
                           onRegionChangeComplete={region => {
                              this.onRegionChangeComplete(region);
                           }}
                        >
                           {/**<MapView.Marker
                              title={this.state.direccion}
                              Key={APIKEY}
                              ref={marker => {
                                 this.marker = marker;
                              }}
                              coordinate={this.state.coordinate}
                              draggable={true}
                           />*/}
                        </MapView>
                     )}
                     {this.state.siguienteMapa && (
                        <MapView
                           style={{ width: width, height: height / 2.5 }}
                           provider={PROVIDER_GOOGLE}
                           mapType="standard"
                           showsScale
                           showsCompass
                           showsPointsOfInterest
                           showsBuildings
                           showsUserLocation
                           loadingEnabled={true}
                           ref={map => (this.map = map)}
                           onLayout={this.onMapLayout}
                           initialRegion={this.state.region}
                           onRegionChangeComplete={region => {
                              this.onRegionChangeComplete(region);
                           }}
                        ></MapView>
                     )}
                  </View>
               ) : (
                  <Text>Cargando</Text>
               )}
               {/*<View
                  style={{
                     flex: 1,
                     //backgroundColor: 'blue',
                     alignItems: 'center',
                     justifyContent: 'center',
                     bottom: 10,
                  }}
               >
                  <Button
                     buttonStyle={{
                        backgroundColor: colores.colorPrimarioTomate,
                     }}
                     title={this.pintarElemento ? 'GUARDAR' : 'ACEPTAR'}
                     onPress={() => {
                        this.actualizarDireccionPedido();
                     }}
                  />
               </View>*/}

               <View
                  style={{
                     flex: 1,
                     position: 'absolute',
                     left: width / 2 - 18,
                     top: height / 2 - height * 0.23,
                  }}
               >
                  <Image source={require('../../imagenes/punta.png')} />
               </View>
            </View>
            <View style={styles.pie}>
               <View
                  style={{
                     flex: 1,
                     justifyContent: 'center',
                     alignItems: 'flex-end',
                  }}
               >
                  <Button
                     buttonStyle={estilos.botones.blancoRight2}
                     titleStyle={estilos.textos.botonBlancoTomate}
                     title="Agregar Nueva Ubicación"
                     onPress={() => {
                        this.props.navigation.dispatch(state => {
                           // Remove the home route from the stack
                           const routes = state.routes.filter(
                              r => r.name !== 'MapaDirecciones'
                           );

                           return CommonActions.reset({
                              ...state,
                              routes,
                              index: routes.length - 1,
                           });
                        });
                        this.props.navigation.navigate(
                           'BusquedaDireccionesScreen',
                           {
                              origen: 'nuevo',
                              pantallaOrigen: 'ConfirmarCompra',
                           }
                        );
                     }}
                     icon={
                        <Icon
                           name="plus-circle"
                           size={20}
                           color={colores.colorPrimarioTomate}
                           style={styles.iconos}
                        />
                     }
                  />
               </View>
               <View style={{ flex: 4 }}>
                  <FlatList
                     contentContainerStyle={{
                        flexGrow: 1,
                        marginBottom: 20,
                     }}
                     // initialNumToRender={2}
                     //ref={ref => (this.flatList = ref)}
                     data={this.state.listaDirecciones}
                     renderItem={objeto => {
                        return (
                           <ItemMapDireccion
                              direccion={objeto.item}
                              fnActualizar={this.actualizarDireccion}
                              fnEliminar={this.eliminar}
                           ></ItemMapDireccion>
                        );
                     }}
                     keyExtractor={objetoCombo => {
                        return objetoCombo.id;
                     }}
                     ItemSeparatorComponent={flatListItemSeparator}
                     initialScrollIndex={indiceSeleccionado}
                     getItemLayout={(data, index) => {
                        return {
                           length: 60,
                           offset: 60 * index,
                           index,
                        };
                     }}
                     removeClippedSubviews={true}
                     extraData={this.state}
                     ListFooterComponent={() => {
                        return (
                           <View>
                              <Text
                                 style={{
                                    color: colores.colorBlanco,
                                    fontSize: 20,
                                 }}
                              >
                                 FIN
                              </Text>
                              <Text
                                 style={{
                                    color: colores.colorBlanco,
                                    fontSize: 20,
                                 }}
                              >
                                 FIN
                              </Text>
                           </View>
                        );
                     }}
                  />
               </View>
               <View
                  style={{
                     flex: 1,
                     justifyContent: 'center',
                     alignItems: 'center',
                  }}
               >
                  <Button
                     buttonStyle={estilos.botones.blancoRight}
                     titleStyle={estilos.textos.botonBlancoTomate}
                     title="Confirmar Ubicación Seleccionada"
                     onPress={() => {
                        this.actualizarDireccionPedido();
                     }}
                     icon={
                        <Icon
                           name="checkbox-marked-circle"
                           size={20}
                           color={colores.colorPrimarioTomate}
                           style={styles.iconos}
                        />
                     }
                  />
               </View>
            </View>
         </View>
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
const styles = StyleSheet.create({
   lista: {
      marginBottom: 40,
   },
   container: {
      flex: 1,
      alignItems: 'stretch',
      // paddingTop: 10,
      backgroundColor: colores.colorPrimarioVerde,
   },
   mapStyle: {
      flex: 3,
      width: '100%',
   },
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.75)',
      paddingVertical: 50,
      alignItems: 'stretch',
      marginTop: 22,
   },
   modalView: {
      margin: 20,
      backgroundColor: colores.colorBlanco,
      borderRadius: 20,
      padding: 35,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   pie: {
      flex: 3,
      backgroundColor: colores.colorBlanco,
      // marginTop: 15,
      //paddingTop: 20,
   },
   textAreaContainer: {
      borderColor: 'grey',
      borderWidth: 1,
      marginTop: 10,
   },
   textArea: {
      height: 100,
      margin: 20,
      padding: 10,
      borderColor: 'gray',
      borderWidth: 1,
      marginLeft: 10,
      marginRight: 10,
   },
});
