import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Button } from 'react-native-elements';
import * as colores from '../constants/Colores';

export default function PaginaIncio(props) {
   const { navigation } = props;

   return (
      <View style={styles.container}>
         <ImageBackground
            source={require('../../assets/img/Fondo.png')}
            style={styles.imgInicio}
         >
            <View style={styles.contenedorLogo}>
               <Image
                  source={require('../../assets/img/LogoYappando.png')}
                  width="100%"
               ></Image>
               <Image
                  source={require('../../assets/img/Yappando.png')}
                  width="100%"
               ></Image>
            </View>

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
         </ImageBackground>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colores.colorClaroPrimarioVerde,
   },
   containerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 40,
   },
   imgInicio: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'flex-end',
      paddingBottom: 100,
      backgroundColor: colores.colorClaroPrimarioVerde,
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
