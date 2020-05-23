import React, { Component, useState } from 'react';
import {
   View,
   StyleSheet,
   Dimensions,
   Alert,
   Modal,
   useColorScheme,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, CheckBox, Text } from 'react-native-elements';
import MapInput from '../../components/MapInput';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import { Input } from 'react-native-elements';
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

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = -1.831239;
const LONGITUDE = -78.183403;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export class Mapa extends Component {
   constructor(props) {
      super(props);
      //cuando vengo por actualizar direccion obtengo los datos de la
      //direccion seleccionada
      this.origen = this.props.route.params.origen;
      this.direccion = this.props.route.params.direccion;
      this.coordenadasBusqueda = this.props.route.params.coordenadasBusqueda;
      this.coordenadasActuales = this.props.route.params.coordenadasActuales;
      this.pantallaOrigen = this.props.route.params.pantallaOrigen;
      this.pintarElemento = false;
      this.tieneCoberturaDireccion = 'N';
      this.idDireccion = '';
      if (this.origen == 'nuevo' || this.origen == 'actual') {
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
      }

      if (this.origen == 'nuevo') {
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
      }
      if (this.origen == 'actualizar') {
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
            principal: this.direccion.principal,
         });
      }
   };

   componentDidMount() {
      this.obtenerCoordenadas();
   }

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

   validar = () => {
      let lat1 = this.state.coordinate.latitude;
      let log1 = this.state.coordinate.longitude;
      for (let i = 0; i < global.coberturas.length; i++) {
         let distancia = 0;
         distancia = parseFloat(
            this.getKilometros(
               lat1,
               log1,
               global.coberturas[i].latitud,
               global.coberturas[i].longitud
            )
         );
         console.log('Kilomeros' + distancia);
         if (distancia < global.parametrosGeo.cobertura) {
            console.log('Ingresa');
            this.tieneCoberturaDireccion = 'S';
            break;
         }
      }
   };

   rad = x => {
      return (x * Math.PI) / 180;
   };

   getKilometros = (lat1, lon1, lat2, lon2) => {
      let R = 6378.137; //Radio de la tierra en km
      let dLat = this.rad(lat2 - lat1);
      console.log('rad1' + this.rad(lat2 - lat1));
      let dLong = this.rad(lon2 - lon1);
      let a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(this.rad(lat1)) *
            Math.cos(this.rad(lat2)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      return d.toFixed(3); //Retorna tres decimales
   };

   guardarDireccion = async () => {
      let servDireccion = new ServicioDirecciones();
      let operacion = this.pintarElemento ? 'crear' : 'actualizar';
      this.validar();
      let nuevaDireccion = {
         descripcion: this.state.direccion,
         latitud: this.state.coordinate.latitude,
         longitud: this.state.coordinate.longitude,
         tieneCoberturaDireccion: this.tieneCoberturaDireccion,
      };
      if (operacion === 'crear') {
         let idDireccionCreada = await servDireccion.crear(
            global.usuario,
            nuevaDireccion
         );
         console.log('idDireccionCreada', idDireccionCreada);
         this.idDireccion = idDireccionCreada;
         console.log('idDireccion', this.idDireccion);
         if (this.idDireccion != undefined) {
            this.setState({ mostrarModal: true });
         }
         //this.props.navigation.navigate('Direcciones');
      } else {
         servDireccion.actualizar(
            global.usuario,
            this.direccion.id,
            nuevaDireccion
         );
         this.setState({ mostrarModal: true });
         //this.props.navigation.goBack();
      }
      global.direccionActual = this.state.direccion;
      if (global.direccionPedido) {
         global.direccionPedido.descripcion = this.state.direccion;
      }
   };
   guardarDatosReferencia = async () => {
      let servDireccion = new ServicioDirecciones();
      let operacion = this.pintarElemento ? 'crear' : 'actualizar';
      let principal = this.state.principal ? 'S' : 'N';
      if (global.direcciones && global.direcciones.length == 1) {
         principal = 'S';
      }
      if (principal == 'S') {
         await servDireccion.actualizarPrincipalTodosNo(global.usuario);
      }
      if (operacion === 'crear') {
         console.log('this.idDireccion', this.idDireccion);

         servDireccion.guardarReferencia(global.usuario, this.idDireccion, {
            referencia: this.state.referencia,
            alias: this.state.alias,
            principal: principal,
         });
      } else {
         servDireccion.guardarReferencia(global.usuario, this.direccion.id, {
            referencia: this.state.referencia,
            alias: this.state.alias,
            principal: principal,
         });
      }
      this.setState({ mostrarModal: false });
      if (this.tieneCoberturaDireccion == 'S') {
         if (this.pantallaOrigen == 'Direcciones') {
            global.activarCobertura(true);
         }
         //this.props.navigation.popToTop
      }
      console.log('popToTop');
      this.props.navigation.popToTop();
   };
   onRegionChangeComplete = async region => {
      this.nueva = new Date().getTime();
      setTimeout(async () => {
         if (new Date().getTime() - this.nueva > 500) {
            console.log('DIRECCION', region.latitude, region.longitude);
            let response = await Geocoder.from(
               region.latitude,
               region.longitude
            );
            this.generarDireccion(response.results[0]);
         }
      }, 500);
   };

   onRegionChange = region => {
      this.setState({
         coordinate: { latitude: region.latitude, longitude: region.longitude },
      });
   };
   generarDireccion = info => {
      //console.log('info', info.address_components);
      let componentes = info.address_components;
      let direccionName = {};
      if (componentes) {
         for (let i = 0; i < componentes.length; i++) {
            let componente = componentes[i];
            console.log('componente', componente);
            for (let j = 0; j < componente.types.length; j++) {
               console.log('route', direccionName.route);

               if (componente.types[j] == 'route') {
                  if (!direccionName.route) {
                     direccionName.route = componente.short_name;
                  }
                  if (direccionName.route != componente.short_name) {
                     direccionName.route2 = componente.short_name + '';
                  }
               }

               if (componente.types[j] == 'point_of_interest') {
                  direccionName.point_of_interest = componente.short_name;
               }
               if (componente.types[j] == 'street_number') {
                  direccionName.street_number = componente.short_name;
               }
               if (componente.types[j] == 'sublocality') {
                  direccionName.sublocality = componente.short_name;
               }
               if (componente.types[j] == 'locality') {
                  direccionName.locality = componente.short_name;
               }
               if (componente.types[j] == 'country') {
                  direccionName.country = componente.long_name;
               }
            }
         }
      }
      //point_of_interest, route street_number, sublocality, locality
      console.log('direccionX===>', direccionName);
      let nombreDireccion = '';

      if (direccionName) {
         let numeroCalle =
            direccionName.route + ' ' + direccionName.street_number;
         if (direccionName.route2) {
            numeroCalle =
               direccionName.route +
               ' ' +
               direccionName.street_number +
               ' ' +
               direccionName.route2;
         }
         let resNumeroCalle = numeroCalle.replace(/undefined/gi, '');
         let str =
            direccionName.point_of_interest +
            ', ' +
            resNumeroCalle +
            ', ' +
            direccionName.sublocality +
            ', ' +
            direccionName.locality +
            '-' +
            direccionName.country;
         let res = str.replace(/, ,/gi, ',');
         res = str.replace(/ ,/gi, '');
         nombreDireccion = res.replace(/undefined,/gi, '');
      }

      console.log('direccionName===>', nombreDireccion);
      this.setState({ direccion: nombreDireccion });
   };

   render() {
      const { navigation } = this.props;
      return (
         <View style={[styles.container]}>
            <View style={{ flex: 1 }}>
               <View
                  style={{
                     backgroundColor: 'white',
                     height: 30,
                     borderRadius: 20,
                     marginBottom: 10,
                     marginHorizontal: 10,
                     paddingHorizontal: 10,
                     justifyContent: 'center',
                  }}
               >
                  <Text>{this.state.direccion}</Text>
               </View>
               {this.state.region ? (
                  <MapView
                     style={{ width: width, height: height - 50 }}
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
                     onRegionChange={region => {
                        this.onRegionChange(region);
                     }}
                  >
                     <MapView.Marker
                        title={this.state.direccion}
                        Key={APIKEY}
                        ref={marker => {
                           this.marker = marker;
                        }}
                        coordinate={this.state.coordinate}
                        draggable={true}
                     />
                  </MapView>
               ) : (
                  <Text>Cargando</Text>
               )}
            </View>
            <Modal
               animationType="slide"
               transparent={true}
               visible={this.state.mostrarModal}
            >
               <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                     <Text h4>Dirección</Text>
                     <Text style={{ fontSize: 16, marginVertical: 10 }}>
                        {this.state.direccion}
                     </Text>
                     <Input
                        value={this.state.alias}
                        placeholder="Casa/Oficina"
                        label="Alias"
                        onChangeText={text => {
                           this.setState({ alias: text });
                        }}
                     />
                     <Input
                        value={this.state.referencia}
                        placeholder="Color de casa/ N- Oficina"
                        label="Referencia"
                        onChangeText={text => {
                           this.setState({ referencia: text });
                        }}
                     />
                     {this.tieneCoberturaDireccion ? (
                        <CheckBox
                           title="Dirección Principal"
                           checked={this.state.principal}
                           checkedColor={colores.colorPrimarioTomate}
                           onPress={() =>
                              this.setState({
                                 principal: !this.state.principal,
                              })
                           }
                        />
                     ) : (
                        <View></View>
                     )}

                     <Button
                        title="OK"
                        buttonStyle={{
                           backgroundColor: colores.colorPrimarioTomate,
                        }}
                        onPress={() => {
                           this.guardarDatosReferencia();
                        }}
                     ></Button>
                  </View>
               </View>
            </Modal>

            <Button
               buttonStyle={{ backgroundColor: colores.colorPrimarioTomate }}
               title={this.pintarElemento ? 'GUARDAR' : 'ACTUALIZAR'}
               onPress={() => {
                  this.guardarDireccion();
               }}
            ></Button>
         </View>
      );
   }
}

const styles = StyleSheet.create({
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
      alignItems: 'stretch',
      marginTop: 22,
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
});
