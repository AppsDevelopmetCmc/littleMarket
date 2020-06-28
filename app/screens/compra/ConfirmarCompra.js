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
import { Promociones } from './Promociones';
import { URLPAGOS } from '../../utils/ApiKey';
import {
   convertirFormaPago,
   convertirEstadoPago,
   convertirRadioPago,
   convertirFactuacion,
} from '../../utils/ConvertirFormaPago';
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
      global.refrescarFact = this.refrescarDatosFactura;
      global.factSeleccionado = '0'
      this.state = {
         fechaSeleccionada: global.fechaSeleccionada,
         horarioSeleccionado: global.horarioSeleccionado,
         fechas: [],
         horarios: [],
         direccion: global.direccionPedido.descripcion,
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
         mostrarPromociones: false,
         msmCoberturaDireccion:
            global.direccionPedido.tieneCoberturaDireccion == 'S'
               ? true
               : false,
         numDocumentoFact: '',
         direccionFact: '',
         nombreCompletoFact: '',
         correoFact: '',
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
      let servParametros = new ServicioParametros();
      servParametros.getObtenerParametroId(
         'envio',
         this.obtenerParametroEnvio
      );
   }
   refrescarDatosFactura = (factura) => {
      this.setState(
         {
            numDocumentoFact: factura.numDocumento,
            direccionFact: factura.alias,
            nombreCompletoFact: factura.nombreCompleto,
            correoFact: factura.correo,
            telefonoFact: factura.telefono,
         }
      )
   }
   obtenerParametroEnvio = parametro => {
      global.delivery = parametro.precio;
      this.setState({
         valorDescontado: global.subtotal + global.delivery
      })
      console.log('global.delivery', global.delivery);
   };

   cerrarPromociones = () => {
      this.setState({ mostrarPromociones: false });
   };

   refrescarDireccion = () => {
      this.setState({
         direccion: global.direccionPedido.descripcion,
         msmCoberturaDireccion:
            global.direccionPedido.tieneCoberturaDireccion == 'S'
               ? true
               : false,
      });
   };
   cargarCombos = (fechas, horarios) => {
      this.setState({ fechas: fechas, horarios: horarios });
   };
   componentDidMount() {
      console.log('llega confirmar Compra');
      new ServicioParametros().obtenerParamsFechas(this.cargarCombos);
      let srvMonederos = new ServicioMonederos();
      this.unsubscribe = srvMonederos.registarEscuchaMonederoCompra(
         global.usuario,
         this.repintarMonedero
      );
   }
   repintarMonedero = monedero => {
      console.log('mondero en confirmar Compra', monedero);
      if (monedero) {
         if (global.valorMonedero == null || global.valorMonedero == undefined) {
            global.valorMonedero = 0;
         }
         this.setState({
            valorMonedero: monedero.valor - global.valorMonedero,
            valorDescontado: this.state.valorDescontado - global.valorMonedero
         });

      } else {
         this.setState({ valorMonedero: 0 });
         global.valorMonedero = 0;
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
            'La Direccion de Entrega no tiene una referencia'
         );
      } else {
         numero = await new ServicioParametros().obtenerSecuencial();
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
         this.setState({ valorDescontado: global.total });
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
            {/* <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}>
                  Confirmar compra
               </Text>
            </View> */}

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
                              <Text
                                 style={{
                                    fontSize: 10,
                                    color: 'red',
                                    marginLeft: 10,
                                 }}
                              >
                                 {/*this.state.msmCoberturaDireccion
                                    ? ''
                                    : 'La dirección actual no tiene cobertura'*/}
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
                                 onValueChange={value => console.log(value)}
                                 items={this.state.fechas}
                                 value={this.state.fechaSeleccionada}
                                 style={pickerSelectStyles}
                                 useNativeAndroidPickerStyle={false}
                                 placeholder={{
                                    label: 'Elija la fecha',
                                    value: null,
                                 }}
                                 onValueChange={value => {
                                    this.setState({
                                       fechaSeleccionada: value,
                                    });
                                    global.fechaSeleccionada = value;
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
                              items={this.state.horarios}
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
                                    if (text.length <= 5) {
                                       this.setState({
                                          codigoPromo: text,
                                       });
                                    }
                                 }}
                              />
                           </View>
                           <View
                              style={{
                                 flex: 2,
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
                                       size={25}
                                       color={colores.colorBlancoTexto}
                                       style={styles.iconos}
                                    />
                                 }
                              ></Button>
                           </View>
                        </View>

                        <View
                           style={{ alignItems: 'flex-start', marginLeft: 10 }}
                        >
                           {/*<TouchableHighlight
                              underlayColor={colores.colorBlanco}
                              onPress={() => {
                                 this.setState({ mostrarPromociones: true });
                              }}
                           >
                              <View
                                 height={30}
                                 paddingHorizontal={10}
                                 alignItems="stretch"
                                 justifyContent="center"
                              >
                                 <Text
                                    style={{
                                       color: colores.colorPrimarioTomate,
                                    }}
                                 >
                                    ¿Cómo obtener Códigos?
                                 </Text>
                              </View>
                           </TouchableHighlight>*/}
                        </View>
                        <View
                           style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                           }}
                        >
                           <View
                              style={{
                                 flex: 6,
                                 //  backgroundColor: 'red',
                                 justifyContent: 'center',
                              }}
                           >
                              <View style={{ flexDirection: 'row' }}>
                                 <Text>Posee </Text>
                                 <Text style={{ fontWeight: 'bold' }}>
                                    ${this.state.valorMonedero.toFixed(2)}
                                 </Text>
                                 <Text> para descuentos </Text>
                              </View>
                           </View>
                           <View
                              style={{
                                 flex: 2,
                                 alignItems: 'stretch',
                              }}
                           >
                              <Button
                                 onPress={() => {

                                    if (this.state.valorDescontado > 0) {
                                       if (
                                          this.state.valorMonedero >
                                          this.state.valorDescontado
                                       ) {
                                          this.setState({
                                             valorMonedero:
                                                this.state.valorMonedero -
                                                this.state.valorDescontado,
                                             valorDescuento: this.state.valorDescontado,
                                             valorDescontado: 0,
                                          });
                                       } else {
                                          let total = this.state.valorDescontado;
                                          if (this.state.valorMonedero != 0) {
                                             global.valorMonedero = this.state.valorMonedero;
                                             total = total - global.valorMonedero;
                                          }
                                          this.setState({
                                             valorMonedero: 0,
                                             valorDescuento: global.valorMonedero,
                                             valorDescontado: total,
                                          });

                                       }
                                    }
                                 }}
                                 buttonStyle={{
                                    backgroundColor:
                                       colores.colorPrimarioTomate,
                                 }}
                                 title="Usar"
                                 icon={
                                    <Icon
                                       name="coin"
                                       size={25}
                                       color={colores.colorBlancoTexto}
                                       style={styles.iconos}
                                    />
                                 }
                              ></Button>
                           </View>
                        </View>
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
                        {global.yapa && global.yapa.descripcion != 'D' ? (
                           <Numero
                              titulo={
                                 'YAPPA (' +
                                 global.yapa.descripcion.split(' -')[0] +
                                 ')'
                              }
                              valor={transformDinero(0.0)}
                              estiloNumero={{ color: 'red' }}
                           ></Numero>
                        ) : null}
                        <Numero
                           descuento={true}
                           titulo="DESCUENTO:"
                           valor={transformDinero(global.valorMonedero)}
                           estiloNumero={{ color: 'red' }}
                        ></Numero>

                        <Numero
                           titulo="TOTAL:"
                           valor={transformDinero(this.state.valorDescontado)}
                           estiloNumero={{ fontWeight: 'bold', fontSize: 18 }}
                        ></Numero>

                        {global.yapa && global.yapa.descripcion == 'D' ? (
                           <Text style={{ marginTop: 10 }}>
                              Gracias por su Donación a Fundación Aliñambi
                           </Text>
                        ) : null}
                     </Card>
                     <Card
                        title="Datos de Facturación"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <RadioForm
                           radio_props={this.radio_props_fac}
                           buttonColor={colores.colorPrimarioTomate}
                           selectedButtonColor={colores.colorPrimarioTomate}
                           initial={convertirFactuacion(global.factSeleccionado)}
                           formHorizontal={true}
                           buttonSize={15}
                           buttonOuterSize={25}
                           onPress={(value) => {
                              global.factSeleccionado = value;
                              if (global.factSeleccionado != 'CF') {
                                 this.props.navigation.navigate(
                                    'ListarDatosFacturacionScreen'
                                 );
                              }
                           }}

                        />
                        {global.factSeleccionado == 'FA' ? (
                           <View style={{ flex: 6, justifyContent: 'center' }}>
                              <Text style={{ marginBottom: 5, fontSize: 14 }}>
                                 Nombre:
                             {this.state.nombreCompletoFact
                                    ? '   ' + this.state.nombreCompletoFact
                                    : '_ _ _ _ _ _ _ _ _ _'}
                              </Text>
                              <Separador alto={7}></Separador>
                              <Text style={{ marginBottom: 5, fontSize: 14 }}>
                                 CI/RUC:{' '}
                                 {this.state.numDocumentoFact
                                    ? '' + this.state.numDocumentoFact
                                    : '_ _ _ _ _ _ _ _ _ _'}
                              </Text>
                           </View>
                        ) : (
                              <View style={{ flex: 6, justifyContent: 'center' }}>

                              </View>

                           )}
                     </Card>
                     <Card
                        title="Forma de Pago"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <RadioForm
                           radio_props={this.radio_props}
                           buttonColor={colores.colorPrimarioTomate}
                           selectedButtonColor={colores.colorPrimarioTomate}
                           initial={convertirRadioPago(global.pagoSeleccionado)}
                           formHorizontal={true}
                           buttonSize={15}
                           buttonOuterSize={25}
                           onPress={value => {
                              this.setState({ pagoSeleccionado: value });
                              global.pagoSeleccionado = value;
                           }}
                        />
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
                           this.generarNumeroOrden(codigo => {
                              if (global.factSeleccionado == '0') {
                                 crearPedido(
                                    {
                                       fechaPedido: formatearFechaISO(fecha),
                                       fechaEntrega: this.state.fechaSeleccionada,
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
                                       latitud: global.direccionPedido.latitud,
                                       longitud: global.direccionPedido.longitud,
                                       telefono: global.appUsuario.telefonoCliente,
                                       total: global.total,
                                       jornada: this.state.horarioSeleccionado
                                          .jornada,
                                       orden: codigo,
                                       horaCreacion: obtenerHoraActual(fecha),
                                       formaPago: convertirFormaPago(
                                          global.pagoSeleccionado
                                       ),
                                       asociado: 'asociado@gmail.com',
                                       nombreAsociado: 'Juan perez',
                                       telefonoAsociado: '1245635',
                                       yapa: global.yapa
                                          ? global.yapa.descripcion
                                          : '',
                                       descuento: parseFloat(
                                          this.state.valorDescuento.toFixed(2)
                                       ),
                                       empacado: false,
                                       recibido: false,
                                       urlPago: '',
                                       tokerUrlPago: '',
                                       numDocumentoFact: this.state.numDocumentoFact,
                                       direccionFact: this.state.direccionFact,
                                       nombreCompletoFact: this.state.nombreCompletoFact,
                                       correoFact: this.state.correoFact,
                                       telefonoFact: this.state.telefonoFact,

                                    },
                                    global.items,
                                    this.cerrarPantalla,
                                    this.consultarRestPago
                                 );
                              }
                              if (global.factSeleccionado != '0') {
                                 if (this.state.numDocumentoFact) {
                                    crearPedido(
                                       {
                                          fechaPedido: formatearFechaISO(fecha),
                                          fechaEntrega: this.state.fechaSeleccionada,
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
                                          latitud: global.direccionPedido.latitud,
                                          longitud: global.direccionPedido.longitud,
                                          telefono: global.appUsuario.telefonoCliente,
                                          total: global.total,
                                          jornada: this.state.horarioSeleccionado
                                             .jornada,
                                          orden: codigo,
                                          horaCreacion: obtenerHoraActual(fecha),
                                          formaPago: convertirFormaPago(
                                             global.pagoSeleccionado
                                          ),
                                          asociado: 'asociado@gmail.com',
                                          nombreAsociado: 'Juan perez',
                                          telefonoAsociado: '1245635',
                                          yapa: global.yapa
                                             ? global.yapa.descripcion
                                             : '',
                                          descuento: parseFloat(
                                             this.state.valorDescuento.toFixed(2)
                                          ),
                                          empacado: false,
                                          recibido: false,
                                          urlPago: '',
                                          tokerUrlPago: '',
                                          numDocumentoFact: this.state.numDocumentoFact,
                                          direccionFact: this.state.direccionFact,
                                          nombreCompletoFact: this.state.nombreCompletoFact,
                                          correoFact: this.state.correoFact,
                                          telefonoFact: this.state.telefonoFact,

                                       },
                                       global.items,
                                       this.cerrarPantalla,
                                       this.consultarRestPago
                                    );
                                 }
                                 else {
                                    Alert.alert("Ingresde Datos de Facturación" + global.factSeleccionado)

                                 }
                              }

                           }
                           );
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
                  <Modal
                     // animationType="slide"
                     transparent={true}
                     visible={this.state.mostrarPromociones}
                  >
                     <Promociones cerrar={this.cerrarPromociones} />
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
