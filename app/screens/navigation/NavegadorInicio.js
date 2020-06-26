import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//NAVEGACION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { cargarConfiguracion } from '../../utils/FireBase';
//PANTALLLAS
import { DetalleCombo } from '../../screens/combos/DetalleCombo';
import DatosFacturacion from '../facturacion/datosFacturacion';
import EditarDatosFacturacion from '../facturacion/editarDatosFacturacion';
import { Transferencia } from '../compra/Transferencia';
import { CargarImagen } from '../compra/CargarImagen';
import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';
import IniciaSesion from '../account/IniciarSesion';
import PerfilUsuario from '../account/PerfilUsuario';
import { ListarDatosFacturacion } from '../facturacion/listarDatosFacturacion';
import RecuperarCuenta from '../account/RecuperarCuenta';
import { Mapa } from '../map/Mapa';
import { Direcciones } from '../map/Direcciones';
import { BusquedaDirecciones } from '../map/BusquedaDirecciones';
import { DireccionesCrud } from '../map/DireccionesCrud';
import { ListaPedidos } from '../pedidos/ListaPedidos';
import { ListaProductos } from '../productos/ListaProductos';
import { CarroCompras } from '../carroCompras/CarroCompras';
import { DetallePedido } from '../pedidos/DetallePedido';
import { ConfirmarCompra } from '../compra/ConfirmarCompra';
import { Notificacion } from '../notificaciones/Notificacion';
import { ListaNotificaciones } from '../notificaciones/ListaNotificaciones';
import { MapaDirecciones } from '../map/MapaDirecciones';

//Componentes
import Cargando from '../../components/Cargando';
import * as colores from '../../constants/Colores';
import { Menu } from '../menu/Menu';

const StackAuthentication = createStackNavigator();
const StackLogin = createStackNavigator();
const StackDirection = createStackNavigator();
const StackFromTabs = createStackNavigator();
//const TabHome = createBottomTabNavigator();
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
      <StackFromTabs.Navigator initialRouteName="ListaProductosScreen">
         <StackFromTabs.Screen
            name="ListaProductosScreen"
            component={ListaProductos}
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
            name="DatosFacturacionScreen"
            component={DatosFacturacion}
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
            name="EditarDatosFacturacionScreen"
            component={EditarDatosFacturacion}
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
            name="PerfilUsuarioScreen"
            component={PerfilUsuario}
            options={navOptionHandler(false)}
         />

         <StackDirection.Screen
            name="ListaNotificacionScreen"
            component={ListaNotificaciones}
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         />
         <StackDirection.Screen
            name="DetallePedidoScreen"
            component={DetallePedido}
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
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
         <StackDirection.Screen
            name="Mapa"
            component={Mapa}
            options={{
               title: 'Seleccionar Ubicación',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         />
         <StackDirection.Screen name="Direcciones" component={Direcciones} />
         <StackDirection.Screen
            name="BusquedaDireccionesScreen"
            component={BusquedaDirecciones}
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         />
         <StackDirection.Screen
            name="MapaDirecciones"
            component={MapaDirecciones}
            options={{
               title: 'Seleccionar Ubicación',
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
            options={{
               title: 'Mapa',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="BusquedaDireccionesScreen"
            component={BusquedaDirecciones}
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="DireccionesCrudScreen"
            component={DireccionesCrud}
            options={{
               title: 'Direcciones',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
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
            options={{
               title: 'Mapa',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="BusquedaDireccionesScreen"
            component={BusquedaDirecciones}
            options={{
               title: '',
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
               headerTintColor: '#fff',
            }}
         ></StackDirection.Screen>
         <StackDirection.Screen
            name="DireccionesCrudScreen"
            component={DireccionesCrud}
            options={navOptionHandler(false)}
         ></StackDirection.Screen>
      </StackDirection.Navigator>
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
            options={{ el: 'Direcciones' }}
         />
         <DrawerHome.Screen
            name="DirectionCrudStack"
            component={DirectionCrudStack}
            options={{ drawerLabel: 'Direcciones' }}
         />
         <DrawerHome.Screen
            name="PerfilUsuario"
            component={PerfilUsuario}
            options={{ drawerLabel: 'Perfil' }}
         />
         <DrawerHome.Screen
            name="ListarDatosFacturacion"
            component={ListarDatosFacturacion}
            options={{ drawerLabel: 'Facturas' }}
         />
      </DrawerHome.Navigator>
   );
}

export default function NavegadorInicio() {
   const [login, setLogin] = useState(null);

   console.log('--NavegadorInicio render');
   if (!global.empiezaCarga) {
      global.empiezaCarga = new Date().getTime();
   }

   const validarLogin = async () => {
      try {
         firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
               setLogin(false);
            } else {
               global.infoUsuario = user.providerData[0];
               if (global.infoUsuario.providerId == 'password') {
                  console.log('--NavegadorInicio ingresa con usuario/clave');
                  if (!user.emailVerified) {
                     Alert.alert(
                        'Información',
                        'Verifique su correo electrónico ' +
                           user.email +
                           ' para continuar'
                     );
                     setLogin(false);
                  } else {
                     if (user) {
                        global.usuario = user.email;
                        global.infoUsuario = user.providerData[0];
                        console.log(
                           '--NavegadorInicio recupera info usuario mail verificado:',
                           new Date().getTime() - global.empiezaCarga,
                           global.infoUsuario
                        );
                        agregaInfo();
                     }
                     setLogin(true);
                  }
               } else {
                  if (user) {
                     global.usuario = user.email;
                     global.infoUsuario = user.providerData[0];
                     console.log(
                        '--NavegadorInicio recupera info usuario logueado por facebook o google:',
                        new Date().getTime() - global.empiezaCarga,
                        global.infoUsuario
                     );
                     agregaInfo();
                  }
                  setLogin(true);
               }
            }
         });
      } catch (error) {
         console.log('error', error);
      }
   };

   const agregaInfo = async () => {
      console.log('--NavegadorInicio ingresa a cargar la info del perfil');

      let documento = {};
      await global.db
         .collection('clientes')
         .doc(global.usuario)
         .get()
         .then(doc => {
            if (doc.data()) {
               documento = doc.data();
               documento.id = doc.id;
               global.appUsuario = documento;
            } else {
               let infoUsuarioGuardar = {};
               infoUsuarioGuardar.nombreCompleto = global.infoUsuario
                  .displayName
                  ? global.infoUsuario.displayName
                  : '';
               infoUsuarioGuardar.telefonoCliente = global.infoUsuario
                  .phoneNumber
                  ? global.infoUsuario.phoneNumber
                  : '';
               global.db
                  .collection('clientes')
                  .doc(global.usuario)
                  .set(infoUsuarioGuardar)
                  .then(() => {
                     console.log('--NavegadorInicio agregado Correctamente');
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
            '--NavegadorInicio dispara useEffect',
            new Date().getTime() - global.empiezaCarga
         );
         validarLogin();
      }
   }, [login]);

   if (login === null) {
      console.log(
         '--NavegadorInicio login es null',
         new Date().getTime() - global.empiezaCarga
      );
      return (
         <Cargando
            isVisible={true}
            text="Cargando"
            color={colores.colorClaroPrimarioVerde}
         ></Cargando>
      );
   } else {
      return (
         <NavigationContainer>
            {login ? (
               HomeDraw()
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
