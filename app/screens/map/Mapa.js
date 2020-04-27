import React, { Component, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-elements';
import MapInput from '../../components/MapInput';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = -1.831239;
const LONGITUDE = -78.183403;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Mapa extends Component {
   constructor(props) {
      super(props);
      this.state = {
         modalVisible: true,
         isMapReady: false,
         region: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
         },
      };
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
            });
         },
         error => console.log(error.message),
         { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
   }
   onMapLayout = () => {
      this.setState({ isMapReady: true });
   };

   componentWillUnmount() {
    //  navigator.geolocation.clearWatch(this.watchID);
   }
   actualizarLocalizacion(localizacion) {
      this.setState({
         region: {
            latitude: localizacion.latitude,
            longitude: localizacion.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
         },
      });
   }
   obtenerCoords(localizacion) {
      this.actualizarLocalizacion({
         latitude: localizacion.lat,
         longitude: localizacion.lng,
      });
   }

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
                  zoomEnabled={true}
                  ref={map => (this.map = map)}
                  onLayout={this.onMapLayout}
                  region={this.state.region}
                  loadingEnabled={true}
                  onRegionChange={region => {
                     this.setState({ region: region });
                  }}
               >
                  {this.state.isMapReady && (
                     <MapView.Marker
                        title={this.props.title}
                        key="AIzaSyATppG_lbMSBkBrTI1_T5plpQXhDNuz5mc"
                        coordinate={{
                           latitude: this.state.region.latitude,
                           longitude: this.state.region.longitude,
                        }}
                     />
                  )}
               </MapView>
            </View>
                        
            <MapInput notificarCambio={
               loc => this.obtenerCoords(loc)} />
            
              <Button
                  title="Guardar"
                  onPress={() => {
                     navigation.navigate('Direcciones');
                  }}
               ></Button>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 10,
   },
   mapStyle: {
      flex: 3,
      width: '100%',
   },
});
