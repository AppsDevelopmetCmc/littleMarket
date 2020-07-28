import React, { Component } from 'react';
import {
   Text,
   View,
   FlatList,
   StyleSheet,
   ScrollView,
   Linking,
   Alert,
   Modal,
   TouchableHighlight,
   TextInput,
} from 'react-native';
import { Button, Card, Input } from 'react-native-elements';
import { crearPedido, ServicioPedidos } from '../../servicios/ServicioPedidos';
import firebase from 'firebase';
import '@firebase/firestore';
import { transformDinero } from '../../utils/Validaciones';
import RNPickerSelect from 'react-native-picker-select';
import RadioForm, {
   RadioButton,
   RadioButtonInput,
   RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { Numero } from '../carroCompras/componentes/Numero';
//Importacion de los colores
import * as colores from '../../constants/Colores';
import Cargando from '../../components/Cargando';
import Separador from '../../components/Separador';
import { ServicioParametros } from '../../servicios/ServicioParametros';
import { formatearFechaISO, obtenerHoraActual } from '../../utils/DateUtil';
import { SeleccionarDireccion } from '../direcciones/SeleccionarDireccion';
import { ServicioCodigos } from '../../servicios/ServicioCodigos';
import { ServicioMonederos } from '../../servicios/ServicioMonederos';
import { URLPAGOS } from '../../utils/ApiKey';
import {
   convertirFormaPago,
   convertirEstadoPago,
   convertirRadioPago,
   convertirFactuacion,
} from '../../utils/ConvertirFormaPago';

import { Selector } from '../../components/Selector';
import { servParametros } from '../../servicios/ServicioParametros';
import { isNill } from 'lodash';
/* export const TOKEN = '2y-13-tx-zsjtggeehkmygjbtsf-51z5-armmnw-ihbuspjufwubv4vxok6ery7wozao3wmggnxjgyg'
export const URLPAGOS = 'https://cloud.abitmedia.com/api/payments/create-payment-request?access-token=' + TOKEN;  
 */

export class ConfirmarCompra extends Component {
   constructor() {
      super();
      if (!global.pagoSeleccionado) {
         global.pagoSeleccionado = 'EF';
      }
      if (!global.factSeleccionado) {
         global.factSeleccionado = 'CF';
      }
      global.refrescarFact = this.refrescarDatosFactura;
      this.state = {
         fechaSeleccionada: global.fechaSeleccionada,
         horarioSeleccionado: global.horarioSeleccionado,
         fechas: [],
         horarios: [],
         horariosFecha: [],
         direccion: global.direccionPedido.descripcion,
         referencia: global.direccionPedido.referencia,
         pagoSeleccionado:
            global.pagoSeleccionado == 'TR'
               ? 1
               : global.pagoSeleccionado == 'EF'
               ? 0
               : 2,
         deshabilitado: true,
         mostrarModalDirecciones: false,
         codigoPromo: '',
         errorCodigoPromo: '',
         valorMonedero: 0,
         valorDescuento: 0,
         valorDescontado: global.subtotal,
         mostrarCargando: false,
         nombreCliente: global.appUsuario.nombreCompleto,
         telefonoCliente: global.appUsuario.telefonoCliente,
         msmCoberturaDireccion:
            global.direccionPedido.tieneCoberturaDireccion == 'S'
               ? true
               : false,
         numDocumentoFact: '',
         direccionFact: '',
         nombreCompletoFact: '',
         correoFact: '',
         mostrarFacturacion: false,
         telefonoFact: '',
      };
      global.repintarUsuario = this.repintarUsuario;
      this.radio_props = [
         { label: 'Efectivo   ', value: 'EF' },
         { label: 'Transferencia', value: 'TR' },
         /*{ label: 'Tarjeta', value: 'TA' },*/
      ];
      this.radio_props_fac = [
         { label: 'Consumidor Final   ', value: 'CF' },
         { label: 'Factura', value: 'FA' },
         /*{ label: 'Tarjeta', value: 'TA' },*/
      ];
      let serv = new ServicioParametros();
      serv.getObtenerParametroId('envio', this.obtenerParametroEnvio);
   }
   refrescarDatosFactura = factura => {
      this.setState({
         numDocumentoFact: factura.numDocumento,
         direccionFact: factura.alias,
         nombreCompletoFact: factura.nombreCompleto,
         correoFact: factura.correo,
         telefonoFact: factura.telefono,
      });
   };
   obtenerParametroEnvio = parametro => {
      global.delivery = parametro.precio;
      this.setState({
         valorDescontado: global.subtotal + global.delivery,
      });
      console.log('global.delivery', global.delivery);
   };

   refrescarDireccion = () => {
      this.setState({
         direccion: global.direccionPedido.descripcion,
         referencia: global.direccionPedido.referencia,
         msmCoberturaDireccion:
            global.direccionPedido.tieneCoberturaDireccion == 'S'
               ? true
               : false,
      });
   };
   cargarCombos = (fechas, horarios) => {
      this.setState({ fechas: fechas, horarios: horarios });
   };
   cargarHorarioFecha = (fecha, horarios) => {
      let horariosTmp = [];
      horarios.forEach(element => {
         console.log(element);
         if (element.estado === 'V' && element.fecha === fecha) {
            horariosTmp.push(element);
         }
         this.setState({ horariosFecha: horariosTmp });
      });
   };
   componentDidMount() {
      console.log('llega confirmar Compra');
      new ServicioParametros().obtenerParamsFechas(this.cargarCombos);
      let srvMonederos = new ServicioMonederos();
      this.setState({ valorMonedero: 0, valorDescuento: 0 });
      this.unsubscribe = srvMonederos.registarEscuchaMonederoCompra(
         global.usuario,
         this.repintarMonedero
      );
   }
   repintarMonedero = monedero => {
      console.log('mondero en confirmar Compra', monedero);
      if (monedero) {
         this.setState({
            valorMonedero: monedero.valor,
            valorDescuento: monedero.valorDescuento,
         });
      } else {
         this.setState({ valorMonedero: 0, valorDescuento: 0 });
      }
   };

   componentWillUnmount() {
      console.log('componentWillUnmount');
      this.unsubscribe();
   }
   componentWillReceiveProps(next_props) {
      console.log('next Prop', next_props);
      if (next_props.route.params.origen == 'mapaDirecciones') {
         this.refrescarDireccion();
      }
   }

   cerrarPantalla = () => {
      this.props.navigation.popToTop();
   };
   mostrarModal = bandera => {
      this.setState({ mostrarModalDirecciones: bandera });
   };
   seleccionarDireccion = direccion => {
      if (direccion.tieneCoberturaDireccion == 'S') {
         global.direccionPedido = direccion;
         this.refrescarDireccion();
      } /*else {
         Alert.alert(
            'Información',
            'La Dirección Seleccionada no tiene Cobertura'
         );
      }*/
      this.setState({ mostrarModalDirecciones: false });
   };
   generarNumeroOrden = async fn => {
      console.log('Ingresa a generar Orden');
      let numero, codigo;
      let limite = 10;
      if (!this.state.nombreCliente || !this.state.telefonoCliente) {
         Alert.alert(
            'Información',
            'Debe ingresar el nombre y el teléfono del cliente'
         );
      } else if (
         !this.state.horarioSeleccionado ||
         !this.state.fechaSeleccionada
      ) {
         Alert.alert(
            'Información',
            'Debe elegir una fecha y horario de entrega'
         );
      } /* else if (global.direccionPedido.tieneCoberturaDireccion == 'N') {
         Alert.alert(
            'Información',
            'La Direccion de Entrega no tiene cobertura'
         );
         }  */ else if (
         !global.direccionPedido.referencia
      ) {
         Alert.alert(
            'Información',
            'La dirección de entrega no tiene una referencia (Edificio/Número Casa/Color Casa/etc...) \n\nPor favor edite su dirección en la sección datos de entrega. '
         );
      } else if (
         global.factSeleccionado == 'FA' &&
         this.state.numDocumentoFact == ''
      ) {
         Alert.alert('Debe completar la información de facturación');
      } else {
         numero = await new ServicioParametros().obtenerSecuencial();
         console.log('Generar Orden, pasa todas las validaciones');
         if (numero) {
            new ServicioParametros().actualizarSecuencial(numero);
            codigo = '' + numero;
            for (let i = 0; i < limite; i++) {
               if (codigo.length < limite) {
                  codigo = '0' + codigo;
               }
            }
            codigo = 'YPP' + codigo;
         }
         fn(codigo);
      }
   };

   seleccionarFacturacion = valor => {
      global.factSeleccionado = valor;
      if (global.factSeleccionado != 'CF') {
         this.setState({ mostrarFacturacion: true });
      } else {
         this.setState({ mostrarFacturacion: false });
      }
   };
   seleccionarFormaPago = valor => {
      this.setState({ pagoSeleccionado: valor });
      global.pagoSeleccionado = valor;
   };
   validarCodigoPromo = () => {
      let srvCodigos = new ServicioCodigos();
      this.setState({ mostrarCargando: true });
      //Validaciones
      let validar = true;
      this.state.errorCodigoPromo = '';

      if (
         this.state.codigoPromo === '' ||
         this.state.codigoPromo === undefined
      ) {
         Alert.alert('Información', 'No ha ingresado ningún código');
         validar = false;
      }
      //Si pasa todas las validaciones crea el combo
      if (validar === true) {
         srvCodigos.validarCodigo(
            this.state.codigoPromo,
            global.usuario,
            this.finalizarCodigo
         );
      } else {
         this.setState({ mostrarCargando: false });
      }
   };
   repintarUsuario = () => {
      console.log('REPINTAR:' + global.appUsuario.nombreCompleto);
      console.log('REPINTAR:' + global.appUsuario.telefonoCliente);
      this.setState({
         nombreCliente: global.appUsuario.nombreCompleto,
         telefonoCliente: global.appUsuario.telefonoCliente,
      });
   };
   finalizarCodigo = mensaje => {
      console.log('Finaliza Monedero');

      if (mensaje) {
         Alert.alert('Información', mensaje);
         //this.setState({ valorDescuento: global.total });
      }
      this.setState({ mostrarCargando: false });
   };
   irMapaDirecciones = () => {
      console.log('Direccion Actual', global.direccionPedido);
      this.props.navigation.navigate('MapaDirecciones', {
         origen: 'actualizar',
         direccion: global.direccionPedido,
      });
   };
   consultarRestPago = async (idPedido, pedido) => {
      let formData = new FormData();
      formData.append('companyType', 'Persona Natural');
      formData.append('document', '1715413819');
      formData.append('documentType', '01');
      formData.append('fullName', pedido.nombreCliente);
      formData.append('address', pedido.direccion);
      formData.append('mobile', pedido.telefono);
      formData.append('email', global.usuario);
      formData.append('description', 'Compra Insumos Alimenticios');
      formData.append('amount', pedido.total);
      formData.append('amountWithTax', 0);
      formData.append('amountWithoutTax', pedido.total);
      formData.append('tax', 0);
      formData.append('gateway', 3); //siempre va tres para que se pueda realizar el pago
      formData.append('notifyUr', '');
      formData.append('reference', pedido.orden);
      formData.append('generateInvoice', 0);
      console.log('Ingresa a consultar el servicio ');
      let response = await fetch(URLPAGOS, {
         method: 'POST',
         body: formData,
      });
      let trama = await response.json();

      if (trama.code == 1) {
         console.log('Tarma exitosa');
         let srvPedidod = new ServicioPedidos();
         srvPedidod.actualizarPedidoUrlPago(idPedido, {
            urlPago: trama.data.url,
            tokerUrlPago: trama.data.token,
         });

         Alert.alert(
            'Gracias por su Compra',
            'Le Redireccionaremos a la Página para que realice su pago',
            [
               {
                  text: 'Aceptar',
                  onPress: () => {
                     this.props.navigation.navigate('PantallaPagos', {
                        url: trama.data.url,
                     });
                  },
               },
            ],
            { cancelable: false }
         );
      } else {
         console.log('Error al generar Url');
         Alert.alert('Error al Generar Url de Pago', trama.message);
      }
   };
   render() {
      let fechaActual = new Date();

      return (
         <View style={styles.container}>
            <View style={styles.pie}>
               <ScrollView keyboardShouldPersistTaps="always">
                  <View style={styles.contenedorCards}>
                     <Card
                        title="Datos de Entrega"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <View style={{ flexDirection: 'row' }}>
                           <View style={{ flex: 6, justifyContent: 'center' }}>
                              <Text style={{ marginBottom: 5, fontSize: 14 }}>
                                 Nombre:
                                 {this.state.nombreCliente
                                    ? '   ' + this.state.nombreCliente
                                    : '_ _ _ _ _ _ _ _ _ _'}
                              </Text>
                              <Separador alto={7}></Separador>
                              <Text style={{ marginBottom: 5, fontSize: 14 }}>
                                 Teléfono:{' '}
                                 {this.state.telefonoCliente
                                    ? '' + this.state.telefonoCliente
                                    : '_ _ _ _ _ _ _ _ _ _'}
                              </Text>
                           </View>
                           <View style={{ flex: 1 }}>
                              <Button
                                 onPress={() => {
                                    this.props.navigation.navigate(
                                       'PerfilUsuarioScreen'
                                    );
                                 }}
                                 buttonStyle={{
                                    backgroundColor:
                                       colores.colorPrimarioTomate,
                                 }}
                                 icon={
                                    <Icon
                                       name="pencil"
                                       size={20}
                                       color={colores.colorBlanco}
                                       style={styles.iconos}
                                    />
                                 }
                              ></Button>
                           </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                           <View style={{ flex: 6, justifyContent: 'center' }}>
                              <Text style={{ fontSize: 14 }}>
                                 Dirección: {this.state.direccion}
                              </Text>
                              <Text style={{ marginBottom: 5, fontSize: 14 }}>
                                 Referencia:{' '}
                                 {this.state.referencia
                                    ? '' + this.state.referencia
                                    : '_ _ _ _ _ _ _ _ _ _'}
                              </Text>
                           </View>
                           <View style={{ flex: 1 }}>
                              <Button
                                 onPress={() => {
                                    this.irMapaDirecciones();
                                 }}
                                 buttonStyle={{
                                    backgroundColor:
                                       colores.colorPrimarioTomate,
                                 }}
                                 icon={
                                    <Icon
                                       name="pencil"
                                       size={20}
                                       color={colores.colorBlanco}
                                       style={styles.iconos}
                                    />
                                 }
                              ></Button>
                           </View>
                        </View>
                        <Separador alto={8}></Separador>
                        <View>
                           <View>
                              <RNPickerSelect
                                 items={this.state.fechas}
                                 value={this.state.fechaSeleccionada}
                                 style={pickerSelectStyles}
                                 useNativeAndroidPickerStyle={false}
                                 placeholder={{
                                    label: 'Elija la fecha',
                                    value: null,
                                 }}
                                 onValueChange={value => {
                                    console.log('valor', value);
                                    this.setState({
                                       fechaSeleccionada: value,
                                    });
                                    global.fechaSeleccionada = value;
                                    this.cargarHorarioFecha(
                                       value,
                                       this.state.horarios
                                    );
                                 }}
                                 Icon={() => {
                                    return (
                                       <Icon
                                          name="arrow-down-drop-circle"
                                          color={colores.colorPrimarioTomate}
                                          size={30}
                                       />
                                    );
                                 }}
                              />
                           </View>
                           <Separador alto={5}></Separador>
                           <RNPickerSelect
                              onValueChange={value => console.log(value)}
                              items={this.state.horariosFecha}
                              value={this.state.horarioSeleccionado}
                              style={pickerSelectStyles}
                              placeholder={{
                                 label: 'Elija el horario',
                                 value: null,
                              }}
                              useNativeAndroidPickerStyle={false}
                              onValueChange={value => {
                                 this.setState({
                                    horarioSeleccionado: value,
                                 });
                                 global.horarioSeleccionado = value;
                              }}
                              Icon={() => {
                                 return (
                                    <Icon
                                       name="arrow-down-drop-circle"
                                       color={colores.colorPrimarioTomate}
                                       size={30}
                                    />
                                 );
                              }}
                           />
                        </View>
                     </Card>

                     <Card
                        title="Descuentos"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <View
                           style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                           }}
                        >
                           <View
                              style={{
                                 flex: 6,
                                 justifyContent: 'center',
                                 marginRight: 10,
                              }}
                           >
                              <TextInput
                                 borderColor={colores.colorPrimarioTomate}
                                 padding={10}
                                 borderWidth={1}
                                 fontSize={14}
                                 errorMessage={this.state.errorCodigoPromo}
                                 value={this.state.codigoPromo}
                                 autoCapitalize="characters"
                                 borderRadius={8}
                                 placeholder="Ingrese Código Promocional"
                                 onChangeText={text => {
                                    if (text.length <= 10) {
                                       this.setState({
                                          codigoPromo: text,
                                       });
                                    }
                                 }}
                              />
                           </View>
                           <View
                              style={{
                                 flex: 1,
                                 alignItems: 'stretch',
                              }}
                           >
                              <Button
                                 onPress={() => {
                                    this.validarCodigoPromo();
                                 }}
                                 buttonStyle={{
                                    backgroundColor:
                                       colores.colorPrimarioTomate,
                                 }}
                                 icon={
                                    <Icon
                                       name="check-circle"
                                       size={20}
                                       color={colores.colorBlancoTexto}
                                       style={styles.iconos}
                                    />
                                 }
                              ></Button>
                           </View>
                        </View>

                        <View
                           style={{ alignItems: 'flex-start', marginLeft: 10 }}
                        ></View>
                        {this.state.valorMonedero ? (
                           <View
                              style={{
                                 flex: 1,
                                 flexDirection: 'row',
                                 justifyContent: 'flex-start',
                              }}
                           >
                              <View
                                 style={{
                                    flex: 6,
                                    // backgroundColor: 'red',
                                    justifyContent: 'center',
                                    marginRight: 10,
                                 }}
                              >
                                 <View>
                                    <Text
                                       style={{
                                          color:
                                             this.state.valorMonedero != 0
                                                ? 'red'
                                                : 'black',
                                       }}
                                    >
                                       Usted posee $
                                       {this.state.valorMonedero.toFixed(2)}{' '}
                                       para Descuentos.
                                    </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                       <Text>Presione el Botón</Text>
                                       <Icon2
                                          name="local-offer"
                                          size={20}
                                          color="black"
                                          style={styles.iconos}
                                       />
                                       <Text> para utilizarlos</Text>
                                    </View>
                                 </View>
                              </View>
                              <View
                                 style={{
                                    flex: 1,
                                    alignItems: 'stretch',
                                    //backgroundColor: 'blue',
                                 }}
                              >
                                 <Button
                                    onPress={() => {
                                       new ServicioMonederos().actualizarMonedero(
                                          global.usuario,
                                          0,
                                          this.state.valorMonedero +
                                             this.state.valorDescuento
                                       );
                                    }}
                                    buttonStyle={{
                                       backgroundColor:
                                          colores.colorPrimarioTomate,
                                    }}
                                    //title="Usar"
                                    icon={
                                       <Icon2
                                          name="local-offer"
                                          size={20}
                                          color={colores.colorBlancoTexto}
                                          style={styles.iconos}
                                       />
                                    }
                                 ></Button>
                              </View>
                           </View>
                        ) : (
                           <View></View>
                        )}
                     </Card>

                     <Card
                        title="Detalle del pago"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Numero
                           titulo="SUBTOTAL:"
                           valor={transformDinero(global.subtotal)}
                        ></Numero>
                        <Numero
                           titulo="ENVÍO:"
                           valor={transformDinero(global.delivery)}
                        ></Numero>
                        {global.yapa && global.yapa.unidad != 'D' ? (
                           <Numero
                              titulo={'YAPPA (' + global.yapa.nombre + ')'}
                              valor={transformDinero(0.0)}
                              estiloNumero={{ color: 'red' }}
                           ></Numero>
                        ) : null}
                        <Numero
                           descuento={true}
                           titulo="DESCUENTO:"
                           /*valor={
                              global.valorMonedero
                                 ? transformDinero(global.valorMonedero)
                                 : transformDinero(0.0)
                           }*/
                           valor={transformDinero(this.state.valorDescuento)}
                           estiloNumero={{ color: 'red' }}
                        ></Numero>

                        <Numero
                           titulo="TOTAL:"
                           valor={transformDinero(
                              global.subtotal +
                                 global.delivery -
                                 this.state.valorDescuento
                           )}
                           estiloNumero={{ fontWeight: 'bold', fontSize: 18 }}
                        ></Numero>

                        {global.yapa && global.yapa.unidad == 'D' ? (
                           <Text style={{ marginTop: 10 }}>
                              Gracias por su Donación a Fundación Aliñambi
                           </Text>
                        ) : null}
                     </Card>
                     <Card
                        title="Datos de Facturación"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <View>
                           <Selector
                              valor1={{
                                 contenido: 'Consumidor Final',
                                 valor: 'CF',
                              }}
                              valor2={{
                                 contenido: 'Factura',
                                 valor: 'FA',
                              }}
                              fnSeleccionar={this.seleccionarFacturacion}
                              seleccionado={global.factSeleccionado}
                           ></Selector>
                           {this.state.mostrarFacturacion ? (
                              <View
                                 style={{ flex: 6, justifyContent: 'center' }}
                              >
                                 <View style={{ flexDirection: 'row' }}>
                                    <View
                                       style={{
                                          flex: 6,
                                          justifyContent: 'center',
                                       }}
                                    >
                                       <Text
                                          style={{
                                             marginBottom: 5,
                                             fontSize: 14,
                                          }}
                                       >
                                          Nombre:
                                          {this.state.nombreCompletoFact
                                             ? '   ' +
                                               this.state.nombreCompletoFact
                                             : '_ _ _ _ _ _ _ _ _ _'}
                                       </Text>
                                       <Separador alto={7}></Separador>
                                       <Text
                                          style={{
                                             marginBottom: 5,
                                             fontSize: 14,
                                          }}
                                       >
                                          CI/RUC:{' '}
                                          {this.state.numDocumentoFact
                                             ? '' + this.state.numDocumentoFact
                                             : '_ _ _ _ _ _ _ _ _ _'}
                                       </Text>
                                    </View>
                                    <View
                                       style={{
                                          flex: 1,
                                          justifyContent: 'center',
                                       }}
                                    >
                                       <Button
                                          onPress={() => {
                                             this.props.navigation.navigate(
                                                'ListarDatosFacturacionScreen'
                                             );
                                          }}
                                          buttonStyle={{
                                             backgroundColor:
                                                colores.colorPrimarioTomate,
                                          }}
                                          icon={
                                             <Icon
                                                name="pencil"
                                                size={20}
                                                color={colores.colorBlanco}
                                                style={styles.iconos}
                                             />
                                          }
                                       ></Button>
                                    </View>
                                 </View>
                              </View>
                           ) : (
                              <View
                                 style={{ flex: 6, justifyContent: 'center' }}
                              ></View>
                           )}
                        </View>
                     </Card>
                     <Card
                        title="Forma de Pago"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <View>
                           <Selector
                              valor1={{ contenido: 'Efectivo', valor: 'EF' }}
                              valor2={{
                                 contenido: 'Transferencia',
                                 valor: 'TR',
                              }}
                              fnSeleccionar={this.seleccionarFormaPago}
                              seleccionado={global.pagoSeleccionado}
                           ></Selector>
                        </View>
                     </Card>
                  </View>

                  <View style={styles.contenedorBoton}>
                     <Button
                        title="PAGAR"
                        containerStyle={styles.contenedorEstiloBoton}
                        buttonStyle={styles.estiloBoton}
                        titleStyle={styles.estiloTitulo}
                        //disabled={this.state.deshabilitado}
                        onPress={() => {
                           let fecha = new Date();
                           /*this.consultarRestPago(1,{})*/
                           if (global.sector) {
                              this.generarNumeroOrden(codigo => {
                                 console.log(
                                    'Luego de generar numero:',
                                    global.factSeleccionado,
                                    codigo
                                 );
                                 if (global.factSeleccionado == '0') {
                                    console.log('CreaPedido opcion 1');
                                    crearPedido(
                                       {
                                          fechaPedido: formatearFechaISO(fecha),
                                          fechaEntrega: this.state
                                             .fechaSeleccionada,
                                          horarioEntrega: this.state
                                             .horarioSeleccionado.horario,
                                          estado: convertirEstadoPago(
                                             global.pagoSeleccionado
                                          ),
                                          mail: global.usuario,
                                          nombreCliente:
                                             global.appUsuario.nombreCompleto,
                                          direccion:
                                             global.direccionPedido.descripcion,
                                          referencia:
                                             global.direccionPedido.referencia,
                                          latitud:
                                             global.direccionPedido.latitud,
                                          longitud:
                                             global.direccionPedido.longitud,
                                          telefono:
                                             global.appUsuario.telefonoCliente,
                                          jornada: this.state
                                             .horarioSeleccionado.jornada,
                                          orden: codigo,
                                          horaCreacion: obtenerHoraActual(
                                             fecha
                                          ),
                                          formaPago: convertirFormaPago(
                                             global.pagoSeleccionado
                                          ),
                                          asociado: 'asociado@gmail.com',
                                          nombreAsociado: 'Juan perez',
                                          telefonoAsociado: '1245635',
                                          subtotal: global.subtotal,
                                          envio: global.delivery,
                                          descuento: parseFloat(
                                             this.state.valorDescuento
                                          ),
                                          total: this.state.valorDescontado,
                                          empacado: false,
                                          recibido: false,
                                          urlPago: '',
                                          tokerUrlPago: '',
                                          factura: 'FA', //FA o CF
                                       },
                                       global.items,
                                       this.cerrarPantalla,
                                       this.consultarRestPago
                                    );
                                 }
                                 if (global.factSeleccionado != '0') {
                                    console.log('CreaPedido opcion 2');
                                    crearPedido(
                                       {
                                          fechaPedido: formatearFechaISO(fecha),
                                          fechaEntrega: this.state
                                             .fechaSeleccionada,
                                          horarioEntrega: this.state
                                             .horarioSeleccionado.horario,
                                          estado: convertirEstadoPago(
                                             global.pagoSeleccionado
                                          ),
                                          mail: global.usuario,
                                          nombreCliente:
                                             global.appUsuario.nombreCompleto,
                                          direccion:
                                             global.direccionPedido.descripcion,
                                          latitud:
                                             global.direccionPedido.latitud,
                                          longitud:
                                             global.direccionPedido.longitud,
                                          telefono:
                                             global.appUsuario.telefonoCliente,
                                          jornada: this.state
                                             .horarioSeleccionado.jornada,
                                          orden: codigo,
                                          horaCreacion: obtenerHoraActual(
                                             fecha
                                          ),
                                          formaPago: convertirFormaPago(
                                             global.pagoSeleccionado
                                          ),
                                          asociado: 'asociado@gmail.com',
                                          nombreAsociado: 'Juan perez',
                                          telefonoAsociado: '1245635',
                                          subtotal: global.subtotal,
                                          envio: global.delivery,
                                          descuento: parseFloat(
                                             this.state.valorDescuento
                                          ),
                                          total: this.state.valorDescontado,
                                          empacado: false,
                                          recibido: false,
                                          urlPago: '',
                                          tokerUrlPago: '',
                                          numDocumentoFact: this.state
                                             .numDocumentoFact,
                                          direccionFact: this.state
                                             .direccionFact,
                                          nombreCompletoFact: this.state
                                             .nombreCompletoFact,
                                          correoFact: this.state.correoFact,
                                          telefonoFact: this.state.telefonoFact,
                                          factura: 'FA', //FA o CF
                                       },
                                       global.items,
                                       this.cerrarPantalla,
                                       this.consultarRestPago
                                    );
                                 }
                              });
                           } else {
                              Alert.alert(
                                 'Información',
                                 'Al momento no tenemos cobertura en este sector, pronto estaremos contigo'
                              );
                           }
                        }}
                     ></Button>
                  </View>
                  <Cargando
                     text="Validando Código Promocional"
                     isVisible={this.state.mostrarCargando}
                  ></Cargando>
                  <Modal
                     animationType="slide"
                     transparent={true}
                     visible={this.state.mostrarModalDirecciones}
                  >
                     <SeleccionarDireccion
                        mostrarModal={this.mostrarModal}
                        fnSeleccionar={this.seleccionarDireccion}
                        navigation={this.props.navigation}
                     />
                  </Modal>
               </ScrollView>
            </View>
         </View>
      );
   }
}

