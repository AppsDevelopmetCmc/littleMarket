import React, { useState } from 'react';
import {
   View,
   StyleSheet,
   AsyncStorage,
   ScrollView,
   Alert,
} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';

// Importación de validaciones
import { validateEmail } from '../../../utils/Validaciones';

// Importacion a Firebase
import * as firebase from 'firebase';

// Imnportación del componente creado Cargando
import Cargando from '../../../components/Cargando';

// Importacion de archivo de errores
import * as err from '../../../constants/Errores';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

// Importacion de colores
import * as colores from '../../../constants/Colores';

import { Yalert } from '../../../components/Yalert';

export default function RegistroForm(props) {
   /* this.state = {
      numero: 1,
      codigoReferido: '',
   };*/
   // Seteo de variables en el state utilizando hoock de react
   const [hidePassword, setHidePassword] = useState(true);
   const [hideRepetiPassword, setHideRepitPassword] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [repeatPassword, setRepeatPassword] = useState('');
   const [isVisibleLoading, setisVisibleLoading] = useState(false);
   const [errorMsgCorreo, seterrorMsgCorreo] = useState('');
   const [errorMsgContraseña, seterrorMsgContraseña] = useState('');
   const [errorMsgRepetirContraseña, seterrorMsgRepetirContraseña] = useState(
      ''
   );
   const [mostrarYalert, setMostrarYalert] = useState(false);
   const [titulo, setTitulo] = useState(false);
   const [mensaje, setMensaje] = useState(false);
   const requerido = 'Campo requerido *';

   const register = async () => {
      if (!email || !password || !repeatPassword) {
         // toastRef.current.show(err.Err3, 600);
         //Alert.alert('Error', err.Err3);
         mostrarError('Información', err.Err3);
         seterrorMsgCorreo(requerido);
         seterrorMsgContraseña(requerido);
         seterrorMsgRepetirContraseña(requerido);
      } else {
         seterrorMsgCorreo('');
         seterrorMsgContraseña('');
         seterrorMsgRepetirContraseña('');
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
               if (password !== repeatPassword) {
                  //toastRef.current.show(err.Err4, 600);
                  mostrarError('Información', err.Err4);
                  //seterrorMsgRepetirContraseña(err.Err4);
               } else {
                  seterrorMsgCorreo('');
                  seterrorMsgContraseña('');
                  seterrorMsgRepetirContraseña('');
                  //Borra la info del storage
                  //AsyncStorage.removeItem('cobertura_' + email);
                  setisVisibleLoading(true);
                  await firebase
                     .auth()
                     .createUserWithEmailAndPassword(email, password)
                     .then(user => {
                        let usuarioRegistrado = firebase.auth().currentUser;
                        usuarioRegistrado
                           .sendEmailVerification()
                           .then(function () {
                              props.nav.navigate('IniciaSesion');
                              /* Alert.alert(
                                 'Info',
                                 'Verifique su correo electrónico ' +
                                    usuarioRegistrado.email +
                                    ' para continuar'
                              );*/
                           });
                     })
                     .catch(error => {
                        console.log(error);
                        //TODO: SMO EMPATAR ERRORES DE FIREBASE AL REGISTRARSE
                        //toastRef.current.show(err.Err5, 600);
                        // toastRef.current.show(error.message, 2000);
                        console.log(error.code);
                        mostrarError('Error', err.obtenerMensaje(error.code));
                     });
               }
            }
         }
      }
      setisVisibleLoading(false);
   };
   generarNumeroRandom = () => {
      var numeroRandom = Math.floor(Math.random() * 100) + 1;
      this.setState({ numero: numeroRandom });
      this.setState({
         codigoReferido:
            global.usuario.substring(0, 1) +
            global.usuario.substring(3, 4) +
            numeroRandom,
      });
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
         <Input
            placeholder="******"
            label="Repetir la contraseña * *"
            labelStyle={textEstilo(colores.colorPrimarioTexto, 15, 'normal')}
            password={true}
            secureTextEntry={hideRepetiPassword}
            containerStyle={styles.estiloContenedor2}
            inputContainerStyle={styles.estiloInputContenedor}
            inputStyle={styles.estiloInput}
            errorMessage={errorMsgRepetirContraseña}
            onChange={e => setRepeatPassword(e.nativeEvent.text)}
            rightIcon={
               <Icon
                  type="material-community"
                  name={hideRepetiPassword ? 'eye-outline' : 'eye-off-outline'}
                  iconStyle={styles.iconRight}
                  onPress={() => {
                     setHideRepitPassword(!hideRepetiPassword);
                  }}
               ></Icon>
            }
         ></Input>
         <Button
            title="Registrarse"
            titleStyle={textEstilo(colores.colorBlanco, 15, 'bold')}
            containerStyle={styles.btnStyles}
            buttonStyle={styles.btnRegistrarse}
            onPress={register}
         ></Button>
         <Cargando
            text="Creando Cuenta"
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
   },
   btnRegistrarse: {
      padding: 10,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 12,
   },
   estiloTexto: {
      paddingTop: 15,
      alignSelf: 'flex-end',
      color: colores.colorClaroPrimarioVerde,
   },
});
