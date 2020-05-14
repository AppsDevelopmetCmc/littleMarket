import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import { ItemCombo } from '../combos/componentes/ItemCombo';
import { ServicioCombos } from '../../servicios/ServicioCombos';
import { CheckBox  } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';

// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import {
   recuperarPrincipal,
   ServicioDirecciones,
} from '../../servicios/ServicioDirecciones';

//Importando los colores
import * as colores from '../../constants/Colores';
import { ItemDireccionSeleccion } from '../map/compnentes/ItemDireccionSeleccion'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

export class ListCombo extends Component {
   constructor(props) {
      super(props);
      let combos = [];
      let direcciones = [];
      if (this.props.route.params != null) {
         this.notienecobertura = this.props.route.params.notienecobertura;
      }
      this.state = {
         listCombos: combos,
         listaDireccionesCobertura: direcciones,
         mostrarModalDirecciones: false,
         direccionPedido: null,
      };


   }

   componentDidMount() {
      let srvCombos = new ServicioCombos();
      let combos = [];
      srvCombos.registrarEscuchaTodas(combos, this.repintarLista);
      this.obtenerCoordenadas();
      //  this.notienecobertura=this.props.route.params.notienecobertura1
      if (this.notienecobertura == 'N') {
         Alert.alert("No existe Cobertura para la Direccion ")
      }
      new ServicioDirecciones().recuperarPrincipal(
         global.usuario,
         this.refrescarDireccion
      );
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
            pantallaOrigen: 'lsCombo'
         }
      );
      this.setState({mostrarModalDirecciones:false});

   }


   repintarLista = combos => {
      global.combos = combos
      this.setState({
         listCombos: combos,
      });
   };

   abrirDrawer = () => {
      this.props.navigation.openDrawer();
   };

   abrirCarrito = () => {
      this.props.navigation.navigate('CarroComprasScreen');
   };

   recuperarCobertura = () => {
      let servDirecciones = new ServicioDirecciones();
      servDirecciones.getTieneCobertura(global.usuario, this.repintarDireccion)
   }

   repintarDireccion = direcciones => {
      this.setState({
         listaDireccionesCobertura: direcciones,
         mostrarModalDirecciones: true
      });
   };

   seleccionarDireccion = (direccion) => {
      global.direccionPedido = direccion;
      this.refrescarDireccion();
   }

   refrescarDireccion = () => {
      this.setState({
         direccionPedido: global.direccionPedido.descripcion,
         mostrarModalDirecciones: false
      });
   };

   render() {
      return (
         <SafeAreaView style={styles.container}>
            <CabeceraPersonalizada
               titulo={'Yappando'}
               iconoComponente={
                  <Icon
                     name="menu"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirDrawer}
                  />
               }
               iconoDeTienda={
                  <Icon
                     name="cart"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirCarrito}
                     underlayColor={colores.colorPrimarioVerde}
                  />
               }
            ></CabeceraPersonalizada>
            <View >
               <Button buttonStyle={styles.estiloBotonVerde}
                  titleStyle={textEstilo(
                     colores.colorOscuroTexto,
                     13,
                     'bold'
                  )}
                  containerStyle={styles.estiloContenedor}
                  title="Cambiar de  Dirección" onPress={() => {
                     this.recuperarCobertura();
                  }

                  }
                  icon={
                     <Icon
                        name="map-marker"
                        size={20}
                        color={colores.colorPrimarioTomate}
                        style={styles.iconos}
                     />
                  } />
            </View>
            <View style={styles.contenedorDireccione}>
               <Text>{this.state.direccionPedido}</Text>
            </View>

            <Modal
               animationType="slide"
               transparent={true}
               visible={this.state.mostrarModalDirecciones}>
               <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                     <View style={styles.boton}>
                        <Button
                           buttonStyle={styles.estiloBotonBlanco}
                           titleStyle={textEstilo(
                              colores.colorOscuroTexto,
                              13,
                              'bold'
                           )}
                           containerStyle={styles.estiloContenedor}
                           title="Usar una nueva ubicación"
                           onPress={() => {
                              this.props.navigation.navigate(
                                 'BusquedaDireccionesScreen',
                                 {
                                    origen: 'nuevo',
                                    pantallaOrigen: 'lsCombo'
                                 }
                              );
                              this.setState({ mostrarModalDirecciones: false })
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
                        <Button
                           buttonStyle={styles.estiloBotonBlanco}
                           titleStyle={textEstilo(
                              colores.colorOscuroTexto,
                              13,
                              'bold'
                           )}
                           containerStyle={styles.estiloContenedor}
                           title="Usar ubicación actual"
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
                     <View >
                        <FlatList
                           data={this.state.listaDireccionesCobertura}
                           renderItem={objeto => {
                              return (
                                 <ItemDireccionSeleccion
                                    direccion={objeto.item}
                                    fnSelecionar={this.seleccionarDireccion}
                                 />
                              );
                           }}
                           keyExtractor={objetoCombo => {
                              return objetoCombo.id;
                           }}
                           ItemSeparatorComponent={flatListItemSeparator}
                        />
                     </View>
                     <View style={{ marginTop: 20 }}>
                        <Button title='Cancelar'
                           onPress={() => {
                              this.setState({ mostrarModalDirecciones: false })
                           }

                           }
                        />
                     </View>
                  </View>
               </View>
            </Modal>

            <View style={styles.pie}>
               <View style={styles.lista}>
                  <FlatList
                     data={this.state.listCombos}
                     renderItem={objeto => {
                        return (
                           <ItemCombo
                              nav={this.props.navigation}
                              combo={objeto.item}
                           />
                        );
                     }}
                     keyExtractor={objetoCombo => {
                        return objetoCombo.id;
                     }}
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
   centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "stretch",
      marginTop: 10,
   },
   modalView: {
      margin: 20,
      backgroundColor: colores.colorPrimarioAmarillo,
      borderRadius: 20,
      padding: 35,
      alignItems: "stretch",
      shadowColor: "#000",
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
      marginHorizontal: 30,
      backgroundColor: colores.colorBlanco,
      height: 30,
      borderRadius: 20,
      marginTop: 15,
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
   },
   estiloBotonBlanco: {
      backgroundColor: colores.colorPrimarioAmarillo,
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
   estiloContenedor: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   iconos: { marginRight: 10 },

});