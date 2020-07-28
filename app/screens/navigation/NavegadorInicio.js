import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { Alert, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//NAVEGACION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
   cargarConfiguracion,
   cargarConfiguracionDev,
} from '../../utils/FireBase';
import { ServicioParametros } from '../../servicios/ServicioParametros';
//PANTALLLAS
import { DetalleCombo } from '../../screens/combos/DetalleCombo';
import DatosFacturacion from '../facturacion/datosFacturacion';
import EditarDatosFacturacion from '../facturacion/editarDatosFacturacion';
import PaginaInicio from '../PaginaInicio';
import Registro from '../account/Registro';
import IniciaSesion from '../account/IniciarSesion';
import PerfilUsuario from '../account/PerfilUsuario';
import { ListarDatosFacturacion } from '../facturacion/listarDatosFacturacion';
import { ResponsabilidadSocial } from '../responsabilidadSocial/ResponsabilidadSocial';
import { QuienesSomos } from '../quienesSomos/QuienesSomos';
import RecuperarCuenta from '../account/RecuperarCuenta';
import { Mapa } from '../map/Mapa';
import { Direcciones } from '../map/Direcciones';
import { BusquedaDirecciones } from '../map/BusquedaDirecciones';
import { DireccionesCrud } from '../map/DireccionesCrud';
import { ListaPedidos } from '../pedidos/ListaPedidos';
import { ListaProductos } from '../productos/ListaProductos';
import { ListaProductosNueva } from '../productos/ListaProductosNueva';
import { CarroCompras } from '../carroCompras/CarroCompras';
import { DetallePedido } from '../pedidos/DetallePedido';
import { ConfirmarCompra } from '../compra/ConfirmarCompra';
import { Notificacion } from '../notificaciones/Notificacion';
import { ListaNotificaciones } from '../notificaciones/ListaNotificaciones';
import { MapaDirecciones } from '../map/MapaDirecciones';
import { PantallaPagos } from '../compra/PantallaPagos';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabProductos1 } from './TabProductos1';
import { TabProductos2 } from './TabProductos2';
import { TabProductos3 } from './TabProductos3';
import { Monedero } from '../monedero/Monedero';
import { AtencionCliente } from '../soporte/AtencionCliente';

//Componentes
import Cargando from '../../components/Cargando';
import * as colores from '../../constants/Colores';
import { Menu } from '../menu/Menu';
import { CabeceraYappando } from '../../components/CabeceraYappando';
import { TerminosCondiciones } from '../terminosCondiciones/TerminosCondiciones';

const StackAuthentication = createStackNavigator();
const StackLogin = createStackNavigator();
const StackDirection = createStackNavigator();
const StackCabecera = createStackNavigator();
const StackFromTabs = createStackNavigator();
const TabHome = createBottomTabNavigator();
const DrawerHome = createDrawerNavigator();
const TopTab = createMaterialTopTabNavigator();
const RootStack = createStackNavigator();

//global.ambiente = 'Dev';
//global.ambiente = 'Prod';
global.ambiente = 'Prod';
if (global.ambiente) {
   if (global.ambiente == 'Dev') {
      Alert.alert('Aplicación en Modo Desarrollo');
      global.rutaImagen = 'gs://yappandopruebas.appspot.com/images/';
      if (!global.firebaseRegistradoDev) {
         cargarConfiguracionDev();
      }
   } else if (global.ambiente == 'Prod') {
      global.rutaImagen = 'gs://little-market-dev-377b6.appspot.com/images/';
      if (!global.firebaseRegistrado) {
         cargarConfiguracion();
      }
   } else {
      Alert.alert('AMBIENTE NO CONFIGURADO');
   }
}
const validarVersion = version => {
   if (version.valor != global.version) {
      Alert.alert(
         'Problemas de versión',
         'La versión actual: ' +
         global.version +
         ' no corresponde a la versión oficial ' +
         version.valor +
         '. Cierre la aplicación y vuelva abrir.'
      );
   }
};

let servParametros = new ServicioParametros();
servParametros.obtenerVersion(validarVersion);

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

function TabsProductos() {
   return (
      <TopTab.Navigator
         tabBarOptions={{
            labelStyle: { fontSize: 12 },
            indicatorStyle: {
               color: 'red',
               backgroundColor: colores.colorPrimarioTomate,
            },

            activeTintColor: colores.colorPrimarioTomate,
         }}
         initialRouteName="Frutas"
      >
         <TopTab.Screen name="Frutas" component={TabProductos1} />
         <TopTab.Screen
            name="Verduras"
            component={TabProductos2}
            options={{
               tabBarLabel: 'Verduras y Legumbres',
            }}
         />
         <TopTab.Screen name="Otros" component={TabProductos3} />
      </TopTab.Navigator>
   );
}

