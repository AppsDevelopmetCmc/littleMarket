import React, { useState, usetoastRef } from 'react';
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

export default function IniciaSesionForm(props) {
   const { nav, toastRef } = props;

   // Seteo de variables en el state utilizando hoock de react
   const [hidePassword, setHidePassword] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isVisibleLoading, setisVisibleLoading] = useState(false);

   const iniciarSesion = async () => {
      setisVisibleLoading(true);
      if (!email || !password) {
         toastRef.current.show(err.Err3);
      } else {
         if (!validateEmail(email)) {
            toastRef.current.show(err.Err1);
         } else {
            await firebase
               .auth()
               .signInWithEmailAndPassword(email, password)
               .then(() => {
                  console.log('Inicio Sesion con Firebase');
               })
               .catch(() => {
                  toastRef.current.show(err.Err2);
               });
         }
      }
      setisVisibleLoading(false);
   };

   return (
      <View style={styles.container}>
         <Input
            placeholder="Correo Electronico"
            containerStyle={styles.inputForm}
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
            placeholder="Contraseña"
            password={true}
            secureTextEntry={hidePassword}
            containerStyle={styles.inputForm}
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
         <Button
            title="Iniciar Sesion"
            containerStyle={styles.btnStyles}
            buttonStyle={styles.btnRegistrarse}
            onPress={iniciarSesion}
         ></Button>

         <Cargando
            text="Creando Cuenta"
            isVisible={isVisibleLoading}
         ></Cargando>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   inputForm: {
      width: '100%',
      marginTop: 20,
   },
   iconRight: { color: '#c1c1c1' },
   btnStyles: { marginTop: 25, width: '95%' },
   btnRegistrarse: { padding: 10 },
});
