import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';
import IniciaSesion from '../account/IniciarSesion';

import MiCuenta from '../account/MiCuenta';

const Stack = createStackNavigator();

function LoginStack() {
   return (
      <Stack.Navigator
         screenOptions={{
            headerShown: false,
         }}
      >
         <Stack.Screen
            name="Pagina Inicio"
            component={PaginaInicio}
         ></Stack.Screen>
         <Stack.Screen name="Registro" component={Registro}></Stack.Screen>
         <Stack.Screen
            name="IniciaSesion"
            component={IniciaSesion}
         ></Stack.Screen>
         <Stack.Screen name="MiCuenta" component={MiCuenta}></Stack.Screen>
      </Stack.Navigator>
   );
}

export default function NavegadorInicio() {
   return (
      <NavigationContainer>
         <LoginStack></LoginStack>
      </NavigationContainer>
   );
}
