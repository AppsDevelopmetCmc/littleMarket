import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';

// Importación de validaciones
import { validateEmail } from '../../utils/Validaciones';

// Importacion a Firebase
import * as firebase from 'firebase';

// Importacion de Toas
import Toast from 'react-native-easy-toast';

// Imnportación del componente creado Cargando
import Cargando from '../../components/Cargando';

// Importacion de archivo de errores
import * as err from '../../constants/Errores';

export default function Registro({ navigation }) {
   // Seteo de variables en el state utilizando hoock de react
   const [hidePassword, setHidePassword] = useState(true);
   const [hideRepetiPassword, setHideRepitPassword] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [repeatPassword, setRepeatPassword] = useState('');
   const [isVisibleLoading, setisVisibleLoading] = useState(false);

   // Inicializacion de la referencia con hoock para utilizarlo con toast
   const toastRef = useRef();

   const register = async () => {
      setisVisibleLoading(true);
      if (!email || !password || !repeatPassword) {
         toastRef.current.show(err.Err3);
      } else {
         if (!validateEmail(email)) {
            toastRef.current.show(err.Err1);
         } else {
            if (password !== repeatPassword) {
               toastRef.current.show(err.Err4);
            } else {
               await firebase
                  .auth()
                  .createUserWithEmailAndPassword(email, password)
                  .then(() => {
                     console.log('se registro correctamente');
                  })
                  .catch(() => {
                     toastRef.current.show(err.Err5);
                  });
            }
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
         <Input
            placeholder="Repetir Contraseña"
            password={true}
            secureTextEntry={hideRepetiPassword}
            containerStyle={styles.inputForm}
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
            containerStyle={styles.btnStyles}
            buttonStyle={styles.btnRegistrarse}
            onPress={register}
         ></Button>
         {/* Creación de toast con utilizacion de hook de react useRef -- (toastRef) */}
         <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
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
      marginHorizontal: 40,
   },
   inputForm: {
      width: '100%',
      marginTop: 10,
   },
   iconRight: { color: '#c1c1c1' },
});
