import React, { useState, Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import * as firebase from 'firebase';
//import * as GoogleSignIn from 'expo-google-sign-in';
import Cargando from '../../components/Cargando';
import * as GoogleSignIn from 'expo-google-sign-in';

export default class IniciarSesionGoogle extends Component {
   state = { user: null, cargadorVisible: false };
   initAsync = async () => {
      // alert('initAsync');
      await GoogleSignIn.initAsync({
         clientId:
            //  '549900659572-vsav8nioivs7r9j5a3p2lonhdogchdgs.apps.googleusercontent.com',
            '549900659572-eq9ah25m9dl4kh3nj9eu2d7d483ba3bm.apps.googleusercontent.com',
      });
   };

   _syncUserWithStateAsync = async () => {
      try {
         //  alert('silent xxxx....');
         const user = await GoogleSignIn.signInSilentlyAsync();

         /* if (user.auth) alert('obtiene los tokens' + user.auth.idToken);*/

         let credential = firebase.auth.GoogleAuthProvider.credential(
            user.auth.idToken,
            user.auth.accessToken
         );
         //  alert('credential', user.auth.idToken);
         firebase
            .auth()
            .signInWithCredential(credential)
            .catch(function (error) {
               // Handle Errors here.
               var errorCode = error.code;
               var errorMessage = error.message;
               // The email of the user's account used.
               var email = error.email;
               // The firebase.auth.AuthCredential type that was used.
               var credential = error.credential;

               alert('error al loguear con credenciales', errorMessage);
               // ...
            });
      } catch ({ message }) {
         alert('Error en silent:' + message);
      }
      this.setState({ user });
   };

   signInAsync = async () => {
      try {
         await GoogleSignIn.askForPlayServicesAsync();
         const { type, user } = await GoogleSignIn.signInAsync();
         if (type === 'success') {
            this._syncUserWithStateAsync();
            this.setState({ cargadorVisible: false });
         }
      } catch ({ message }) {
         alert('login: Error:' + message);
      }
   };

   signOutAsync = async () => {
      await GoogleSignIn.signOutAsync();
      this.setState({ user: null });
   };
   componentDidMount() {
      this.initAsync();
   }
   render() {
      return (
         <View style={styles.container}>
            <SocialIcon
               type="google"
               onPress={() => {
                  this.setState({ cargadorVisible: true });
                  this.signInAsync();
               }}
            ></SocialIcon>
            <Cargando
               text="Iniciando Sesión con Google"
               isVisible={this.state.cargadorVisible}
            ></Cargando>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      marginTop: 30,
   },
});
