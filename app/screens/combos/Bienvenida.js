import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   TextInput,
   FlatList,
   Text,
   ImageBackground,
   TouchableOpacity,
} from 'react-native';
import * as colores from '../../constants/Colores';
import { Button, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as srvParametros from '../../servicios/ServicioParametros';

export class Bienvenida extends Component {
   constructor(props) {
      super(props);
      // this.imagen = require('../../../app/imagenes/LogoBienvenida.jpeg');
      console.log('Props Bienvenida', props);

      this.state = {
         //  imagen: require('../../../app/imagenes/LogoBienvenida.jpeg'),
         cerrar: '',
      };
   }
   componentDidMount = () => {
      // this.setState({ imagen: this.imagen });
      //  srvParametros.obtenerImagenBienvenida(this.pintarImagen);
      this.montado = true;
      setTimeout(() => {
         this.pintarCerrar();
      }, 2000);
   };
   pintarCerrar = () => {
      this.setState({ cerrar: 'X Cerrar' });
   };
   componentWillUnmount = () => {
      this.montado = false;
   };

   obtenerPedidoCalifica = async mail => {
      //  console.log('mail', mail);
      console.log('Ingreso a recuperar el pedido');
      global.db
         .collection('pedidos')
         .where('mail', '==', mail)
         .where('estado', '==', 'PE')
         .get()
         .then(querySnapshot => {
            let pedido = {};
            querySnapshot.forEach(doc => {
               //   console.log('doc', doc);
               if (doc.exists) {
                  console.log('Pedido Califica:', doc.data());
                  pedido = doc.data();
                  pedido.id = doc.id;
                  this.props.estadocalifica(true);
                  this.props.pedidoCalifica(pedido);
               }
            });
         })
         .catch(error => {
            console.log(error);
         });
   };

   render() {
      /*let imagen =
         Math.random() > 0.5
            ? require('../../imagenes/Bienvenida3.jpeg')
            : require('../../imagenes/Bienvenida5.jpeg');*/
      let imagen = require('../../imagenes/LogoBienvenida.jpeg');
      return (
         <View style={styles.centeredView}>
            <View style={styles.modalView}>
               <ImageBackground
                  style={{
                     flex: 1,
                     resizeMode: 'cover',
                     justifyContent: 'flex-start',
                  }}
                  source={imagen}
               >
                  <View
                     style={{
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        //marginVertical: 10,
                        padding: 10,
                        // backgroundColor: 'blue',
                     }}
                  >
                     <TouchableOpacity
                        underlayColor={colores.colorBlanco}
                        onPress={() => {
                           console.log(
                              'Ingreso a cerrar la ventana de Bienvenida'
                           );
                           this.obtenerPedidoCalifica(global.usuario);
                           this.props.cerrar();
                        }}
                     >
                        <View
                           style={{
                              backgroundColor: 'rgb(138,221,45,0.8)',
                              //width: 10,
                              //height: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                              //borderRadius: 10,
                              //padding: 30,
                              //borderWidth: 2,
                              //borderColor: 'black',
                           }}
                        >
                           <Text
                              style={{
                                 color: 'gray',
                                 fontSize: 16,
                                 backgroundColor: 'white',
                              }}
                           >
                              {this.state.cerrar}
                           </Text>
                        </View>
                     </TouchableOpacity>
                  </View>
               </ImageBackground>
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
      paddingVertical: 50,
   },
   modalView: {
      flex: 1,
      margin: 20,
      backgroundColor: colores.colorBlanco,
      borderRadius: 15,
      //padding: 30,
      //paddingVertical: 10,
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
