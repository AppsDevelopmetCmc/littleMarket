import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { cargarConfiguracion } from '../../utils/FireBase';
import { DetalleCombo } from '../../screens/combos/DetalleCombo';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { consultarInformacion } from '../../servicios/ServicioUsuarios';

// Importación Logueo y información de usuario
import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';
import IniciaSesion from '../account/IniciarSesion';
import PerfilUsuario from '../account/PerfilUsuario';
import RecuperarCuenta from '../account/RecuperarCuenta';

// Importaciones necesarias direcciones
import { Mapa } from '../map/Mapa';
import { Direcciones } from '../map/Direcciones';

// Splash de carga
import Cargando from '../../components/Cargando';

// Importaciones para el Inicio
import {ListaPedidos} from '../pedidos/ListaPedidos'
import { ListaProductos } from '../ListaProductos';
import { ListCombo } from '../combos/ListCombo';
import { CarroCompras } from '../carroCompras/CarroCompras';
import {DetallePedido} from '../pedidos/DetallePedido'
import { ConfirmarCompra } from '../compra/ConfirmarCompra';

//Importando los colores
import * as colores from '../../constants/Colores';

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
         ></StackFromTabs.Screen>
         <StackDirection.Screen
            name="CarroComprasScreen"
            component={CarroCompras}
         />
          <StackDirection.Screen
            name="DetallePedidoScreen"
            component={DetallePedido}
         />

         <StackDirection.Screen
            name="ConfirmarCompraScreen"
            component={ConfirmarCompra}
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
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="Mapa"
            component={Mapa}
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
               } else if (route.name === 'ListaProductos') {
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
            name="ListaProductos"
            component={ListaProductos}
            options={{ tabBarLabel: 'Mis Compras' }}
         />
      </TabHome.Navigator>
   );
}

function HomeDraw() {
   return (
      <DrawerHome.Navigator initialRouteName="HomeDrawer">
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
   global.tieneCobertura = true;
   useEffect(() => {
      (async () => {
         await firebase.auth().onAuthStateChanged(user => {
            !user ? setLogin(false) : setLogin(true);
            if (user) {
               global.usuario = user.email;
               global.infoUsuario = user.providerData[0];
            }
         });
         if (global.usuario) {
            consultarInformacion(global.usuario);
         }
      })();
   }, [login]);

   // Consulta si existe en la coleccion registro de usuario con el login realizado
   useEffect(() => {
      // utilizo una funciona anonima para poder realizar la espera de la respuesta
      // TO DO: Verficar el funcionamiento y ajustes en pruebas
      (async () => {
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
                  console.log('La informacion cargada es:', global.appUsuario);
               } else {
                  let infoUsuarioGuardar = {};
                  infoUsuarioGuardar.cedula = null;
                  infoUsuarioGuardar.imagen = global.infoUsuario.photoURL;
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
                  console.log('La informacion guardada es:', global.appUsuario);
               }
            })
            .catch(err => {
               console.log('Error firebase', err);
            });
      })();
   }, []);

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