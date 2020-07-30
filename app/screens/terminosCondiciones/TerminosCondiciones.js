import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   ImageBackground,
   Image,
   Text,
   SafeAreaView,
} from 'react-native';
import { Button, Icon, CheckBox } from 'react-native-elements';
import * as colores from '../../constants/Colores';
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import WebView from 'react-native-webview';
import Cargando from '../../components/Cargando';

export class TerminosCondiciones extends Component {
   constructor(props) {
      super(props);
      console.log('Props de la pantalla de Terminos y Condiciones', props);
      this.state = {
         checked: false,
      };
   }
   componentDidMount() {}

   actualizaEstadoChekeo = () => {
      console.log('Ingreso a chekear');
      this.setState({ checked: !this.state.checked });
   };

   actualizacionTerminos = async () => {
      console.log('ingreso a actualizar');
      await global.db
         .collection('clientes')
         .doc(global.usuario)
         .update({ terminosCondiciones: true })
         .then(() => {
            console.log(
               'Se actualiza los terminos y condiciones para clientes que no tienen el campo'
            );
         })
         .catch(error => {
            console.log(error);
         });
   };

   render() {
      const { navigation } = this.props;
      return (
         <View style={styles.container}>
            <View style={styles.cabecera}>
               <Text style={styles.textTitulos}>Términos y condiciones</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colores.colorBlanco }}>
               <View
                  style={{
                     flex: 1,
                     borderWidth: 1,
                     marginHorizontal: 10,
                     marginVertical: 10,
                     borderRadius: 5,
                     padding: 10,
                     borderColor: colores.colorOscuroPrimarioAmarillo,
                  }}
               >
                  <WebView
                     source={{
                        uri:
                           'https://little-market-dev-377b6.web.app/privacidad.html',
                     }}
                     style={{ marginTop: 20 }}
                  ></WebView>
               </View>

               <View style={styles.contenedorCheck}>
                  <CheckBox
                     title="He leido y acepto los términos y condiciones"
                     checked={this.state.checked}
                     checkedColor={colores.colorPrimarioTomate}
                     onPress={this.actualizaEstadoChekeo}
                  />
               </View>
            </View>
            <View style={styles.contendorBoton}>
               <Button
                  title="ACEPTAR"
                  disabled={!this.state.checked ? true : false}
                  titleStyle={textEstilo(colores.colorBlancoTexto, 15, 'bold')}
                  containerStyle={styles.btnStyles}
                  buttonStyle={styles.btnRegistrarse}
                  onPress={() => {
                     this.actualizacionTerminos();
                     this.props.setMostrarPantallaTC(true);
                  }}
               ></Button>
            </View>
         </View>
      );
   }
}
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
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingVertical: 20,
      justifyContent: 'center',
      alignItems: 'center',
   },
   containerRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 40,
      // backgroundColor: 'blue',
      alignItems: 'center',
   },
   imgInicio: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'flex-end',
      paddingBottom: 100,
      backgroundColor: colores.colorPrimarioVerde,
   },
   contenedorLogo: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
   },
   estiloBoton: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 130,
      height: 45,
      borderRadius: 10,
   },
   estiloTitulo: { color: colores.colorBlancoTexto },
   textTitulos: {
      color: colores.colorBlancoTexto,
      fontSize: 18,
      fontWeight: 'bold',
      paddingTop: 20,
   },
   contenedorCheck: { backgroundColor: colores.colorBlanco },
   contendorBoton: {
      paddingVertical: 25,
      backgroundColor: colores.colorBlanco,
      justifyContent: 'center',
      alignItems: 'center',
   },
   btnStyles: {
      width: '80%',
      height: 40,
   },
   btnRegistrarse: {
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 15,
   },
});