const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
   },
   scrollContainer: {
      flex: 1,
      paddingHorizontal: 15,
   },
   scrollContentContainer: {
      paddingTop: 40,
      paddingBottom: 10,
   },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 20,
      paddingTop: 5,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      marginTop: 10,
   },
   contenedorTarjetas: {
      borderWidth: 1,
      // padding: 10,
      borderRadius: 15,
   },
   contenedorFechas: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
   },
   contenedorCards: { paddingVertical: 20, paddingHorizontal: 10 },
   estiloBoton: {
      paddingHorizontal: 50,
      paddingVertical: 10,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 25,
   },
   contenedorEstiloBoton: {
      width: '70%',
   },
   estiloTitulo: {
      color: colores.colorBlancoTexto,
      fontSize: 20,
   },
   contenedorBoton: {
      alignContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
   },
});

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

const pickerSelectStyles = StyleSheet.create({
   inputIOS: {
      fontSize: 14,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
   inputAndroid: {
      fontSize: 14,
      paddingHorizontal: 10,
      paddingVertical: 8,
      // borderWidth: 0.5,
      borderColor: colores.colorPrimarioTomate,
      marginVertical: 2,
      borderRadius: 8,
      borderWidth: 1,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
   iconContainer: {
      top: 8,
      right: 15,
   },
});
