import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';
import IniciaSesion from '../account/IniciarSesion';

import MiCuenta from '../account/MiCuenta';
import Mapa from '../map/Mapa';
import Cargando from '../../components/Cargando';

const StackAuthentication = createStackNavigator();
const StackLogin = createStackNavigator();

const navOptionHandler = isValue => ({
   headerShown: isValue,
});

function AuthenticationStack() {
   const [login, setLogin] = useState(null);

   useEffect(() => {
      firebase.auth().onAuthStateChanged(user => {
         !user ? setLogin(false) : setLogin(true);
      });
   }, [login]);

   if (login === null) {
      return <Cargando isVisible={true} text="Cargando ..."></Cargando>;
   } else {
      return (
         <StackAuthentication.Navigator>
            {login ? (
               <StackAuthentication.Screen
                  name="Mapa"
                  component={Mapa}
               ></StackAuthentication.Screen>
            ) : (
               <StackAuthentication.Screen
                  name="LoginStack"
                  component={LoginStack}
                  options={navOptionHandler(false)}
               ></StackAuthentication.Screen>
            )}
         </StackAuthentication.Navigator>
      );
   }
}

function LoginStack() {
   return (
      <StackLogin.Navigator>
         <StackLogin.Screen
            name="Pagina Inicio"
            component={PaginaInicio}
            options={navOptionHandler(false)}
         ></StackLogin.Screen>
         <StackLogin.Screen
            name="Registro"
            component={Registro}
         ></StackLogin.Screen>
         <StackLogin.Screen
            name="IniciaSesion"
            component={IniciaSesion}
         ></StackLogin.Screen>
      </StackLogin.Navigator>
   );
}

export default function NavegadorInicio() {
   return (
      <NavigationContainer>
         <AuthenticationStack></AuthenticationStack>
      </NavigationContainer>
   );
}
