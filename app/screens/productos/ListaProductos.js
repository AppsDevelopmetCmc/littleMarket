import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import * as serviciosItem from '../../servicios/ServiciosItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, withBadge } from 'react-native-elements';

import { ServiciosItem } from '../../servicios/ServiciosItem';

// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import { ServicioMonederos } from '../../servicios/ServicioMonederos';
import * as serviciosCarrito from '../../servicios/ServicioCarroCompras';
//Importando los colores
import * as colores from '../../constants/Colores';
import { ItemDireccionSeleccion } from '../map/compnentes/ItemDireccionSeleccion';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { apiKeyMaps, APIKEY } from '../../utils/ApiKey';

import * as Permisos from 'expo-permissions';
import { Notificaciones } from 'expo';

import { PopupCalificaciones } from '../calificacion/PopupCalificaciones';
import { SeleccionarDireccion } from '../direcciones/SeleccionarDireccion';
import Separador from '../../components/Separador';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { ServicioNotificaciones } from '../../servicios/ServicioNotificaciones';
import { ServicioDirecciones,generarDireccion } from '../../servicios/ServicioDirecciones';
import { Bienvenida } from '../combos/Bienvenida';
import { ItemProducto } from './ItemProducto';
import { NavegadorCategorias } from './NavegadorCategorias';
import { Numero } from './Numero';
import { transformDinero } from '../../utils/Validaciones';
import { ServicioCobertura } from '../../servicios/ServicioCobertura';
import { ServicioParametros } from '../../servicios/ServicioParametros';

export class ListaProductos extends Component {
   constructor(props) {
      super(props);
      // let direcciones = [];
      /*  if (this.props.route.params != null) {
         this.notienecobertura = this.props.route.params.notienecobertura;
      }*/
      global.categoria = 'V';
      this.sector = '';
      this.tieneCoberturaDireccion='N';
      this.state = {
         listaProductos: [],
         subtotal: 0,
         delivery: 1.5,
         total: 0,
         //   listaDireccionesCobertura: direcciones,
         mostrarModalDirecciones: false,
         direccionPedido: null,
         pedidoCalifica: {},
         estadocalifica: false,
         valorMonedero: 0,
         numeroNotificaciones: 0,
         mostrarInstrucciones: true,
      };
      global.pintarLista = this.pintarLista;
      //let srvCombos = new ServicioCombos();
      // srvCombos.recuperarItems(this.repintarLista);
      //global.repintarDireccion = this.repintarDireccionPrincipal;
      // global.repintarSeleccionProductos = this.repintarSeleccionProductos;
      let servCobertura = new ServicioCobertura();
      servCobertura.getRegistrarCoberturaTodas();

      let servParametros = new ServicioParametros();
      servParametros.getObtenerParametroId(
         'geo',
         this.obtenerParametroCobertura
      );
   }
   obtenerParametroCobertura = parametro => {
      global.parametrosGeo = parametro;
      console.log('parametrosGeo', global.parametrosGeo.cobertura);
   };
   repintarDireccionPrincipal = () => {
      if (global.direccionPedido) {
         this.setState({ direccionPedido: global.direccionPedido.descripcion });
      }
   };
   cambioVisibleCalifica = visible => {
      this.setState({ estadocalifica: visible });
   };
   pintarSeleccionProductos = () => {
      console.log('--ListaProductos pintarSeleccionProductos');
      let productos = this.state.listaProductos;
      let productosSeleccionados = global.items;
      if (productos) {
         for (let i = 0; i < productos.length; i++) {
            productos[i].checked = false;
            productos[i].itemCarro = { cantidad: 0 };
            if (productosSeleccionados) {
               for (let j = 0; j < productosSeleccionados.length; j++) {
                  if (productos[i].id == productosSeleccionados[j].id) {
                     productos[i].checked = true;
                     productos[i].itemCarro = productosSeleccionados[j];
                  }
               }
            }
         }
      }
      let subtotal = 0;
      let delivery = 1.5;
      for (let i = 0; i < productosSeleccionados.length; i++) {
         subtotal =
            subtotal +
            productosSeleccionados[i].precio *
               productosSeleccionados[i].cantidad;
      }
      global.total = subtotal + delivery;
      global.delivery = delivery;
      global.subtotal = subtotal;
      this.setState({ listaProductos: productos, subtotal: subtotal });
   };

