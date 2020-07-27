import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';

// Importación de validaciones
import { validateEmail } from '../../../utils/Validaciones';

// Importacion a Firebase
import * as firebase from 'firebase';

// Imnportación del componente creado Cargando
import Cargando from '../../../components/Cargando';

// Importacion de archivo de errores
import * as err from '../../../constants/Errores';

// Importacion de colores
import * as colores from '../../../constants/Colores';

import { Yalert } from '../../../components/Yalert';
export default function IniciaSesionForm(props) {
   const { nav, toastRef } = props;

   // Seteo de variables en el state utilizando hoock de react
   const [hidePassword, setHidePassword] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isVisibleLoading, setisVisibleLoading] = useState(false);
   const [errorMsgCorreo, seterrorMsgCorreo] = useState('');
   const [errorMsgContraseña, seterrorMsgContraseña] = useState('');

   const requerido = 'Campo requerido *';

   const [mostrarYalert, setMostrarYalert] = useState(false);
   const [titulo, setTitulo] = useState(false);
   const [mensaje, setMensaje] = useState(false);

   const iniciarSesion = async () => {
      if (!email || !password) {
         //toastRef.current.show(err.Err3, 600);
         //Alert.alert('Error', err.Err3);
         mostrarError('Información', err.Err3);
         seterrorMsgCorreo(requerido);
         seterrorMsgContraseña(requerido);
      } else {
         seterrorMsgCorreo('');
         seterrorMsgContraseña('');
         if (!validateEmail(email)) {
            //toastRef.current.show(err.Err1, 600);
            mostrarError('Información', err.Err1);
            seterrorMsgCorreo(err.Err1);
         } else {
            if (password.length < 6) {
               seterrorMsgContraseña(err.Err6);
               // toastRef.current.show(err.Err6, 600);
               mostrarError('Información', err.Err6);
            } else {
               seterrorMsgCorreo('');
               seterrorMsgContraseña('');
               firebase.auth().signOut();
               setisVisibleLoading(true);
               await firebase
                  .auth()
                  .signInWithEmailAndPassword(email, password)
                  .then(() => {
                     setisVisibleLoading(false);
                  })
                  .catch(() => {
                     mostrarError('Información', err.Err2);
                     //toastRef.current.show(err.Err2, 600);
                     setisVisibleLoading(false);
                  });
            }
         }
      }
   };
   const mostrarError = (titulo, mensaje) => {
      setMostrarYalert(true);
      setTitulo(titulo);
      setMensaje(mensaje);
   };
   const cerrarYalert = () => {
      setMostrarYalert(false);
   };
   return (
      <View style={styles.container}>
         <Input
            placeholder="yappando@gmail.com"
            containerStyle={styles.estiloContenedor1}
            inputContainerStyle={styles.estiloInputContenedor}
            inputStyle={styles.estiloInput}
            errorMessage={errorMsgCorreo}
            label="Correo *"
            labelStyle={textEstilo(colores.colorPrimarioTexto, 15, 'normal')}
            onChange={e => setEmail(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
            rightIcon={
               <Icon
                  type="material-community"
                  name="at"
                  iconStyle={styles.iconRight}
               ></Icon>
            }
            keyboardType="email-address"
            autoCapitalize="none"
         ></Input>
         <Input
            placeholder="******"
            label="Contraseña *"
            labelStyle={textEstilo(colores.colorPrimarioTexto, 15, 'normal')}
            password={true}
            secureTextEntry={hidePassword}
            containerStyle={styles.estiloContenedor2}
            inputContainerStyle={styles.estiloInputContenedor}
            inputStyle={styles.estiloInput}
            errorMessage={errorMsgContraseña}
            onChange={e => setPassword(e.nativeEvent.text)}
            rightIcon={
               <Icon
                  type="material-community"
                  name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                  iconStyle={styles.iconRight}
                  onPress={() => {
                     setHidePassword(!hidePassword);
                  }}
               ></Icon>
            }
            autoCapitalize="none"
         ></Input>
         <TouchableOpacity
            onPress={() => {
               nav.navigate('RecuperarCuenta');
            }}
         >
            <Text style={styles.estiloTexto}>Olvidaste tu contraseña?</Text>
         </TouchableOpacity>

         <Button
            title="Iniciar Sesión"
            titleStyle={textEstilo(colores.colorBlancoTexto, 15, 'bold')}
            containerStyle={styles.btnStyles}
            buttonStyle={styles.btnRegistrarse}
            onPress={iniciarSesion}
         ></Button>

         <Cargando
            text="Iniciando Sesión"
            isVisible={isVisibleLoading}
         ></Cargando>
         <Yalert
            titulo={titulo}
            mensaje={mensaje}
            visible={mostrarYalert}
            cerrar={cerrarYalert}
         ></Yalert>
      </View>
   );
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
      paddingTop: 50,
   },
   estiloContenedor1: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   estiloContenedor2: {
      width: '100%',
      padding: 0,
      margin: 0,
      marginTop: 25,
   },
   estiloInputContenedor: {
      padding: 0,
      height: 40,
   },
   estiloInput: { fontSize: 15 },
   iconRight: { color: colores.colorClaroTexto },
   btnStyles: {
      marginTop: 50,
      width: '100%',
      height: 40,
   },
   btnRegistrarse: {
      padding: 10,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 15,
   },
   estiloTexto: {
      paddingTop: 15,
      alignSelf: 'flex-end',
      color: colores.colorPrimarioTomate,
   },
});
