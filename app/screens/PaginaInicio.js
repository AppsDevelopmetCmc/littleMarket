import React from 'react';
import { View, StyleSheet, ImageBackground, Image, Text } from 'react-native';
import { Button } from 'react-native-elements';
import * as colores from '../constants/Colores';

export default function PaginaIncio(props) {
   const { navigation } = props;

   return (
      <View style={styles.container}>
         <ImageBackground
            source={require('../../assets/Splash.png')}
            style={styles.imgInicio}
         >
            <View style={{ flex: 4 }}></View>
            <View style={styles.containerRow}>
               <Button
                  title="Iniciar Sesión"
                  buttonStyle={styles.estiloBoton}
                  titleStyle={styles.estiloTitulo}
                  onPress={() => {
                     navigation.navigate('IniciaSesion');
                  }}
               ></Button>
               <Button
                  title="Regístrate"
                  buttonStyle={styles.estiloBoton}
                  titleStyle={styles.estiloTitulo}
                  onPress={() => {
                     navigation.navigate('Registro');
                  }}
               ></Button>
            </View>
            <View
               style={{
                  //width: 10,
                  //height: 50,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  //borderRadius: 10,
                  //padding: 30,
                  //borderWidth: 2,
                  //borderColor: 'black',
               }}
            >
               <Text
                  style={{
                     color: 'gray',
                     fontSize: 13,
                     //backgroundColor: 'white',
                  }}
               >
                  Build: {global.version}
               </Text>
            </View>
         </ImageBackground>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
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
});
