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
import { crearPedido } from '../../servicios/ServicioPedidos';
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

export class ConfirmarCompra extends Component {
   constructor() {
      super();
      if (!global.pagoSeleccionado) {
         global.pagoSeleccionado = 'EF';
      }
  
      this.state = {
         fechaSeleccionada: global.fechaSeleccionada,
         horarioSeleccionado: global.horarioSeleccionado,
         fechas: [],
         horarios: [],
         direccion: global.direccionPedido.descripcion,
         pagoSeleccionado: global.pagoSeleccionado == 'TR' ? 1 : 0,
         deshabilitado: true,
         mostrarModalDirecciones: false,
         codigoPromo: '',
         errorCodigoPromo: '',
         valorMonedero: 0,
         valorDescuento: 0,
         valorDescontado: global.total,
         mostrarCargando: false,
         nombreCliente: global.appUsuario.nombreCompleto,
         telefonoCliente: global.appUsuario.telefonoCliente,
         mostrarPromociones: false,
      };
      global.repintarUsuario = this.repintarUsuario;
      this.radio_props = [
         { label: 'Efectivo   ', value: 'EF' },
         { label: 'Transferencia', value: 'TR' },
      ];
   }

   cerrarPromociones = () => {
      this.setState({ mostrarPromociones: false });
   };

   refrescarDireccion = () => {
      this.setState({ direccion: global.direccionPedido.descripcion });
   };
   cargarCombos = (fechas, horarios) => {
      this.setState({ fechas: fechas, horarios: horarios });
   };
   componentDidMount() {
      new ServicioParametros().obtenerParamsFechas(this.cargarCombos);
      let srvMonederos = new ServicioMonederos();
      this.unsubscribe = srvMonederos.registarEscuchaMonederoCompra(
         global.usuario,
         this.repintarMonedero
      );
      console.log('Aqui');
   }
   repintarMonedero = monedero => {
      console.log('mondero en confirmar Compra', monedero);
      if (monedero) {
         this.setState({ valorMonedero: monedero.valor });
      } else {
         this.setState({ valorMonedero: 0 });
      }
   };

   componentWillUnmount() {
      console.log('componentWillUnmount');
      this.unsubscribe();
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
      } else {
         Alert.alert('Información', 'La Dirección Seleccionada no tiene Cobertura');
      }
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
      console.log("Direccion Actual", global.direccionPedido)
      this.props.navigation.navigate('MapaDirecciones', {
         origen: 'actualizar',
         direccion: global.direccionPedido,
      });
   }
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
                           <TouchableHighlight
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
                           </TouchableHighlight>
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
                                          global.total
                                       ) {
                                          this.setState({
                                             valorMonedero:
                                                this.state.valorMonedero -
                                                global.total,
                                             valorDescuento: global.total,
                                             valorDescontado: 0,
                                          });
                                       } else {
                                          this.setState({
                                             valorMonedero: 0,
                                             valorDescuento: this.state
                                                .valorMonedero,
                                             valorDescontado:
                                                global.total -
                                                this.state.valorMonedero,
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
                        <Numero
                           descuento={true}
                           titulo="DESCUENTO:"
                           valor={transformDinero(this.state.valorDescuento)}
                           estiloNumero={{ color: 'red' }}
                        ></Numero>
                        <Numero
                           titulo="TOTAL:"
                           valor={transformDinero(this.state.valorDescontado)}
                           estiloNumero={{ fontWeight: 'bold', fontSize: 18 }}
                        ></Numero>
                     </Card>
                     <Card
                        title="Forma de Pago"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <RadioForm
                           radio_props={this.radio_props}
                           buttonColor={colores.colorPrimarioTomate}
                           selectedButtonColor={colores.colorPrimarioTomate}
                           initial={global.pagoSeleccionado == 'TR' ? 1 : 0}
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
                        title="Finalizar compra"
                        containerStyle={styles.contenedorEstiloBoton}
                        buttonStyle={styles.estiloBoton}
                        titleStyle={styles.estiloTitulo}
                        //disabled={this.state.deshabilitado}
                        onPress={() => {
                           let fecha = new Date();
                           this.generarNumeroOrden(codigo => {
                              crearPedido(
                                 {
                                    fechaPedido: formatearFechaISO(fecha),
                                    fechaEntrega: this.state.fechaSeleccionada,
                                    horarioEntrega: this.state
                                       .horarioSeleccionado.horario,
                                    estado:
                                       global.pagoSeleccionado == 'TR'
                                          ? 'CT'
                                          : 'PI',
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
                                    formaPago:
                                       global.pagoSeleccionado === 'TR'
                                          ? 'TRANSFERENCIA'
                                          : 'EFECTIVO',
                                    asociado: 'asociado@gmail.com',
                                    nombreAsociado: 'Juan perez',
                                    telefonoAsociado: '1245635',
                                    yapa: global.yapa
                                       ? global.yapa.descripcion
                                       : '',
                                    descuento: parseFloat(
                                       this.state.valorDescuento.toFixed(2)
                                    ),
                                 },
                                 items,
                                 this.cerrarPantalla
                              );
                           });
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
   estiloTitulo: { color: colores.colorBlancoTexto },
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
});
