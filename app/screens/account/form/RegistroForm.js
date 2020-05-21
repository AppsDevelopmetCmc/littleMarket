import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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

export default function RegistroForm(props) {
   /* this.state = {
      numero: 1,
      codigoReferido: '',
   };*/
   const { nav, toastRef } = props;
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

   const requerido = 'Campo requerido *';

   const register = async () => {
      setisVisibleLoading(true);
      console.log('>>>>>1');
      if (!email || !password || !repeatPassword) {
         toastRef.current.show(err.Err3, 600);
         seterrorMsgCorreo(requerido);
         seterrorMsgContraseña(requerido);
         seterrorMsgRepetirContraseña(requerido);
      } else {
         seterrorMsgCorreo('');
         seterrorMsgContraseña('');
         seterrorMsgRepetirContraseña('');
         if (!validateEmail(email)) {
            toastRef.current.show(err.Err1, 600);
            seterrorMsgCorreo(err.Err1);
         } else {
            if (password.length < 6) {
               seterrorMsgContraseña(err.Err6);
               toastRef.current.show(err.Err6, 600);
            } else {
               if (password !== repeatPassword) {
                  toastRef.current.show(err.Err4, 600);
                  seterrorMsgRepetirContraseña(err.Err4);
               } else {
                  seterrorMsgCorreo('');
                  seterrorMsgContraseña('');
                  seterrorMsgRepetirContraseña('');
                  await firebase
                     .auth()
                     .createUserWithEmailAndPassword(email, password)
                     .then(() => {
                        //this.generarNumeroRandom();
                        console.log(
                           'se registro correctamente' + codigoReferido
                        );
                     })
                     .catch(error => {
                        console.log(error);
                        //TODO: SMO EMPATAR ERRORES DE FIREBASE AL REGISTRARSE
                        //toastRef.current.show(err.Err5, 600);
                        toastRef.current.show(error.message, 2000);
                     });
               }
            }
            console.log('zzzzzzIse');
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
      console.log('random.... ' + codigoReferido);
   };

   return (
      <KeyboardAwareScrollView style={styles.container}>
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
      </KeyboardAwareScrollView>
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
      backgroundColor: colores.colorPrimarioVerde,
      borderRadius: 10,
   },
   estiloTexto: {
      paddingTop: 15,
      alignSelf: 'flex-end',
      color: colores.colorClaroPrimarioVerde,
   },
});
