import React from 'react';
import {
   View,
   Text,
   StyleSheet,
   Image,
   SafeAreaView,
   useColorScheme,
} from 'react-native';
import { Button } from 'react-native-elements';
import * as colores from '../constants/Colores';

export default function PaginaIncio(props) {
   const { navigation } = props;
   return (
      <SafeAreaView style={styles.container}>
         <Image
            source={require('../../assets/img/InicioImg.png')}
            resizeMode="stretch"
            style={styles.imgInicio}
         ></Image>
         <View
            style={[styles.containerRow, { transform: [{ translateY: -50 }] }]}
         >
            <Button
               title="Iniciar Sesión"
               buttonStyle={styles.estiloBoton}
               onPress={() => {
                  navigation.navigate('IniciaSesion');
               }}
            ></Button>
            <Button
               title="Registrate"
               type="outline"
               buttonStyle={styles.estiloBotonRegistro}
               titleStyle={styles.estiloTitulo}
               onPress={() => {
                  navigation.navigate('Registro');
               }}
            ></Button>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      position: 'relative',
   },
   containerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 40,
   },
   imgInicio: { width: '100%' },
   estiloBoton: {
      backgroundColor: colores.primaryColor,
      width: 130,
      height: 45,
   },
   estiloBotonRegistro: {
      borderColor: colores.primaryLightColor,
      width: 130,
      height: 45,
   },
   estiloTitulo: { color: colores.primaryLightColor },
});
