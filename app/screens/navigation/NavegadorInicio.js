import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
   createDrawerNavigator,
   DrawerItemList,
} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { cargarConfiguracion } from '../../utils/FireBase';
import { DetalleCombo } from '../../screens/combos/DetalleCombo';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { consultarInformacion } from '../../servicios/ServicioUsuarios';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';

// Importación Logueo y información de usuario
import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';
import IniciaSesion from '../account/IniciarSesion';
import PerfilUsuario from '../account/PerfilUsuario';
import RecuperarCuenta from '../account/RecuperarCuenta';

// Importaciones necesarias direcciones
import { Mapa } from '../map/Mapa';
import { Direcciones } from '../map/Direcciones';
import { BusquedaDirecciones } from '../map/BusquedaDirecciones';

// Splash de carga
import Cargando from '../../components/Cargando';

// Importaciones para el Inicio
import { ListaPedidos } from '../pedidos/ListaPedidos';
import { ListaProductos } from '../ListaProductos';
import { ListCombo } from '../combos/ListCombo';
import { CarroCompras } from '../carroCompras/CarroCompras';
import { DetallePedido } from '../pedidos/DetallePedido';
import { ConfirmarCompra } from '../compra/ConfirmarCompra';

//Importando los colores
import * as colores from '../../constants/Colores';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';

import { Menu } from '../menu/Menu';

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

if (global.usuario == null) {
   let user = firebase.auth().currentUser;
   if (user) {
      global.usuario = user.email;
      global.infoUsuario = user.providerData[0];
   }
}
function ScreensFromTabs() {
   return (
      <StackFromTabs.Navigator initialRouteName="HomeTabScreen">
         <StackFromTabs.Screen
            name="HomeTabScreen"
            component={HomeTab}
            options={navOptionHandler(false)}
         ></StackFromTabs.Screen>
         <StackFromTabs.Screen
            name="DetalleComboScreen"
            component={DetalleCombo}
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         ></StackFromTabs.Screen>
         <StackDirection.Screen
            name="CarroComprasScreen"
            component={CarroCompras}
            options={navOptionHandler(false)}
         />
         <StackDirection.Screen
            name="DetallePedidoScreen"
            component={DetallePedido}
         />

         <StackDirection.Screen
            name="ConfirmarCompraScreen"
            component={ConfirmarCompra}
            options={{
               title: 'Confirmar compra',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         />
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
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         ></StackLogin.Screen>
         <StackLogin.Screen
            name="IniciaSesion"
            component={IniciaSesion}
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         ></StackLogin.Screen>
         <StackLogin.Screen
            name="RecuperarCuenta"
            component={RecuperarCuenta}
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
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
            options={navOptionHandler(false)}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="Mapa"
            component={Mapa}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="BusquedaDireccionesScreen"
            component={BusquedaDirecciones}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="HomeTab"
            component={HomeTab}
         ></StackDirection.Screen>
      </StackDirection.Navigator>
   );
}
function HomeTab() {
   return (
      <TabHome.Navigator
         initialRouteName="ListaCombos"
         screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
               let iconName;
               let tipo = 'material-community';

               if (route.name === 'ListaCombos') {
                  iconName = 'store';
               } else if (route.name === 'ListaPedidos') {
                  iconName = 'basket';
               }

               return (
                  <Icon name={iconName} size={size} color={color} type={tipo} />
               );
            },
         })}
         tabBarOptions={{
            activeTintColor: colores.colorOscuroPrimarioVerde,
            inactiveTintColor: colores.colorClaroTexto,
         }}
      >
         <TabHome.Screen
            name="ListaCombos"
            component={ListCombo}
            options={{ tabBarLabel: 'Inicio' }}
         />
         <TabHome.Screen
            name="ListaPedidos"
            component={ListaPedidos}
            options={{ tabBarLabel: 'Mis Compras' }}
         />
      </TabHome.Navigator>
   );
}

function HomeDraw() {
   return (
      <DrawerHome.Navigator drawerContent={props => <Menu {...props} />}>
         <DrawerHome.Screen
            name="HomeDrawer"
            component={ScreensFromTabs}
            options={{ drawerLabel: 'Inicio' }}
         />
         <DrawerHome.Screen
            name="DirectionStack"
            component={DirectionStack}
            options={{ drawerLabel: 'Direcciones' }}
         />
         <DrawerHome.Screen
            name="PerfilUsuario"
            component={PerfilUsuario}
            options={{ drawerLabel: 'Perfil' }}
         />
      </DrawerHome.Navigator>
   );
}

export default function NavegadorInicio() {
   const [login, setLogin] = useState(null);
   const [tieneCobertura, setTieneCobertura] = useState(false);
   const [recuperaCobertura, setRecuperaCobertura] = useState(false);
   /* useEffect(() => {
      new ServicioDirecciones().tieneCobertura(global.usuario);
   }, [login]);*/

   global.activarCobertura = () => {
      setTieneCobertura(true);
   };

   //Disparar un proceso de consulta y que muestre cargando
   //hasta terminar de traer la info del usuario en caso
   //de que esté logueado, junto con la info de dirección

   // Funcion para recuperar info de logue
   const infoLogin = async () => {
      try {
         await firebase.auth().onAuthStateChanged(async user => {
            !user ? setLogin(false) : setLogin(true);
            if (user) {
               global.usuario = user.email;
               global.infoUsuario = user.providerData[0];
               console.log(global.infoUsuario);
               new ServicioDirecciones().tieneCobertura(
                  global.usuario,
                  setRecuperaCobertura
               );
            }
         });
      } catch (error) {
         console.log('error', error);
      }
   };

   const agregaInfo = async () => {
      let documento = {};
      await global.db
         .collection('infoApp')
         .doc('clientes')
         .collection('infoUsuario')
         .doc(global.usuario)
         .get()
         .then(doc => {
            if (doc.exists) {
               documento = doc.data();
               documento.id = doc.id;
               global.appUsuario = documento;
            } else {
               let infoUsuarioGuardar = {};
               infoUsuarioGuardar.cedula = null;
               infoUsuarioGuardar.nombreCompleto =
                  global.infoUsuario.displayName;
               infoUsuarioGuardar.telefono = global.infoUsuario.phoneNumber;
               global.db
                  .collection('infoApp')
                  .doc('clientes')
                  .collection('infoUsuario')
                  .doc(global.usuario)
                  .set(infoUsuarioGuardar)
                  .then(() => {
                     console.log('agregado Correctamente');
                  })
                  .catch(error => {
                     console.log(error);
                  });

               infoUsuarioGuardar.id = global.usuario;
               global.appUsuario = infoUsuarioGuardar;
            }
         })
         .catch(err => {
            console.log('Error firebase', err);
         });
   };

   useEffect(() => {
      infoLogin();
      if (login) {
         agregaInfo();
      }

      return function cleanup() {
         infoLogin();
         if (login) {
            agregaInfo();
         }
      };
   }, [login]);

   if (login === null) {
      return <Cargando isVisible={true} text="Cargando ..."></Cargando>;
   } else {
      if (!recuperaCobertura) {
         return <Cargando isVisible={true} text="Cargando ..."></Cargando>;
      }
      return (
         <NavigationContainer>
            {login ? (
               tieneCobertura ? (
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
