import React, { Component, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-elements';
import MapInput from '../../components/MapInput';
import Geocoder from 'react-native-geocoding';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = -1.831239;
const LONGITUDE = -78.183403;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export class Mapa extends Component {
   constructor(props) {
      super(props);
      this.state = {
         vaciar:false,
         modalVisible: true,
         isMapReady: false,
         direccion:'',
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
   }
   
   obtenerDireccion = async (latitude,longitude) => {
      let addressComponent = '';
      Geocoder.from(latitude, longitude)
      .then(json => {
         addressComponent = json.results[0].formatted_address;
         console.log(addressComponent);
         this.setState({direccion: addressComponent})
      })
      .catch(error => 
         console.warn(error));
   }

    componentDidMount() {
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
               direccion: global.direccionActual
            });
         },
         error => console.log(error.message),
         { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
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
         direccion: localizacion.descripcion
      });
   }
   obtenerCoords(localizacion) {
      this.actualizarLocalizacion({
         latitude: localizacion.coord.lat,
         longitude: localizacion.coord.lng,
         descripcion: localizacion.descripcion
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
                        key="AIzaSyATppG_lbMSBkBrTI1_T5plpQXhDNuz5mc"
                        ref={marker => {this.marker = marker}}
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

            <MapInput notificarCambio={loc => this.obtenerCoords(loc)}  limpiar={this.state.vaciar}/>

            <Button
               title="Guardar"
               onPress={() => {
                  global.direccionActual=this.state.direccion
                  navigation.navigate('Direcciones',{coord: this.state.coordinate, direccion:this.state.direccion});
               }}
            ></Button>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
   },
   mapStyle: {
      flex: 3,
      width: '100%',
   },
});
