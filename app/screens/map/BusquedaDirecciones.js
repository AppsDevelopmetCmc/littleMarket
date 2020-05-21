import { SearchBar } from 'react-native-elements';
import React, { Component } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
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

export class BusquedaDirecciones extends Component {
   constructor(props) {
      super(props);
      this.origen = this.props.route.params.origen;
      this.pantallaOrigen = this.props.route.params.pantallaOrigen;
      this.localizacionInicial = [];
      this.state = {
         search: '',
         listaPredicciones: [],
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

   buscarCoordenadas = async placeId => {
      let response = await fetch(URLPLACEID + '' + placeId + '&key=' + APIKEY);
      let trama = await response.json();
      let coordenadas = await trama.results[0].geometry.location;
      console.log('coordenadas', coordenadas);
      this.props.navigation.navigate('Mapa', {
         origen: 'nuevo',
         coordenadasBusqueda: coordenadas,
         pantallaOrigen: this.pantallaOrigen,
      });
      this.sessionToken = 0;
   };

   render() {
      return (
         <View>
            <SearchBar
               placeholder="Ingrese la Dirección..."
               onChangeText={this.updateSearch}
               value={this.state.search}
               containerStyle={{
                  backgroundColor: colores.colorPrimarioVerde,
                  borderWidth: 0,
               }}
               inputContainerStyle={{
                  backgroundColor: 'white',
                  borderWidth: 0,
               }}
            />
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
