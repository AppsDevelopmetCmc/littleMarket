import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import { ItemFactura } from '../facturacion/componentes/ItemFactura';
import { ServicioFacturas } from '../../servicios/ServicioFacturas';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableHighlight } from 'react-native-gesture-handler';

// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import {
   recuperarPrincipal,
   ServicioDirecciones,
} from '../../servicios/ServicioDirecciones';

//Importando los colores
import * as colores from '../../constants/Colores';
import { ItemDireccionSeleccion } from '../map/compnentes/ItemDireccionSeleccion';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

import * as Permisos from 'expo-permissions';
import { Notificaciones } from 'expo';

import { PopupCalificaciones } from '../calificacion/PopupCalificaciones';
import { SeleccionarDireccion } from '../direcciones/SeleccionarDireccion';
import Separador from '../../components/Separador';
/*const getToken= async()=>{
   const{status}= await Permisos.getAsync(Permisos.NOTIFICATIONS);
   if(status !== "granted"){
      return;
   }
   const token = await Notificaciones.getExpoPushTokenAsync();
   console.log(token);
   return token;

}*/

export class ListarDatosFacturacion extends Component {
   constructor(props) {
      super(props);
      let facturas = [];
      let direcciones = [];
      if (this.props.route.params != null) {
         this.notienecobertura = this.props.route.params.notienecobertura;
      }
      this.state = {
         listFacturas: facturas,
         listaDireccionesCobertura: direcciones,
         mostrarModalDirecciones: false,
         direccionPedido: null,
         pedidoCalifica: {},
         estadocalifica: false,
      };

      let srvFacturas = new ServicioFacturas();
      srvFacturas.recuperarFacturas(this.repintarLista);
   }

   cambioVisibleCalifica = visible => {
      this.setState({ estadocalifica: visible });
   };

   componentDidMount() {}

   eliminarfactura = id => {
      let srvFacturas = new ServicioFacturas();
      srvFacturas.eliminarFactura(id);
      this.refrescarLista();
   };

   repintarLista = facturas => {
      this.setState({
         listFacturas: facturas,
      });
   };

   refrescarLista = () => {
      let srvFacturas = new ServicioFacturas();
      srvFacturas.recuperarFacturas(this.repintarLista);
   };

   render() {
      const { navigation } = this.props;

      return (
         <SafeAreaView style={styles.container}>
            <CabeceraPersonalizada
               iconoComponente={
                  <Icon
                     name="arrow-left"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={24}
                     onPress={() => {
                        navigation.goBack();
                     }}
                  />
               }
            ></CabeceraPersonalizada>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 22, 'bold')}>
                  Mis facturas
               </Text>
            </View>

            <View style={styles.pie}>
               <View>
                  <TouchableHighlight
                     underlayColor="white"
                     onPress={() => {
                        this.props.navigation.navigate(
                           'DatosFacturacionScreen',
                           { refrescar: this.refrescarLista }
                        );
                     }}
                  >
                     <View style={styles.containerNuevo}>
                        <Icon
                           name="plus-circle"
                           size={25}
                           color={colores.colorPrimarioTomate}
                        />
                        <Separador alto={5}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              15,
                              'bold'
                           )}
                        >
                           Agregar nueva factura
                        </Text>
                     </View>
                  </TouchableHighlight>
               </View>
               <View style={{ marginBottom: 20 }}>
                  <View
                     style={{
                        height: 1,
                        backgroundColor: colores.colorClaroPrimario,
                     }}
                  ></View>
               </View>
               <View style={styles.lista}>
                  <FlatList
                     data={this.state.listFacturas}
                     renderItem={objeto => {
                        return (
                           <ItemFactura
                              nav={this.props.navigation}
                              factura={objeto.item}
                              fnEliminarFactura={this.eliminarfactura}
                              refrescar={this.refrescarLista}
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
      justifyContent: 'center',
      alignItems: 'stretch',
      marginTop: 10,
   },
   modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
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
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 40,
      paddingTop: 5,
   },
   lista: {},
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
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 20,
      marginTop: 30,
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
   iconos: { marginRight: 0 },
   containerNuevo: {
      flexDirection: 'row',
      paddingHorizontal: 7,
      paddingVertical: 30,
      alignItems: 'center',
   },
});
