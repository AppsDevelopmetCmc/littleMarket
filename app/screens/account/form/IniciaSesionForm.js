import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
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

   const iniciarSesion = async () => {
      setisVisibleLoading(true);
      if (!email || !password) {
         toastRef.current.show(err.Err3, 600);
         seterrorMsgCorreo(requerido);
         seterrorMsgContraseña(requerido);
      } else {
         seterrorMsgCorreo('');
         seterrorMsgContraseña('');
         if (!validateEmail(email)) {
            toastRef.current.show(err.Err1, 600);
            seterrorMsgCorreo(err.Err1);
         } else {
            if (password.length < 6) {
               seterrorMsgContraseña(err.Err6);
               toastRef.current.show(err.Err6, 600);
            } else {
               seterrorMsgCorreo('');
               seterrorMsgContraseña('');
               await firebase
                  .auth()
                  .signInWithEmailAndPassword(email, password)
                  .then(() => {
                     console.log('Inicio Sesion con Firebase');
                  })
                  .catch(() => {
                     toastRef.current.show(err.Err2, 600);
                  });
            }
         }
         setisVisibleLoading(false);
      }
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
      borderRadius: 25,
   },
   estiloTexto: {
      paddingTop: 15,
      alignSelf: 'flex-end',
      color: colores.colorClaroPrimarioTomate,
   },
});
