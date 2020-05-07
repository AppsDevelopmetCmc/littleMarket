import React, { Component, useState } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-elements';
import MapInput from '../../components/MapInput';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import { Input } from 'react-native-elements';
import { ServicioCobertura } from '../../servicios/ServicioCobertura';
import Geocoder from 'react-native-geocoding';
import _ from 'lodash';
import { apiKeyMaps } from '../../utils/ApiKey';
import { ServicioParametros } from '../../servicios/ServicioParametros';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = -1.831239;
const LONGITUDE = -78.183403;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export class Mapa extends Component {
   constructor(props) {
      super(props);
      //cuando vengo por actualizar direccion obtengo los datos de la
      //direccion seleccionada
      this.origen = this.props.route.params.origen;
      this.direccion = this.props.route.params.direccion;
      this.pintarElemento = false;
      this.tieneCoberturaDireccion = 'N';
      if (this.origen == 'nuevo') {
         this.pintarElemento = true;
      }
      this.state = {
         vaciar: false,
         modalVisible: true,
         isMapReady: false,
         direccion: '',
         region: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
         },
         coordinate: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
         },
      };
      let servCobertura = new ServicioCobertura();
      servCobertura.getRegistrarCoberturaTodas();
      
      let servParametros = new ServicioParametros();
     servParametros.getRegistrarParametrosTodas();
      
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

   componentDidMount() {
      if (this.origen == 'nuevo') {
         navigator.geolocation.getCurrentPosition(
            position => {
               this.setState({
                  region: {
                     latitude: position.coords.latitude,
                     longitude: position.coords.longitude,
                     latitudeDelta: LATITUDE_DELTA,
                     longitudeDelta: LONGITUDE_DELTA,
                  },
                  coordinate: {
                     latitude: position.coords.latitude,
                     longitude: position.coords.longitude,
                  },
               });
               this.obtenerDireccion(
                  position.coords.latitude,
                  position.coords.longitude
               );
            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
         );
      } else {
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
         });
      }
   }
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
         if (distancia < global.parametros[0].cobertura) {
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

   guardarDireccion = () => {
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
         servDireccion.crear(global.usuario, nuevaDireccion);
      } else {
         servDireccion.actualizar(
            global.usuario,
            this.direccion.id,
            nuevaDireccion
         );
      }
      global.direccionActual = this.state.direccion;
      this.props.navigation.goBack();
   };

   render() {
      const { navigation } = this.props;
      return (
         <View style={[styles.container]}>
            <View style={{ flex: 1 }}>
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
                  region={this.state.region}
               >
                  {this.state.isMapReady && (
                     <MapView.Marker
                        title={this.state.direccion}
                        key={apiKeyMaps}
                        ref={marker => {
                           this.marker = marker;
                        }}
                        coordinate={this.state.coordinate}
                        draggable={true}
                        onDragEnd={e =>
                           this.onMarkerDragEnd(e.nativeEvent.coordinate)
                        }
                        onPress={() => {}}
                        onCalloutPress={() => {
                           this.marker.hideCallout();
                        }}
                     />
                  )}
               </MapView>
            </View>

            {(this.pintarElemento || !_.isEmpty(this.state.direccion)) && (
               <MapInput
                  notificarCambio={loc => this.obtenerCoords(loc)}
                  direccion={this.state.direccion}
               />
            )}

            <Button
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
      paddingTop: 10,
   },
   mapStyle: {
      flex: 3,
      width: '100%',
   },
});
