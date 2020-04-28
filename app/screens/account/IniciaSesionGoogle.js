import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import { GoogleApi } from '../../utils/Social';
import Cargando from '../../components/Cargando';
//Importacion de los colores
import * as colores from '../../constants/Colores';

export default function IniciarSesionGoogle(props) {
   const [isVisibleLoading, setIsVisibleLoading] = useState(false);

   const iniciaSesionGoogle = async () => {
      console.log('Inicia metodo de ingreso con google');
      try {
         const result = await Google.logInAsync({
            androidClientId: GoogleApi.android_client_id,
            iosClientId: GoogleApi.ios_client_id,
            scopes: ['profile', 'email'],
         });

         console.log('result: ', result);

         if (result.type === 'success') {
            setIsVisibleLoading(true);
            const credenciales = firebase.auth.GoogleAuthProvider.credential(
               result.idToken
            );
            console.log('Crendenciales: ', credenciales);
            await firebase
               .auth()
               .signInWithCredential(credenciales)
               .then(() => {
                  console.log('Ingreso con google');
               })
               .catch(error => {
                  console.log('Crendenciales: ', credenciales);

                  console.log('Error accediendo con google ', error);
               });
         } else {
            // return { cancelled: true };
            console.log('cancelado');
         }
         setIsVisibleLoading(false);
      } catch (e) {
         // return { error: true };
         console.log('error fatla', e);
      }
   };
   return (
      <View style={styles.container}>
         <SocialIcon type="google" onPress={iniciaSesionGoogle}></SocialIcon>
         <Cargando
            text="Iniciando Sesión con Google"
            isVisible={isVisibleLoading}
         ></Cargando>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: 30,
   },
});