function ScreensFromTabs() {
   return (
      <StackFromTabs.Navigator initialRouteName="ListaProductosNueva">
         <StackFromTabs.Screen
            options={{
               headerTitle: props => <CabeceraYappando />,
               headerStyle: {
                  backgroundColor: colores.colorPrimarioVerde,
                  elevation: 0, //remove shadow on Android
                  shadowOpacity: 0, //remove shadow on iOS
               },
            }}
            name="Home"
            component={TabsProductos}
         />
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

         <StackDirection.Screen
            name="CarroComprasScreen"
            component={CarroCompras}
            options={navOptionHandler(false)}
         />
         <StackFromTabs.Screen
            name="NotificacionScreen"
            component={Notificacion}
            options={navOptionHandler(false)}
         />

         <StackFromTabs.Screen
            name="PerfilUsuarioScreen"
            component={PerfilUsuario}
            options={navOptionHandler(false)}
         />
         <StackFromTabs.Screen
            name="ListarDatosFacturacionScreen"
            component={ListarDatosFacturacion}
            options={navOptionHandler(false)}
         />

         <StackFromTabs.Screen
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
         <StackFromTabs.Screen
            name="Soporte"
            component={AtencionCliente}
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
         <StackFromTabs.Screen
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
         <StackFromTabs.Screen
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
         <StackFromTabs.Screen
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
         <StackFromTabs.Screen name="Direcciones" component={Direcciones} />
         <StackFromTabs.Screen
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
         <StackFromTabs.Screen
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
         <StackFromTabs.Screen
            name="PantallaPagos"
            component={PantallaPagos}
            options={{
               title: 'Pantalla de Pagos',
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
         <StackLogin.Screen
            name="TerminosCondiciones"
            component={TerminosCondiciones}
            options={navOptionHandler(false)}
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
            name="ScreensFromTabs"
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
         <DrawerHome.Screen
            name="ListaPedidos"
            component={ListaPedidos}
            options={{ drawerLabel: 'ListaPedidos' }}
         />
         <DrawerHome.Screen name="Monedero" component={Monedero} />

         <DrawerHome.Screen
            name="ResponsabilidadSocial"
            component={ResponsabilidadSocial}
            options={{ drawerLabel: 'Fundación Aliñambi' }}
         />
         <DrawerHome.Screen
            name="QuienesSomos"
            component={QuienesSomos}
            options={{ drawerLabel: 'Quienes Somos' }}
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
                     console.log('----Mail no vefificado---');
                     global.mailVerificado = false;
                     global.usuario = user.email;
                     setLogin(false);
                     if (global.refrescarInicioSesion) {
                        global.refrescarInicioSesion();
                     }
                  } else {
                     global.mailVerificado = true;
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

                  
                 /* AQUI INTENTE HACER LA VALIDACION PARA LA NAVEGACION SE DEBE
                 BUSCAR SI EL CLIENTE YA TIENE LA VARIABLE EN TRUE PARA QUE NO SE LE MUESTRE LA 
                 PANTALLA DE TERMINOS 
                 await global.db
                     .collection('clientes')
                     .doc(global.usuario)
                     .get()
                     .then(doc => {
                        console.log("--RECUPERA TERMINOS---" + doc.data().terminosCondiciones)
                        global.aceptaTerminos = doc.data().terminosCondiciones;
                     })
                     .catch(error => {
                        console.log(error);
                     });

                  if (!global.aceptaTerminos) {
                     nav.navigate('TerminosCondiciones', { ingresar: FUNCION PARA EL BOTON ACEPTAR DE ESTA PANTALLA });
                  } else {
                     setLogin(true);
                  }*/

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
               if (!doc.data().terminosCondiciones) {
                  global.db
                     .collection('clientes')
                     .doc(global.usuario)
                     .update({ terminosCondiciones: global.aceptaTerminos })
                     .then(() => {
                        console.log('---UPDATE TERMINOS----');
                     })
                     .catch(error => {
                        console.log(error);
                     });
               }
            } else {
               let infoUsuarioGuardar = {};
               console.log("NOMBRE COMPLETO" + global.infoUsuario
                  .displayName);
               infoUsuarioGuardar.nombreCompleto = global.infoUsuario
                  .displayName
                  ? global.infoUsuario.displayName
                  : '';
               infoUsuarioGuardar.telefonoCliente = global.infoUsuario
                  .phoneNumber
                  ? global.infoUsuario.phoneNumber
                  : '';
               infoUsuarioGuardar.terminosCondiciones = global.aceptaTerminos;
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
            color={colores.colorPrimarioVerde}
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
