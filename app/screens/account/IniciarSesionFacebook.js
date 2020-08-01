import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SocialIcon, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { FacebookApi } from '../../utils/Social';
import Cargando from '../../components/Cargando';

export default function IniciarSesionFacebook(props) {
   const { nav, toastRef, aceptaTerminos } = props;
   const [isVisibleLoading, setIsVisibleLoading] = useState(false);

   const iniciaSesionFacebook = async () => {
      await Facebook.initializeAsync(FacebookApi.application_id);
      const {
         type,
         token,
         expires,
      } = await Facebook.logInWithReadPermissionsAsync({
         permissions: ['public_profile', 'email'],
      });

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
            .catch(error => {
               toastRef.current.show('Error accediendo con facebook ');
            });
      } else if (type === 'cancel') {
         toastRef.current.show('Inicio de Sesion Cancelado');
      } else {
         toastRef.current.show('Error desconocido, intentelo mas tarde');
      }
      setIsVisibleLoading(false);
   };
   return (
      <View style={styles.container}>
         <SocialIcon
            type="facebook"
            onPress={() => {
               if (aceptaTerminos) {
                  iniciaSesionFacebook();
               } else {
                  Alert.alert(
                     'Información',
                     'Debe aceptar Términos y Condiciones'
                  );
               }
            }}
         ></SocialIcon>
         <Cargando
            text="Iniciando Sesión con Facebook"
            isVisible={isVisibleLoading}
         ></Cargando>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      marginTop: 30,
   },
});
