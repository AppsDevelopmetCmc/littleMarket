import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   TextInput,
   FlatList,
   Text,
   SafeAreaView,
} from 'react-native';
import * as colores from '../../constants/Colores';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

import { ItemDireccionSeleccion } from '../map/compnentes/ItemDireccionSeleccion';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

export class SeleccionarDireccion extends Component {
   constructor(props) {
      super(props);
      this.state = {
         listaDireccionesCobertura: [],
      };
      this.montado = false;
   }
   componentDidMount = () => {
      this.montado = true;
      new ServicioDirecciones().registrarEscuchaDireccion(
         global.usuario,
         this.repintarLista
      );
      if (global.direcciones) this.repintarLista();
   };
   componentWillUnmount = () => {
      this.montado = false;
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
         coordenadasActuales: null,
         pantallaOrigen: 'lsCombo',
      });
   };

   recuperarCoordenadas = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
         Alert.alert('Error al otorgar el permiso');
         return;
      }

      let location = await Location.getCurrentPositionAsync({});
      global.localizacionActual = location;
   };
   repintarLista = () => {
      if (this.montado) {
         console.log('repinta lista direcciones:', global.direcciones);
         this.setState({ listaDireccionesCobertura: global.direcciones });
      }
   };
   render() {
      return (
         <View style={styles.centeredView}>
            <View style={styles.modalView}>
               <Text>Seleccione una dirección o agregue una nueva.</Text>
               <View style={styles.boton}>
                  <Button
                     buttonStyle={styles.estiloBotonBlanco}
                     titleStyle={styles.textoNormal}
                     containerStyle={styles.estiloContenedor}
                     title="Agregar ubicación actual"
                     onPress={() => {
                        this.obtenerUbicacionActual();
                        this.props.mostrarModal(false);
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
                     buttonStyle={styles.estiloBotonBlanco}
                     titleStyle={styles.textoNormal}
                     containerStyle={styles.estiloContenedor}
                     title="Agregar nueva ubicación"
                     onPress={() => {
                        this.props.navigation.navigate(
                           'BusquedaDireccionesScreen',
                           {
                              origen: 'nuevo',
                              pantallaOrigen: 'lsCombo',
                           }
                        );
                        this.props.mostrarModal(false);
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
                  <Text style={styles.textoTitulo}>Mis Direcciones</Text>
               </View>
               <View style={{ flex: 1 }}>
                  <FlatList
                     data={this.state.listaDireccionesCobertura}
                     renderItem={objeto => {
                        return (
                           <ItemDireccionSeleccion
                              direccion={objeto.item}
                              fnSeleccionar={this.props.fnSeleccionar}
                           />
                        );
                     }}
                     keyExtractor={direccion => {
                        return direccion.id;
                     }}
                     ItemSeparatorComponent={flatListItemSeparator}
                  />
               </View>
               <View style={{ marginTop: 20 }}>
                  <Button
                     title="Cancelar"
                     onPress={() => {
                        this.props.mostrarModal(false);
                     }}
                     buttonStyle={styles.estiloBotonNaranja}
                  />
               </View>
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      marginTop: 10,
   },
   modalView: {
      margin: 20,
      //backgroundColor: colores.colorPrimarioAmarillo,
      backgroundColor: colores.colorBlanco,
      borderColor: colores.colorPrimarioAmarillo,
      borderWidth: 2,
      borderRadius: 20,
      padding: 30,
      paddingVertical: 10,
      alignItems: 'stretch',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      height: 400,
   },
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
   },
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
   cabecera: {
      flex: 1,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },
   lista: {
      flex: 15,
   },
   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },

   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
   },
   contenedorDireccione: {
      marginHorizontal: 20,
      backgroundColor: colores.colorBlanco,
      height: 40,
      borderRadius: 10,
      //justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 3,
      flexDirection: 'row',
      // backgroundColor: 'red',
   },
   pie: {
      flex: 3,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      paddingLeft: 10,
      marginTop: 15,
      paddingTop: 20,
   },
   texto: {
      fontSize: 13,
      fontWeight: 'bold',
   },
   estiloContenedorTitulo: {
      paddingBottom: 10,
   },
   contenedorTituloSubr: {
      borderBottomColor: colores.colorOscuroTexto,
      borderBottomWidth: 1,
      paddingTop: 10,
   },
   estiloBotonBlanco: {
      backgroundColor: colores.colorBlanco,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   estiloBotonVerde: {
      backgroundColor: colores.colorPrimarioVerde,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   estiloBotonNaranja: {
      backgroundColor: colores.colorPrimarioTomate,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
   },
   estiloContenedor: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   iconos: { marginRight: 5 },
   textoNormal: {
      color: colores.colorOscuroTexto,
      fontSize: 13,
      //fontWeight: 'bold',
   },
   textoTitulo: {
      color: colores.colorOscuroTexto,
      fontSize: 13,
      fontWeight: 'bold',
   },
});

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
