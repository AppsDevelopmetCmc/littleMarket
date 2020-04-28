//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';

// Importación de los colores
import * as colores from '../../constants/Colores';

// Importación validacioón de correo
import { validateEmail } from '../../utils/Validaciones';

// Imnportación del componente creado Cargando
import Cargando from '../../components/Cargando';

// Importacion a Firebase
import * as firebase from 'firebase';

export default function RecuperarCuenta() {
   // Seteo de variables en el state con hoock de react
   const [correo, setCorreo] = useState('');
   const [isVisibleLoading, setisVisibleLoading] = useState(false);

   //Funcion que envia el correo
   const envioCorreo = async () => {
      setisVisibleLoading(true);
      if (!correo) {
         console.log('Correo requerido');
      } else {
         if (!validateEmail(correo)) {
            console.log('correo no es correcto');
         } else {
            await firebase
               .auth()
               .sendPasswordResetEmail(correo)
               .then(function (user) {
                  console.log('envio de correo correcto');
               })
               .catch(function (e) {
                  console.log('error envio de correo', e);
               });
         }
      }
      setisVisibleLoading(false);
   };

   return (
      <SafeAreaView style={styles.contenedorPagina}>
         <View style={styles.cabecera}>
            <Text style={textEstilo(colores.whiteColor, 25, 'bold')}>
               Recuperar Cuenta
            </Text>
         </View>
         <View style={styles.pie}>
            <Input
               placeholder="yappando@gmail.com"
               containerStyle={styles.estiloContenedor1}
               inputContainerStyle={styles.estiloInputContenedor}
               inputStyle={styles.estiloInput}
               label="Correo *"
               labelStyle={textEstilo('#333333', 15, 'normal')}
               onChange={e => setCorreo(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
               rightIcon={
                  <Icon
                     type="material-community"
                     name="at"
                     iconStyle={styles.iconRight}
                  ></Icon>
               }
            ></Input>
            <Button
               title="Recuperar Contraseña"
               titleStyle={textEstilo(colores.whiteColor, 15, 'bold')}
               containerStyle={styles.btnStyles}
               buttonStyle={styles.btnRegistrarse}
               onPress={envioCorreo}
            ></Button>
         </View>
         <Cargando
            text="Enviando correo"
            isVisible={isVisibleLoading}
         ></Cargando>
      </SafeAreaView>
   );
}

const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

// Define los estilos de la pantalla
const styles = StyleSheet.create({
   contenedorPagina: { flex: 1, backgroundColor: colores.primaryColor },
   cabecera: {
      backgroundColor: colores.primaryColor,
      paddingHorizontal: 40,
      paddingTop: 30,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.whiteColor,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      marginTop: 30,
      padding: 100,
   },
   logo: { width: '100%', height: 150, marginTop: 60 },
   textRegistro: { marginTop: 15, marginEnd: 10, marginRight: 10 },
   divide: {
      backgroundColor: '#000',
      width: '42%',
      height: 1,
   },
   estiloContenedor1: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   estiloInputContenedor: {
      padding: 0,
      height: 40,
   },
   estiloInput: { fontSize: 15 },
   iconRight: { color: '#c1c1c1' },
   btnStyles: {
      marginTop: 50,
      width: '100%',
      height: 40,
   },
   btnRegistrarse: {
      padding: 10,
      backgroundColor: colores.primaryColor,
      borderRadius: 10,
   },
});
