import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Registro() {
   const [hidePassword, setHidePassword] = useState(true);
   const [hideRepetiPassword, setHideRepitPassword] = useState(true);
   const register = () => {
      console.log('Registrado');
   };
   return (
      <View style={styles.container}>
         <Input
            placeholder="Correo Electronico"
            containerStyle={styles.inputForm}
            onChange={() => console.log('Email Actualizado')}
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
            onChange={() => console.log('Ingresando contraseña')}
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
            onChange={() => console.log('Repetir contraseña')}
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
