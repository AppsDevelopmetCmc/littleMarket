import React, { useRef } from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   Text,
   Image,
   SafeAreaView,
} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';

// Importacion de Toas
import Toast from 'react-native-easy-toast';

// Importacion del formulario Registro
import RegistroForm from '../account/form/RegistroForm';

//Importacion de los colores
import * as colores from '../../constants/Colores';

export default function Registro({ navigation }) {
   // Inicializacion de la referencia con hoock para utilizarlo con toast
   const toastRef = useRef();

   return (
      <SafeAreaView style={styles.contenedorPagina}>
         <View style={styles.cabecera}>
            <Text style={textEstilo(colores.colorBlanco, 18, 'normal')}>
               Bienvenido
            </Text>
            <Text style={textEstilo(colores.colorBlanco, 25, 'bold')}>
               Regitrase
            </Text>
         </View>

         <View style={styles.pie}>
            <RegistroForm nav={navigation} toastRef={toastRef}></RegistroForm>
         </View>

         {/* Creación de toast con utilizacion de hook de react useRef -- (toastRef) */}
         <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
      </SafeAreaView>
   );
}

// Funcion para modificar color tamaño y tipo de letra
const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 40,
      paddingTop: 30,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      marginTop: 30,
   },
   logo: { width: '100%', height: 150, marginTop: 60 },
   textRegistro: { marginTop: 15, marginEnd: 10, marginRight: 10 },
   divide: {
      backgroundColor: '#000',
      width: '42%',
      height: 1,
   },
});