   componentDidMount() {
      console.log('--ListaProductos recuperarItems');
      serviciosItem.recuperarItems(this.pintarLista);
      serviciosCarrito.registrarEscucha(
         global.usuario,
         this.pintarSeleccionProductos
      );
      /*new ServicioDirecciones().recuperarPrincipal(
         global.usuario,
         this.refrescarDireccion
      );*/
      let srvDirecciones=new ServicioDirecciones()
     /* if(!global.direccionPedido)*/
      {
       srvDirecciones.obtenerDirecciones(global.usuario,this.validarCobertura)
      }
      
     // this.validarCobertura();
      // this.obtenerPedidoCalifica(global.usuario);

      //  this.obtenerCoordenadas();
      //  this.notienecobertura=this.props.route.params.notienecobertura1
      /*  if (this.notienecobertura == 'N') {
         Alert.alert('Información', 'No existe Cobertura para la Direccion ');
      }
      */
      // getToken();
      //global.repintarSeleccionProductos = this.repintarSeleccionProductos;
      /* serviciosCarrito.registrarEscucha(
         global.usuario,
         this.repintarSeleccionProductos
      );*/
      /* serviciosCarrito.registrarEscucha(
         global.usuario,
         this.repintarSeleccionProductos
      );*/
      /* this._unsubscribe = this.props.navigation.addListener('focus', () => {
         console.log('FOCUS LISTA COMBOS');
         this.repintarSeleccionProductos();
         serviciosCarrito.registrarEscucha(
            global.usuario,
            this.repintarSeleccionProductos
         );
      });*/

      /* let srvMonederos = new ServicioMonederos();
      console.log('registrando monedero');
      srvMonederos.registarEscuchaMonedero(
         global.usuario,
         this.repintarMonedero
      );

      let srvNotificaciones = new ServicioNotificaciones();
      console.log('registrando escucha Notificaciones');
      srvNotificaciones.registarEscuchaNotificacion(
         global.usuario,
         this.repintarNumeroNotificaciones
      );*/
   }

   repintarNumeroNotificaciones = notificaciones => {
      console.log('------Notificaciones', notificaciones);

      if (notificaciones) {
         this.setState({ numeroNotificaciones: notificaciones.numero });
      } else {
         this.setState({ numeroNotificaciones: 0 });
      }
   };

   componentWillUnmount() {
      //  this._unsubscribe();
   }
   validarCobertura = async () => {
      Geocoder.init(APIKEY);
      let response = await Location.requestPermissionsAsync();
      if (response.status !== 'granted') {
         Alert.alert('Error', 'no se otorgaron permisos en el dispositivo');
      }
      let actualLocation = await Location.getCurrentPositionAsync({});
      global.localizacionActual = actualLocation.coords;
      console.log('actual location:', global.localizacionActual);

      generarDireccion(
         global.localizacionActual.latitude,
         global.localizacionActual.longitude,
         this.obtenerDireccionPedido
      );
      this.obtenerDireccionPedido();
   };
   //Obtiene la ultima direccion usada en un pedido
   //Si no existen direcciones en el pedido, agrega una usando el punto actual
   obtenerDireccionPedido = async (direccionNombre,latitud,longitud) => {
      let pedido = null;
      await this.validar(latitud, longitud);
      if (!pedido) {
         new ServicioDirecciones().crear(global.usuario, {
            descripcion: direccionNombre,
            latitud: latitud,
            longitud: longitud,
            alias:'',
            principal:'N',
            referencia:'',
            tieneCoberturaDireccion:this.tieneCoberturaDireccion


         });
      }
      if (this.tieneCoberturaDireccion=='N') {
         Alert.alert(
            'Advertencia',
            'No existe cobertura en el sector donde se encuentra'
         );
      } else {
         console.log('SI existe cobertura');
      }

   };
   validarSector = ubicacion => {
      return Math.random() > 0.3;
   };

