import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { cargarConfiguracion } from '../../utils/FireBase';

// Importación Logueo y información de usuario
import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';
import IniciaSesion from '../account/IniciarSesion';
import PerfilUsuario from '../account/PerfilUsuario';

// Importaciones necesarias direcciones
import  Mapa  from '../map/Mapa';
import { Direcciones } from '../map/Direcciones';

// Splash de carga
import Cargando from '../../components/Cargando';

// Importaciones para el Inicio
import { ListaPedidos } from '../ListaPedidos';
import { ListaProductos } from '../ListaProductos';
import { ListCombo } from '../combos/ListCombo';

const StackAuthentication = createStackNavigator();
const StackLogin = createStackNavigator();
const StackDirection = createStackNavigator();
const TabHome = createBottomTabNavigator();
const DrawerHome = createDrawerNavigator();

if (!global.firebaseRegistrado) {
   cargarConfiguracion();
}
const navOptionHandler = isValue => ({
   headerShown: isValue,
});

function AuthenticationStack() {
   const [login, setLogin] = useState(null);
   //PENDIENTE: recuperar del usuario logueado
   global.direccionPrincipal = {
      descripcion: 'Dirección Actual',
      tieneCobertura: false,
   };

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
               global.direccionPrincipal != null ? (
                  global.direccionPrincipal.tieneCobertura ? (
                     <StackAuthentication.Screen
                        name="HomeTab"
                        component={HomeTab}
                        options={navOptionHandler(false)}
                     />
                  ) : (
                     <StackAuthentication.Screen
                        name="DireccionStack"
                        component={DirectionStack}
                        options={navOptionHandler(false)}
                     />
                  )
               ) : (

                  <StackAuthentication.Screen
                  name="HomeTab"
                  component={HomeTab}
                  options={navOptionHandler(false)}
               />
               )
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

function DirectionStack() {
   return (
      <StackDirection.Navigator initialRouteName="HomeTab">
         <StackDirection.Screen
            name="Direcciones"
            component={Direcciones}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="Mapa"
            component={Mapa}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="HomeTab"
            component={HomeTab}
            options={navOptionHandler(false)}
         ></StackDirection.Screen>
      </StackDirection.Navigator>
   );
}
function HomeTab() {
   return (
      <TabHome.Navigator initialRouteName="PaginaPrincipal">
         <TabHome.Screen name="ListaProductos" component={ListaProductos} />
         <TabHome.Screen name="ListaPedidos" component={ListaPedidos} />
         <TabHome.Screen name="ListaCombos" component={ListCombo} />
      </TabHome.Navigator>
   );
}

function HomeDraw() {
   return (
      <DrawerHome.Navigator initialRouteName="DirectionStack">
         <DrawerHome.Screen name="DirectionStack" component={DirectionStack} />
         <DrawerHome.Screen name="PerfilUsuario" component={PerfilUsuario} />
      </DrawerHome.Navigator>
   );
}

export default function NavegadorInicio() {
   return (
      <NavigationContainer>
         <AuthenticationStack></AuthenticationStack>
      </NavigationContainer>
   );
}
