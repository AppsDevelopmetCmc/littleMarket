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

// Importacion a mapa
import Mapa from '../map/Mapa';

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
         console.log('Todos los campos son obligatorios');
         toastRef.current.show('Todos los campos son obligatorios');
      } else {
         if (!validateEmail(email)) {
            console.log('El email no es correcto');
            toastRef.current.show('El email no es correcto');
         } else {
            if (password !== repeatPassword) {
               console.log('Las contraseñas no son iguales');
               toastRef.current.show('Las contraseñas no son iguales');
            } else {
               await firebase
                  .auth()
                  .createUserWithEmailAndPassword(email, password)
                  .then(() => {
                     navigation.navigate('Mapa');
                  })
                  .catch(() => {
                     console.log(
                        'Error al crear la cuenta, intentelo más tarde'
                     );
                     toastRef.current.show(
                        'Error al crear la cuenta, intentelo más tarde'
                     );
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
