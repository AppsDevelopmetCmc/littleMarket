import React, { Component, useState } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import MapInput from '../../components/MapInput';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import{Input} from 'react-native-elements'
import {ServicioCobertura} from '../../servicios/ServicioCobertura'

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
      if (this.origen == 'nuevo') {
         this.pintarElemento = true;
      }
      //Logica de Naty para pintar los puntos de referencia cuando viene por actualizar
      this.state = {
         modalVisible: true,
         isMapReady: false,
         region: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
         },
         latitud: 0,
         longitud: 0,
         tieneCobertura:''
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

   validarCoberturaDireccion=()=>
   {
      let servCobertura=new ServicioCobertura();
      let coberturas=[];
      servCobertura.registrarEscuchaCoberturaTodas(coberturas,this.validar)
   }

   validar=(coberturas)=>
   {
      this.setState({tieneCobertura:'N'});
      let lat1=this.state.latitud;
      let log1=this.setState.longitud;
      for(let i=0;i<coberturas.length;i++)
      {
       if(parseFloat(this.getKilometros(lat1,log1,coberturas[i].longitud,coberturas[i].longitud)<5))
       {
          this.setState({tieneCobertura:'S'})
          break;
       }
     }

   }
   getKilometros = (lat1,lon1,lat2,lon2)=>
   {
     rad = (x)=> {return x*Math.PI/180;}
     let R = 6378.137; //Radio de la tierra en km
     let dLat = rad( lat2 - lat1 );
     let dLong = rad( lon2 - lon1 );
     let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
     let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     let d = R * c;
      return d.toFixed(3); //Retorna tres decimales
   }
   crearDireccion = () => {
      let servDireccion = new ServicioDirecciones();
      
      servDireccion.crear(global.usuario, {
         descripcion: 'Zabala',
         latitud: this.setState.latitud,
         longitud: this.state.longitud,
      });
      this.props.navigation.goBack();
   };

   actualizarDireccion = () => {
      let servDireccion = new ServicioDirecciones();
      servDireccion.actualizar(global.usuario, this.direccion.id, {
         descripcion: 'Zabala2',
         latitud: 33.98,
         longitud: 889.66,
      });
      this.props.navigation.goBack();
   };

   render() {
      const { navigation } = this.props;
      return (
         <View style={[styles.container]}>
            {/*  <View style={{ flex: 1 }}>
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

            <MapInput notificarCambio={loc => this.obtenerCoords(loc)} />  */}
            <View
               style={{
                  flex: 1,
               }}
            >
               <Input
                  value={this.state.latitud}
                  placeholder="Latitud"
                  label="Latitud1"
                  onChangeText={text => {
                     this.setState({ latitud: parseFloat( text) });
                  }}
               />
               <Input
                  value={this.state.longitud}
                  placeholder="Longitud"
                  label="Longitud1"
                  onChangeText={text => {
                     this.setState({ longitud: parseFloat(text) });
                  }}
               />
            </View>

            {this.pintarElemento && (
               <Button
                  title="Guardar"
                  onPress={() => {
                     this.crearDireccion();
                  }}
               ></Button>
            )}
            {!this.pintarElemento && (
               <Button
                  title="Actualizar"
                  onPress={() => {
                     this.actualizarDireccion();
                  }}
               ></Button>
            )}
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
