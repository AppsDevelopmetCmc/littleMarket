import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import * as colores from '../../constants/Colores';

import WebView from 'react-native-webview';

export class TerminosCondiciones extends Component {
   constructor(props) {
      super(props);
      console.log('Props de la pantalla de Terminos y Condiciones', props);
      this.state = {
         checked: false,
      };
   }
   actualizaEstadoChekeo = () => {
      console.log('Ingreso a chekear');
      this.setState({ checked: !this.state.checked });
   };

   render() {
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
                     title="He leído y acepto los términos y condiciones"
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
                     this.props.route.params.fnAceptar();
                     this.props.navigation.goBack();
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