   //Guardar Direcciones
   validar = async(lat, long) => {
      let lat1 = lat;
      let log1 = long;
      for (let i = 0; i < global.coberturas.length; i++) {
         let distancia = 0;
         distancia = parseFloat(
            this.getKilometros(
               lat1,
               log1,
               global.coberturas[i].latitud,
               global.coberturas[i].longitud
            )
         );
         console.log('Kilomeros' + distancia);
         if (distancia < global.parametrosGeo.cobertura) {
            console.log('Ingresa');
            this.tieneCoberturaDireccion = 'S';
            break;
         }
      }
   };

   rad = x => {
      return (x * Math.PI) / 180;
   };

   getKilometros = (lat1, lon1, lat2, lon2) => {
      let R = 6378.137; //Radio de la tierra en km
      let dLat = this.rad(lat2 - lat1);
      console.log('rad1' + this.rad(lat2 - lat1));
      let dLong = this.rad(lon2 - lon1);
      let a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(this.rad(lat1)) *
            Math.cos(this.rad(lat2)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      return d.toFixed(3); //Retorna tres decimales
   };

   pintarLista = items => {
      console.log('--ListaProductos pintarLista');
      this.setState({ listaProductos: items });
      this.pintarSeleccionProductos();

      /*      if (this.montado) {
         let subtotal = 0;
         let delivery = 1.5;
         for (let i = 0; i < global.items.length; i++) {
            subtotal += Number(global.items[i].subtotal);
         }
         global.total = subtotal + delivery;
         global.delivery = delivery;
         global.subtotal = subtotal;
         this.setState({
            listItems: global.items,
            subtotal: subtotal,
            total: subtotal + delivery,
         });
      }*/
      //global.productos = items;
      ///repintarSeleccionProductos();
   };


   obtenerPedidoCalifica = async mail => {
      //  console.log('mail', mail);
      //  console.log('Ingreso a recuperar el pedido');

      global.db
         .collection('pedidos')
         .where('mail', '==', mail)
         .where('estado', '==', 'PE')
         .get()
         .then(querySnapshot => {
            let pedido = {};
            querySnapshot.forEach(doc => {
               //   console.log('doc', doc);
               if (doc.exists) {
                  console.log('Pedido:', doc.data());

                  pedido = doc.data();
                  pedido.id = doc.id;
                  this.setState({
                     pedidoCalifica: pedido,
                     estadocalifica: true,
                  });
               }
            });
         })
         .catch(error => {
            console.log(error);
         });
   };

   abrirDrawer = () => {
      this.props.navigation.openDrawer();
   };

   abrirCarrito = () => {
      this.props.navigation.navigate('CarroComprasScreen');
   };

   abrirMonedero = () => {
      //mostrar el valor
      //this.props.navigation.navigate('CarroComprasScreen');
   };

   abrirNotificacion = () => {
      this.props.navigation.navigate('NotificacionScreen');
   };

   abrirListaNotificacion = () => {
      this.props.navigation.navigate('ListaNotificacionScreen');
      if (
         this.state.numeroNotificaciones &&
         this.state.numeroNotificaciones > 0
      ) {
         this.encerarNotificaciones();
      }
   };
   encerarNotificaciones = () => {
      let srvNotificaciones = new ServicioNotificaciones();
      console.log('encerando notificaciones');
      srvNotificaciones.actualizarNotificaciones({
         mail: global.usuario,
         numero: 0,
      });
   };

   /* repintarDireccion = direcciones => {
      this.setState({
         listaDireccionesCobertura: direcciones,
         mostrarModalDirecciones: true,
      });
   };*/
   repintarMonedero = monedero => {
      console.log('------mondero', monedero);
      if (monedero) {
         this.setState({ valorMonedero: monedero.valor });
      } else {
         this.setState({ valorMonedero: 0 });
      }
   };

   seleccionarDireccion = direccion => {
      if (direccion.tieneCoberturaDireccion == 'S') {
         global.direccionPedido = direccion;
         this.refrescarDireccion();
      } else {
         Alert.alert(
            'Información',
            'La Dirección Seleccionada no tiene Cobertura'
         );
      }
      this.setState({ mostrarModalDirecciones: false });
   };

   refrescarDireccion = () => {
      this.setState({
         direccionPedido: global.direccionPedido.descripcion,
      });
   };

   mostrarModal = bandera => {
      this.setState({ mostrarModalDirecciones: bandera });
   };

   flatListItemSeparator = () => {
      return (
         <View
            style={{
               width: '100%',
               marginVertical: 5,
               alignItems: 'center',
               justifyContent: 'center',
               alignContent: 'center',
               paddingLeft: 20,
            }}
         >
            <View
               style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: colores.colorClaroPrimario,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
               }}
            ></View>
         </View>
      );
   };
   cerrarBienvenida = () => {
      this.setState({ mostrarInstrucciones: false });
   };

   asignarSector = async () => {
      let srvCobertura = new ServicioCobertura();
      this.sector = await srvCobertura.consultarCobertura(
         global.localizacionActual.latitude,
         global.localizacionActual.longitude
      );
      console.log(
         'LATITUD LONGITUD' +
            global.localizacionActual.latitude +
            '=' +
            global.localizacionActual.longitude
      );
      console.log('SECTOR' + this.sector.sector);
      Alert.alert('SECTOR ASIGNADO' + this.sector.sector);
   };

   render() {
      const BadgedIcon = withBadge(1)(Icon);
      console.log('--ListaProductos render');
      return (
         <SafeAreaView style={styles.container}>
            <View style={styles.cabeceraContenedor}>
               <View style={styles.cabeceraBoton}>
                  <Icon
                     name="menu"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirDrawer}
                  />
               </View>
               <View style={styles.cabeceraTitulo}>
                  <Text style={styles.titulo}>Yappando</Text>
               </View>
               <View style={styles.iconoBadge}>
                  <TouchableHighlight
                     onPress={() => {
                        if (
                           this.state.valorMonedero &&
                           this.state.valorMonedero > 0
                        ) {
                           Alert.alert(
                              'Felicidades',
                              'Usted tiene : $' +
                                 this.state.valorMonedero.toFixed(2) +
                                 ' para usar en su próxima compra'
                           );
                        }
                     }}
                     underlayColor={colores.colorPrimarioVerde}
                  >
                     <View style={styles.areaBadge}>
                        <View>
                           <Icon
                              color={colores.colorBlanco}
                              type="material"
                              name="square-inc-cash"
                              size={28}
                           />
                           {this.state.valorMonedero &&
                           this.state.valorMonedero > 0 ? (
                              <Badge
                                 //textStyle={{ fontSize: 10 }}
                                 //3 caracteres
                                 //value={this.state.valorMonedero}
                                 containerStyle={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -4,
                                 }}
                                 status="error"
                              />
                           ) : (
                              <View></View>
                           )}
                        </View>
                     </View>
                  </TouchableHighlight>
               </View>
               <View style={styles.iconoBadge}>
                  <TouchableHighlight
                     onPress={() => {
                        this.abrirListaNotificacion();
                     }}
                     underlayColor={colores.colorPrimarioVerde}
                  >
                     <View style={styles.areaBadge}>
                        <View>
                           <Icon
                              color={colores.colorBlanco}
                              type="material"
                              name="bell"
                              size={28}
                           />
                           {this.state.numeroNotificaciones &&
                           this.state.numeroNotificaciones > 0 ? (
                              <Badge
                                 value={this.state.numeroNotificaciones}
                                 containerStyle={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -4,
                                 }}
                                 status="error"
                              />
                           ) : (
                              <View></View>
                           )}
                        </View>
                     </View>
                  </TouchableHighlight>
               </View>
               {/*
               <View style={styles.iconoBadge}>
                  <TouchableHighlight
                     onPress={() => {
                        this.abrirCarrito();
                     }}
                     underlayColor={colores.colorPrimarioVerde}
                  >
                     <View style={styles.areaBadge}>
                        <View>
                           <Icon
                              color={colores.colorBlanco}
                              type="material"
                              name="cart"
                              size={28}
                           />
                           {global.items && global.items.length > 0 ? (
                              <Badge
                                 value={global.items.length}
                                 containerStyle={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -4,
                                 }}
                                 status="error"
                              />
                           ) : (
                              <View></View>
                           )}
                        </View>
                     </View>
                  </TouchableHighlight>
               </View>*/}
            </View>

            {/*this.state.direccionPedido ? (
               <View style={{ paddingVertical: 10 }}>
                  <Text style={{ marginLeft: 20, color: 'gray' }}>
                     Dirección de Entrega
                  </Text>

                  <Separador alto={5} />
                  <View style={styles.contenedorDireccione}>
                     <View style={{ flex: 1 }}>
                        <Icon
                           name="map-marker"
                           size={20}
                           color="black"
                           style={styles.iconos}
                        />
                     </View>
                     <View style={{ flex: 10 }}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.state.direccionPedido}
                        </Text>
                     </View>
                     <View style={{ flex: 2 }}>
                        <Button
                           onPress={() => {
                              this.setState({ mostrarModalDirecciones: true });
                           }}
                           buttonStyle={{
                              backgroundColor: 'rgba(255,255,255,0)',
                           }}
                           icon={
                              <Icon
                                 name="pencil"
                                 size={20}
                                 color={colores.colorPrimarioTomate}
                                 style={styles.iconos}
                              />
                           }
                        ></Button>
                     </View>
                  </View>
               </View>
            ) : (
               <View>
                  <Text style={{ marginLeft: 20, color: 'gray' }}>
                     Dirección de Entrega
                  </Text>
                  <View style={styles.contenedorDireccione}>
                     <Text></Text>
                  </View>
               </View>
            )*/}

            {/* <Modal
               //animationType="slide"
               transparent={true}
               visible={this.state.mostrarInstrucciones}
            >
               <Bienvenida cerrar={this.cerrarBienvenida}></Bienvenida>
           </Modal>*/}

            <View style={styles.pie}>
               <View style={{ height: 40 }}>
                  <NavegadorCategorias></NavegadorCategorias>
               </View>
               <View style={styles.lista}>
                  <FlatList
                     data={this.state.listaProductos}
                     renderItem={({ item }) => {
                        return (
                           <ItemProducto
                              nav={this.props.navigation}
                              producto={item}
                           />
                        );
                     }}
                     keyExtractor={producto => {
                        return producto.id;
                     }}
                     // ItemSeparatorComponent={this.flatListItemSeparator}
                  />
               </View>
               <View
                  style={{
                     flex: 1,
                     paddingVertical: 20,
                     paddingHorizontal: 20,
                     paddingRight: 12,
                     flexDirection: 'row',
                     borderTopColor: colores.colorPrimarioTomate,
                     borderTopWidth: 1,
                  }}
               >
                  <View style={{ flex: 1 }}>
                     <TouchableHighlight
                        onPress={() => {
                           this.asignarSector();
                           this.props.navigation.navigate(
                              'ConfirmarCompraScreen'
                           );
                        }}
                     >
                        <View
                           style={{
                              flexDirection: 'row',
                              paddingHorizontal: 10,
                              height: 40,
                              borderRadius: 10,
                              backgroundColor: colores.colorPrimarioTomate,
                           }}
                        >
                           <View style={{ flex: 2, alignItems: 'center' }}>
                              <View style={styles.areaBadge}>
                                 <View>
                                    <Icon
                                       color={colores.colorBlanco}
                                       type="material"
                                       name="cart"
                                       size={28}
                                    />
                                    {global.items && global.items.length > 0 ? (
                                       <Badge
                                          value={global.items.length}
                                          containerStyle={{
                                             position: 'absolute',
                                             top: -4,
                                             right: -4,
                                          }}
                                          status="error"
                                       />
                                    ) : (
                                       <View></View>
                                    )}
                                 </View>
                              </View>
                           </View>
                           <View
                              style={{
                                 flex: 7,
                                 alignItems: 'center',
                                 justifyContent: 'center',
                              }}
                           >
                              <Text
                                 style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: colores.colorBlancoTexto,
                                 }}
                              >
                                 Confirmar
                              </Text>
                           </View>
                           <View
                              style={{
                                 flex: 3,
                                 alignItems: 'flex-end',
                                 justifyContent: 'center',
                              }}
                           >
                              <Text
                                 style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: colores.colorBlancoTexto,
                                 }}
                              >
                                 $ {this.state.subtotal.toFixed(2)}
                              </Text>
                           </View>
                        </View>
                     </TouchableHighlight>
                  </View>
                  {/*} <View
                     style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        //  backgroundColor: 'red',
                     }}
                  >
                     <Numero
                        titulo="SUBTOTAL:"
                        valor={transformDinero(this.state.subtotal)}
                     ></Numero>
                     <Numero
                        titulo="ENVÍO:"
                        valor={transformDinero(this.state.delivery)}
                     ></Numero>
                     <Numero
                        titulo="TOTAL:"
                        valor={transformDinero(this.state.total)}
                        estiloNumero={{ fontWeight: 'bold', fontSize: 18 }}
                     ></Numero>
                  </View>*/}
               </View>
            </View>
            <PopupCalificaciones
               isVisible={this.state.estadocalifica}
               pedido={this.state.pedidoCalifica}
               cambioVisibleCalifica={this.cambioVisibleCalifica}
            ></PopupCalificaciones>
            {/* <ActionButton
               buttonColor={'red'}
               renderIcon={() => {
                  return (
                     <Icon
                        name="arrow-right-bold"
                        size={30}
                        color={colores.colorBlanco}
                        style={styles.iconos}
                     />
                  );
               }}
               onPress={() => {
                  this.abrirCarrito();
               }}
            ></ActionButton> */}
         </SafeAreaView>
      );
   }
}
const flatListItemSeparator = () => {
   return (
      <View
         style={{
            width: '100%',

            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
         }}
      >
         <View
            style={{
               height: 0.5,
               width: '100%',
               backgroundColor: colores.colorOscuroTexto,
               alignItems: 'center',
               justifyContent: 'center',
               alignContent: 'center',
            }}
         ></View>
      </View>
   );
};

