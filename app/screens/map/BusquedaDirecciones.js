import { SearchBar } from 'react-native-elements';
import React, { Component } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { ItemPrediccion } from '../map/compnentes/ItemPrediccion';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import {
   apiKeyMaps,
   RADIO,
   PAIS,
   URLAUTOCOMPLETE,
   URLPLACEID,
   APIKEY,
} from '../../utils/ApiKey';
import { colorOscuroTexto } from '../../constants/Colores';
import * as colores from '../../constants/Colores';
import { color } from 'react-native-reanimated';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';

export class BusquedaDirecciones extends Component {
   constructor(props) {
      super(props);
      this.origen = this.props.route.params.origen;
      this.pantallaOrigen = this.props.route.params.pantallaOrigen;
      this.localizacionInicial = [];
      this.tieneCoberturaDireccion = 'N';
      this.idDireccion = '';
      this.state = {
         search: '',
         listaPredicciones: [],
         cargandoBusqueda: false,
      };
      if (this.sessionToken == 0 || this.sessionToken == undefined) {
         let date = new Date();
         this.sessionToken = date.getTime();
      }
   }

   componentDidMount() {
      this.obtenerCoordenadas();
   }

   obtenerCoordenadas = async () => {
      Geocoder.init(APIKEY);
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
         setErrorMsg('Error al otorgar el permiso');
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('actual location:', location);
      this.localizacionInicial = location;
   };

   updateSearch = async search => {
      this.setState({ search });

      if (search) {
         this.setState({ cargandoBusqueda: true });
      } else {
         this.setState({ cargandoBusqueda: false });
      }
      console.log('localization', this.localizacionInicial.coords);
      let response = await fetch(
         URLAUTOCOMPLETE +
         '' +
         search +
         '&location=' +
         this.localizacionInicial.coords.latitude +
         ',' +
         this.localizacionInicial.coords.longitude +
         '&strictbouds&radius=' +
         RADIO +
         '&components=country:' +
         PAIS +
         '&key=' +
         APIKEY +
         '&sessiontoken=' +
         this.sessionToken
      );
      let trama = await response.json();
      let tramaPredicciones = trama.predictions;
      let direccionPredicciones = [];

      for (let i = 0; i < tramaPredicciones.length; i++) {
         let direccion = {};
         direccion.descripcion = tramaPredicciones[i].description;
         direccion.placeId = tramaPredicciones[i].place_id;
         direccionPredicciones.push(direccion);
      }

      this.setState({ listaPredicciones: direccionPredicciones });
   };

   buscarCoordenadas = async (placeId, descripcion) => {
      let response = await fetch(URLPLACEID + '' + placeId + '&key=' + APIKEY);
      let trama = await response.json();
      let coordenadas = await trama.results[0].geometry.location;
      console.log('coordenadas', coordenadas);
      if (this.pantallaOrigen == 'ConfirmarCompra') {
         this.guardarDireccion(descripcion, coordenadas)
      } else {
         this.props.navigation.navigate('Mapa', {
            origen: 'nuevo',
            coordenadasBusqueda: coordenadas,
            pantallaOrigen: this.pantallaOrigen,
         });
      }
      this.sessionToken = 0;
   };


   guardarDireccion = async (descripcion, coordenadas) => {
      let servDireccion = new ServicioDirecciones();

      this.validar(coordenadas.lat, coordenadas.lng);
      let nuevaDireccion = {
         descripcion: descripcion,
         latitud: coordenadas.lat,
         longitud: coordenadas.lng,
         tieneCoberturaDireccion: this.tieneCoberturaDireccion,
         alias: '',
         referencia: '',
         principal: 'N'

      };

      let idDireccionCreada = await servDireccion.crear(
         global.usuario,
         nuevaDireccion
      );
      // console.log('idDireccionCreada', idDireccionCreada);
      this.idDireccion = idDireccionCreada;
      console.log('idDireccion NME', this.idDireccion);
      if (this.idDireccion != undefined) {
         nuevaDireccion.id = this.idDireccion;
         global.direccionPedido = nuevaDireccion;
         if (this.pantallaOrigen == 'ConfirmarCompra') {
            this.props.navigation.navigate('MapaDirecciones', {
               origen: 'busquedaDirecciones',
               direccion: nuevaDireccion,
            });
         }

      }
      //this.props.navigation.navigate('Direcciones');
   };
   //Guardar Direcciones
   validar = (lat, long) => {
      let lat1 = lat;
      let log1 = long;
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

   render() {
      return (
         <View style={styles.contenedorPagina}>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 25, 'normal')}>
                  Busqueda
               </Text>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}>
                  Direcciones
               </Text>
            </View>

            <SearchBar
               placeholder="Ingrese la Dirección..."
               onChangeText={this.updateSearch}
               value={this.state.search}
               showLoading={this.state.cargandoBusqueda}
               containerStyle={{
                  marginHorizontal: 20,
                  borderWidth: 0,
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  backgroundColor: colores.colorPrimarioVerde,
               }}
               inputContainerStyle={{
                  backgroundColor: 'white',
                  borderRadius: 15,
               }}
               inputStyle={{ fontSize: 15 }}
            />
            <View style={styles.pie}>
               {this.state.cargandoBusqueda ? (
                  <View style={styles.contenderLista}>
                     <FlatList
                        data={this.state.listaPredicciones}
                        renderItem={objeto => {
                           return (
                              <ItemPrediccion
                                 prediccionItem={objeto.item}
                                 fnbuscarCoordenadas={this.buscarCoordenadas}
                              />
                           );
                        }}
                        ItemSeparatorComponent={flatListItemSeparator}
                        keyExtractor={prediccion => {
                           return prediccion.placeId;
                        }}
                     />
                  </View>
               ) : (
                     <View style={styles.contenedorTextoVacio}>
                        <Text style={{ textAlign: 'center', fontSize: 15 }}>
                           Coloque en el cuadro de busqueda la dirección que desea
                           encontrar.
                     </Text>
                     </View>
                  )}
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
               backgroundColor: colores.colorClaroPrimario,

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
      paddingTop: 50,
   },
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 40,
      paddingVertical: 10,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      marginTop: 30,
   },
   estiloContenedor1: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   estiloInputContenedor: {
      padding: 0,
      height: 40,
   },
   estiloInput: { fontSize: 15 },
   btnStyles: {
      marginTop: 50,
      width: '100%',
      height: 40,
   },
   btnGuardar: {
      paddingHorizontal: 40,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 25,
   },
   contenderLista: { marginTop: 15 },
   contenedorTextoVacio: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      marginBottom: 60,
   },
});
