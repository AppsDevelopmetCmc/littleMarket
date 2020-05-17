import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { AsyncStorage, Text } from 'react-native';
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
import { Transferencia } from '../compra/Transferencia';
import { CargarImagen } from '../compra/CargarImagen';

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
import { DireccionesCrud } from '../map/DireccionesCrud';

// Splash de carga
import Cargando from '../../components/Cargando';

// Importaciones para el Inicio
import { ListaPedidos } from '../pedidos/ListaPedidos';
import { ListaProductos } from '../ListaProductos';
import { ListCombo } from '../combos/ListCombo';
import { CarroCompras } from '../carroCompras/CarroCompras';
import { DetallePedido } from '../pedidos/DetallePedido';
import { ConfirmarCompra } from '../compra/ConfirmarCompra';
import { Notificacion } from '../notificaciones/Notificacion';

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
         <StackFromTabs.Screen
            name="TransferenciaScreen"
            component={Transferencia}
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
         <StackFromTabs.Screen
            name="CargarImagenScreen"
            component={CargarImagen}
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
            name="NotificacionScreen"
            component={Notificacion}
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
         <StackDirection.Screen name="Mapa" component={Mapa} />
         <StackDirection.Screen name="Direcciones" component={Direcciones} />
         <StackDirection.Screen
            name="BusquedaDireccionesScreen"
            component={BusquedaDirecciones}
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
            name="DireccionesCrudScreen"
            component={DireccionesCrud}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="HomeTab"
            component={HomeTab}
         ></StackDirection.Screen>
      </StackDirection.Navigator>
   );
}

function DirectionCrudStack() {
   return (
      <StackDirection.Navigator initialRouteName="DireccionesCrudScreen">
         <StackDirection.Screen
            name="Mapa"
            component={Mapa}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="BusquedaDireccionesScreen"
            component={BusquedaDirecciones}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="DireccionesCrudScreen"
            component={DireccionesCrud}
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
            name="DirectionCrudStack"
            component={DirectionCrudStack}
            options={{ drawerLabel: 'DireccionesCrudScreen' }}
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
   const [tieneCobertura, setTieneCobertura] = useState(null);
   console.log('***NavegadorInicio render *****');
   if (!global.empiezaCarga) {
      global.empiezaCarga = new Date().getTime();
   }

   global.activarCobertura = async bandera => {
      console.log('ACTIVAR COBERTURA');
      try {
         console.log('GUARDA en el storage:');
         await AsyncStorage.setItem('cobertura_' + global.usuario, bandera);
      } catch (error) {
         // Error saving data
      }
      setTieneCobertura(bandera);
   };
   // Funcion para recuperar info de logue
   const infoLogin = async () => {
      try {
         firebase.auth().onAuthStateChanged(async user => {
            !user ? setLogin(false) : setLogin(true);

            if (user) {
               global.usuario = user.email;
               global.infoUsuario = user.providerData[0];
               console.log(
                  '***NavegadorInicio info usuario:',
                  new Date().getTime() - global.empiezaCarga,
                  global.infoUsuario
               );

               try {
                  const value = await AsyncStorage.getItem(
                     'cobertura_' + global.usuario
                  );
                  if (value == 'S') {
                     // We have data!!
                     console.log('recupera del storage:', value);
                     //  setRecuperaCobertura(true);
                     setTieneCobertura(true);
                  } else if (value == 'N') {
                     //setRecuperaCobertura(true);
                     setTieneCobertura(false);
                  } else {
                     console.log('NO recupera del storage:', value);
                     new ServicioDirecciones().tieneCobertura(global.usuario);
                  }
               } catch (error) {
                  // Error retrieving data
               }

               agregaInfo();
            }
         });
      } catch (error) {
         console.log('error', error);
      }
   };

   const agregaInfo = async () => {
      console.log('ingreso a cargar la info del perfil');

      let documento = {};
      await global.db
         .collection('clientes')
         .doc(global.usuario)
         .get()
         .then(doc => {
            if (doc.data().nombreCompleto) {
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
                  .collection('clientes')
                  .doc(global.usuario)
                  .set(infoUsuarioGuardar)
                  .then(() => {
                     console.log('agregado Correctamente');
                  })
                  .catch(error => {
                     console.log(error);
                  });
               //llamar a otro global db para guardar el referido x priemra vez
               infoUsuarioGuardar.id = global.usuario;
               global.appUsuario = infoUsuarioGuardar;
            }
         })
         .catch(err => {
            console.log('Error firebase', err);
         });
   };

   useEffect(() => {
      if (login === null) {
         console.log(
            '*** SMO *** dispara useEffect',
            new Date().getTime() - global.empiezaCarga
         );
         infoLogin();
      }
   }, [login]);

   if (login === null) {
      console.log(
         '*** SMO *** login es null',
         new Date().getTime() - global.empiezaCarga
      );
      return <Cargando isVisible={true} text="Cargando"></Cargando>;
   } else {
      console.log(
         '*** SMO *** login no es null / tieneCobertura',
         new Date().getTime() - global.empiezaCarga,
         tieneCobertura
      );

      if (tieneCobertura == null && login) {
         return <Cargando isVisible={true} text="Cargando"></Cargando>;
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