const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   boton: {
      paddingVertical: 5,
      marginRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
   },
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      marginTop: 10,
   },
   modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
      /* alignItems: 'stretch',
      justifyContent: 'center',*/
   },
   fondo: {
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 0,
      width: 200,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
   },
   cabecera: {
      flex: 1,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },
   lista: {
      flex: 15,
      marginBottom: 10,
   },
   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },

   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
   },
   contenedorDireccione: {
      marginHorizontal: 20,
      backgroundColor: colores.colorBlanco,
      height: 40,
      borderRadius: 20,
      //justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 3,
      flexDirection: 'row',
      // backgroundColor: 'red',
   },
   pie: {
      flex: 3,
      backgroundColor: colores.colorBlanco,
      //borderTopStartRadius: 20,
      // borderTopEndRadius: 20,
      marginTop: 15,
      paddingTop: 10,
   },
   texto: {
      fontSize: 13,
      fontWeight: 'bold',
   },
   estiloContenedorTitulo: {
      paddingBottom: 10,
   },
   contenedorTituloSubr: {
      borderBottomColor: colores.colorOscuroTexto,
      borderBottomWidth: 1,
   },
   estiloBotonBlanco: {
      backgroundColor: colores.colorPrimarioAmarillo,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   estiloBotonVerde: {
      backgroundColor: colores.colorPrimarioVerde,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   estiloContenedor: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   iconos: { marginRight: 0 },
   cabeceraContenedor: {
      flexDirection: 'row',
      // height: 50,
      marginRight: 20,
      marginLeft: 10,
   },
   cabeceraBoton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   cabeceraTitulo: {
      flex: 5,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginHorizontal: 10,
      //backgroundColor: 'red',
   },
   titulo: {
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
   },
   iconoBadge: {
      //  backgroundColor: 'pink',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flex: 2,
   },
   areaBadge: {
      //  backgroundColor: 'blue',
      //flex: 1,
      paddingTop: 10,
      paddingBottom: 5,
      paddingHorizontal: 5,
   },
});
