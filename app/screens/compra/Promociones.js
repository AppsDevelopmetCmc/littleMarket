import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   TextInput,
   FlatList,
   Text,
   TouchableHighlight,
} from 'react-native';
import * as colores from '../../constants/Colores';
import { Button, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Separador from '../../components/Separador';

export class Promociones extends Component {
   constructor(props) {
      super(props);
   }
   componentDidMount = () => {
      this.montado = true;
   };
   componentWillUnmount = () => {
      this.montado = false;
   };

   render() {
      return (
         <View style={styles.centeredView}>
            <View style={styles.modalView}>
               <View style={styles.contenido}>
                  <View>
                     <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        ¿Cómo obtener códigos promocionales?
                     </Text>
                     <Separador alto={20}></Separador>
                     <Text style={{ fontSize: 16 }}>
                        1. Te puede llegar directamente a tu buzón de
                        Notificaciones
                     </Text>
                     <Separador alto={20}></Separador>

                     <Text style={{ fontSize: 16 }}>
                        2. En nuestras Redes Sociales
                     </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', marginVertical: 10 }}>
                     <TouchableHighlight
                        underlayColor={colores.colorBlanco}
                        onPress={() => {
                           this.props.cerrar();
                        }}
                     >
                        <View
                           style={{
                              backgroundColor: colores.colorBlanco,
                              padding: 10,
                           }}
                        >
                           <Text
                              style={{
                                 color: colores.colorPrimarioTomate,
                              }}
                           >
                              OK
                           </Text>
                        </View>
                     </TouchableHighlight>
                  </View>
               </View>
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
               backgroundColor: colores.colorOscuroTexto,

               alignItems: 'center',
               justifyContent: 'center',
               alignContent: 'center',
            }}
         ></View>
      </View>
   );
};

const styles = StyleSheet.create({
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.75)',
      paddingVertical: 200,
   },
   modalView: {
      flex: 1,
      margin: 20,
      backgroundColor: colores.colorBlanco,
      borderRadius: 15,
      padding: 30,
      paddingVertical: 10,
      alignItems: 'stretch',
      shadowColor: '#0000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      height: 400,
   },
   contenido: {
      flex: 1,
      paddingVertical: 50,
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
   boton: {
      alignItems: 'stretch',
      paddingVertical: 20,
   },
});
