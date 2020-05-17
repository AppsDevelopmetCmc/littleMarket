import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import { ServicioParametros } from '../../servicios/ServicioParametros';
import { ItemDireccion } from './compnentes/ItemDireccion';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importacion de mensajes en la aplicacion label y text
import * as msg from '../../constants/Mensajes';

//Importacion de los colores
import * as colores from '../../constants/Colores';
import Separador from '../../components/Separador';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

export class Direcciones extends Component {
   constructor(props) {
      super(props);
      const { navigation } = props;
      if (this.props.route.params != null) {
         this.notienecobertura = this.props.route.params.notienecobertura;
      }
      this.localizacionActual = [];
      let direcciones = [];
      this.state = {
         listaDirecciones: direcciones,
      };
   }

   componentDidMount() {
      if (global.usuario == null) {
         let user = firebase.auth().currentUser;
         if (user) {
            global.usuario = user.email;
            global.infoUsuario = user.providerData[0];
         }
      }
      let srvDirecciones = new ServicioDirecciones();
      let direcciones = [];
      srvDirecciones.registrarEscuchaDireccionesTodas(
         direcciones,
         this.repintarLista,
         global.usuario
      );

      this.obtenerCoordenadas();
      //  this.notienecobertura=this.props.route.params.notienecobertura1
      if (this.notienecobertura == 'N') {
         Alert.alert("No existe Cobertura para la Direccion ")
      }

   }

   obtenerCoordenadas = async () => {
      Geocoder.init(APIKEY);
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
         setErrorMsg('Error al otorgar el permiso');
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('actual location:', location);
      this.localizacionActual = location;
   }

   obtenerUbicacionActual = () => {
      this.props.navigation.navigate(
         'Mapa',
         {
            origen: 'actual',
            coordenadasActuales: this.localizacionActual,
            pantallaOrigen: 'Direcciones'
         }
      );

   }

   actualizar = direccion => {
      this.props.navigation.navigate('Mapa', {
         origen: 'actualizar',
         direccion: direccion,
         pantallaOrigen: 'Direcciones'
      });
   };
   eliminar = idDireccion => {
      let servDirecciones = new ServicioDirecciones();
      servDirecciones.eliminar(global.usuario, idDireccion);
   };

   repintarLista = direcciones => {
      //  this.validarCoberturaGlobalDireccion();
      this.setState({
         listaDirecciones: direcciones,
      });
   };

   validarCoberturaGlobalDireccion = async () => {
      let servDirecciones = new ServicioDirecciones();
      let coberturaDireccion = await servDirecciones.getValidarCoberturaGlobal(
         global.usuario
      );
      if (coberturaDireccion == true) {
         global.activarCobertura(true);
      } else {
         Alert.alert('Ninguna de las Direcciones Ingresadas tiene Cobertura');
      }
   };

   render() {
      return (
         <SafeAreaView style={styles.container}>
            <View style={styles.cabeceraApp}>
               <Text style={textEstilo(colores.colorBlancoTexto, 24, 'bold')}>
                  {msg.msg1}
               </Text>
            </View>

            <View style={styles.pie}>
               <Text style={textEstilo(colores.colorOscuroTexto, 14, 'normal')}>
                  {msg.msg2}
               </Text>
               <View style={styles.boton}>
                  <Button
                     buttonStyle={styles.estiloBotonBlanco}
                     titleStyle={textEstilo(
                        colores.colorOscuroTexto,
                        13,
                        'bold'
                     )}
                     containerStyle={styles.estiloContenedor}
                     title="Agregar ubicación actual"
                     onPress={() => {
                        this.obtenerUbicacionActual();
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
                     titleStyle={textEstilo(
                        colores.colorOscuroTexto,
                        13,
                        'bold'
                     )}
                     containerStyle={styles.estiloContenedor}
                     title="Agregar nueva ubicación"
                     onPress={() => {
                        this.props.navigation.navigate(
                           'BusquedaDireccionesScreen',
                           {
                              origen: 'nuevo',
                              pantallaOrigen: 'Direcciones'
                           }
                        );
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
                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 13, 'bold'),
                        styles.estiloContenedorTitulo,
                     ]}
                  >
                     Mis Direcciones
                  </Text>
               </View>
               <View style={styles.lista}>
                  <FlatList
                     data={this.state.listaDirecciones}
                     renderItem={objeto => {
                        return (
                           <ItemDireccion
                              direccion={objeto.item}
                              fnActualizar={this.actualizar}
                              fnEliminar={this.eliminar}
                           />
                        );
                     }}
                     keyExtractor={objetoCombo => {
                        return objetoCombo.id;
                     }}
                     ItemSeparatorComponent={flatListItemSeparator}
                  />
               </View>

            </View>
         </SafeAreaView>
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
   contenedorTituloSubr: {
      borderBottomColor: colores.colorOscuroTexto,
      borderBottomWidth: 1,
   },

   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },

   estiloContenedorTitulo: {
      paddingBottom: 10,
   },
   boton: {
      alignItems: 'center',
      paddingBottom: 30,
      paddingTop: 30,
   },
   btnViewContinuar: {
      flex: 1,
      alignItems: 'flex-end',
      flexDirection: 'row',
   },
   estiloBotonBlanco: {
      backgroundColor: colores.colorBlanco,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   btnContinuar: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 200,
      height: 45,
      borderRadius: 25,
      marginBottom: 50,
   },
   cabeceraApp: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 20,
      paddingTop: 30,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 20,
      marginTop: 30,
      paddingTop: 30,
   },
   estiloContenedor: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   iconos: { marginRight: 10 },
});