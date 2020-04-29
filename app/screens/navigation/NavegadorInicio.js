import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { cargarConfiguracion } from '../../utils/FireBase';
import { DetalleCombo } from '../../screens/combos/DetalleCombo';

// Importación Logueo y información de usuario
import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';
import IniciaSesion from '../account/IniciarSesion';
import PerfilUsuario from '../account/PerfilUsuario';

// Importaciones necesarias direcciones
import { Mapa } from '../map/Mapa';
import { Direcciones } from '../map/Direcciones';

// Splash de carga
import Cargando from '../../components/Cargando';

// Importaciones para el Inicio
import { ListaPedidos } from '../ListaPedidos';
import { ListaProductos } from '../ListaProductos';
import { ListCombo } from '../combos/ListCombo';
import { CarroCompras } from '../carroCompras/CarroCompras';

const StackAuthentication = createStackNavigator();
const StackLogin = createStackNavigator();
const StackDirection = createStackNavigator();
const StackFromTabs = createStackNavigator();
const TabHome = createBottomTabNavigator();
const DrawerHome = createDrawerNavigator();

if (!global.firebaseRegistrado) {
   cargarConfiguracion();
}
const navOptionHandler = isValue => ({
   headerShown: isValue,
});

function ScreensFromTabs() {
   return (
      <StackFromTabs.Navigator initialRouteName="HomeTabScreen">
         <StackFromTabs.Screen
            name="HomeTabScreen"
            component={HomeTab}
         ></StackFromTabs.Screen>
         <StackFromTabs.Screen
            name="DetalleComboScreen"
            component={DetalleCombo}
         ></StackFromTabs.Screen>
      </StackFromTabs.Navigator>
   );
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
      <StackDirection.Navigator>
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
      <TabHome.Navigator initialRouteName="CarroComprasScreen">
         <TabHome.Screen name="ListaProductos" component={ListaProductos} />
         <TabHome.Screen name="ListaCombos" component={ListCombo} />
         <TabHome.Screen name="CarroComprasScreen" component={CarroCompras} />
      </TabHome.Navigator>
   );
}

function HomeDraw() {
   return (
      <DrawerHome.Navigator initialRouteName="HomeDrawer">
         <DrawerHome.Screen name="HomeDrawer" component={ScreensFromTabs} />
         <DrawerHome.Screen name="DirectionStack" component={DirectionStack} />
         <DrawerHome.Screen name="PerfilUsuario" component={PerfilUsuario} />
      </DrawerHome.Navigator>
   );
}

export default function NavegadorInicio() {
   const [login, setLogin] = useState(null);
   //PENDIENTE: recuperar del usuario logueado
   global.tieneCobertura = true;

   useEffect(() => {
      firebase.auth().onAuthStateChanged(user => {
         !user ? setLogin(false) : setLogin(true);
         if (user) {
            global.usuario = user.email;
         }
      });
   }, [login]);

   if (login === null) {
      return <Cargando isVisible={true} text="Cargando ..."></Cargando>;
   } else {
      return (
         <NavigationContainer>
            {login ? (
               global.tieneCobertura ? (
                  HomeDraw()
               ) : (
                  <StackAuthentication.Navigator>
                     <StackAuthentication.Screen
                        name="DireccionStack"
                        component={DirectionStack}
                        options={navOptionHandler(false)}
                     />
                  </StackAuthentication.Navigator>
               )
            ) : (
               <StackAuthentication.Navigator>
                  <StackAuthentication.Screen
                     name="LoginStack"
                     component={LoginStack}
                     options={navOptionHandler(false)}
                  ></StackAuthentication.Screen>
               </StackAuthentication.Navigator>
            )}
         </NavigationContainer>
      );
   }
}
