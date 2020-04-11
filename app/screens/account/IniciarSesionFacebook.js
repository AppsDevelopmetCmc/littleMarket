import React, { useState } from 'react';
import { View } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { FacebookApi } from '../../utils/Social';
import Cargando from '../../components/Cargando';

export default function IniciarSesionFacebook(props) {
   const { nav, toastRef } = props;
   const [isVisibleLoading, setIsVisibleLoading] = useState(false);

   const iniciaSesionFacebook = async () => {
      console.log('Iniciando sesion con facebook');
      await Facebook.initializeAsync(FacebookApi.application_id);
      const {
         type,
         token,
         expires,
         permissions,
         declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
         permissions: ['public_profile', 'email'],
      });
      console.log('Expires: ' + expires);
      console.log('Credenciales: ' + token);

      if (type === 'success') {
         setIsVisibleLoading(true);
         const credentials = firebase.auth.FacebookAuthProvider.credential(
            token
         );
         await firebase
            .auth()
            .signInWithCredential(credentials)
            .then(() => {
               console.log('Ingreso con facebook');
            })
            .catch(() => {
               console.log('Crendenciales: ', credentials);

               console.log('Error accediendo con facebook ');
               toastRef.current.show('Error accediendo con facebook ');
            });
      } else if (type === 'cancel') {
         console.log('Inicio de Sesion Cancelado');
         toastRef.current.show('Inicio de Sesion Cancelado');
      } else {
         console.log('Error desconocido, intentelo mas tarde');
         toastRef.current.show('Error desconocido, intentelo mas tarde');
      }
      setIsVisibleLoading(false);
   };
   return (
      <View>
         <SocialIcon
            title="Iniciar sesión con Facebook"
            button
            type="facebook"
            onPress={iniciaSesionFacebook}
         ></SocialIcon>
         <Cargando
            text="Iniciando Sesión con Facebook"
            isVisible={isVisibleLoading}
         ></Cargando>
      </View>
   );
}
