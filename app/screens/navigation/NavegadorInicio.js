import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';

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
