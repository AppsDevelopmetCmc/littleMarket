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
import { CommonActions } from '@react-navigation/native';
import Cargando from '../../components/Cargando';
import { ServicioSectores } from '../../servicios/ServicioSectores';
export class BusquedaDirecciones extends Component {
   constructor(props) {
      super(props);
      this.origen = this.props.route.params.origen;
      this.pantallaOrigen = this.props.route.params.pantallaOrigen;
      this.localizacionInicial = [];
      //this.tieneCoberturaDireccion = 'N';
      this.idDireccion = '';
      this.tramaSectorNue='';
      this.state = {
         search: '',
         listaPredicciones: [],
         cargandoBusqueda: false,
         creandoPunto: false,
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
      this.setState({ cargandoBusqueda: false });

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
         this.guardarDireccion(descripcion, coordenadas);
      } else {
         this.props.navigation.navigate('Mapa', {
            origen: 'nuevo',
            coordenadasBusqueda: coordenadas,
            pantallaOrigen: this.pantallaOrigen,
         });
      }
      this.sessionToken = 0;
   };

   asignarSector = async (latAct, longAct) => {
      let srvSector = new ServicioSectores();
      console.log("LATITUD NUEVA" + latAct);
      console.log("LONGITUD NUEVA" + longAct);
      this.tramaSectorNue = await srvSector.consultarSector(latAct, longAct);
      global.sector = this.tramaSectorNue.sector;
      console.log("SECTOR NUEVA------->" +this.tramaSectorNue.sector);
      if (!this.tramaSectorNue.sector) {
         Alert.alert(
            'Lo Sentimos',
            'Al momento no tenemos cobertura en este sector, pronto estaremos contigo'
         );
      }

   }

   //TODO: MODAL
   guardarDireccion = async (descripcion, coordenadas) => {
      let servDireccion = new ServicioDirecciones();
      //this.validar(coordenadas.lat, coordenadas.lng);
      await this.asignarSector(coordenadas.lat, coordenadas.lng);

      let nuevaDireccion = {
         descripcion: descripcion,
         latitud: coordenadas.lat,
         longitud: coordenadas.lng,
         //tieneCoberturaDireccion: this.tramaSectorNue.sector ? 'S' : 'N',
         alias: '',
         referencia: '',
         principal: 'N',
         sector: this.tramaSectorNue.sector ? this.tramaSectorNue.sector : ''
      };
      this.setState({ creandoPunto: true });
      let idDireccionCreada = await servDireccion.crear(
         global.usuario,
         nuevaDireccion
      );
      this.setState({ creandoPunto: false });

      // console.log('idDireccionCreada', idDireccionCreada);
      this.idDireccion = idDireccionCreada;
      console.log('idDireccion NME', this.idDireccion);
      if (this.idDireccion != undefined) {
         nuevaDireccion.id = this.idDireccion;
         global.direccionPedido = nuevaDireccion;
         if (this.pantallaOrigen == 'ConfirmarCompra') {
            this.props.navigation.dispatch(state => {
               // Remove the home route from the stack
               const routes = state.routes.filter(
                  r => r.name !== 'BusquedaDireccionesScreen'
               );

               return CommonActions.reset({
                  ...state,
                  routes,
                  index: routes.length - 1,
               });
            });

            this.props.navigation.navigate('MapaDirecciones', {
               origen: 'busquedaDirecciones',
               direccion: nuevaDireccion,
            });
         }
      }
      //this.props.navigation.navigate('Direcciones');
   };

   render() {
      return (
         <View style={styles.contenedorPagina}>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 25, 'normal')}>
                  Búsqueda
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
               {this.state.search ? (
                  this.state.listaPredicciones.length > 0 ? (
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
                           No existen coincidencias
                        </Text>
                     </View>
                  )
               ) : (
                  <View style={styles.contenedorTextoVacio}>
                     <Text style={{ textAlign: 'center', fontSize: 15 }}>
                        Coloque en el cuadro de busqueda la dirección que desea
                        encontrar.
                     </Text>
                  </View>
               )}
            </View>
            <Cargando
               isVisible={this.state.creandoPunto}
               text="Ubicando Coordenadas..."
               //color={colores.colorOscuroPrimarioTomate}
            ></Cargando>
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
