import React, { useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image } from 'react-native';

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
            <View>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'normal')}>
                  Bienvenido
               </Text>
               <Text style={textEstilo(colores.colorBlancoTexto, 25, 'bold')}>
                  Registro
               </Text>
            </View>

            <Image
               source={require('../../../assets/img/LogoBlanco.png')}
            ></Image>
         </View>

         <View style={styles.pie}>
            <RegistroForm nav={navigation} toastRef={toastRef}></RegistroForm>
         </View>

         {/* Creación de toast con utilizacion de hook de react useRef -- (toastRef) */}
         <Toast
            ref={toastRef}
            position="center"
            opacity={0.8}
            fadeInDuration={800}
            fadeOutDuration={1000}
         ></Toast>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      marginTop: 30,
   },
   textRegistro: { marginTop: 15, marginEnd: 10, marginRight: 10 },
   divide: {
      backgroundColor: '#000',
      width: '42%',
      height: 1,
   },
});
