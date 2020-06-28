import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import * as colores from '../../constants/Colores';
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import { SafeAreaView } from 'react-native-safe-area-context';

export class ResponsabilidadSocial extends Component {
   constructor(props) {
      super(props);
      this.state = {
         navigation: null,
      };
   }
   componentDidMount() {}
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
               <View>
                  <Text
                     style={textEstilo(colores.colorBlancoTexto, 22, 'bold')}
                  >
                     Apoyando a
                  </Text>
                  <Text
                     style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}
                  >
                     Fundación Aliñambi
                  </Text>
               </View>
            </View>
            <ImageBackground
               source={require('../../../assets/Splash.png')}
               style={styles.imgInicio}
            ></ImageBackground>
         </SafeAreaView>
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
      paddingHorizontal: 30,
      paddingVertical: 20,
      // paddingTop: 30,
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
