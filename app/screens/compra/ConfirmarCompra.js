import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Icon, Input,Button, Card } from 'react-native-elements';
import { crearPedido } from '../../servicios/ServicioPedidos';
import firebase from 'firebase';
import '@firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import RadioForm, {
   RadioButton,
   RadioButtonInput,
   RadioButtonLabel,
} from 'react-native-simple-radio-button';

//Importacion de los colores
import * as colores from '../../constants/Colores';

import Separador from '../../components/Separador';
import { ServicioParametros } from '../../servicios/ServicioParametros';
import { formatearFechaISO } from '../../utils/DateUtil';
export class ConfirmarCompra extends Component {
   constructor() {
      super();
      this.state = {
         fechaSeleccionada: global.fechaSeleccionada,
         horarioSeleccionado: global.horarioSeleccionado,
         fechas: [],
         horarios: [],
         direccion: global.direccionPedido.descripcion,
         pagoSeleccionado: global.pagoSeleccionado == 'TR' ? 1 : 0,
         deshabilitado: true,
      };
      this.radio_props = [
         { label: 'Efectivo   ', value: 'EF' },
         { label: 'Transferencia', value: 'TR' },
      ];
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevState.deshabilitado) {
         if (this.state.horarioSeleccionado && this.state.fechaSeleccionada) {
            if (global.pagoSeleccionado == 'EF') {
               this.setState({ deshabilitado: false });
            } else if (
               global.pagoSeleccionado == 'TR' &&
               global.transferencia
            ) {
               this.setState({ deshabilitado: false });
            }
         }
      }
      if (
         this.state.horarioSeleccionado != prevState.horarioSeleccionado &&
         !prevState.deshabilitado
      ) {
         if (!this.state.horarioSeleccionado) {
            this.setState({ deshabilitado: true });
         }
      }

      if (
         this.state.fechaSeleccionada != prevState.fechaSeleccionada &&
         !prevState.deshabilitado
      ) {
         if (!this.state.fechaSeleccionada) {
            this.setState({ deshabilitado: true });
         }
      }
   }
   refrescarDireccion = () => {
      this.setState({ direccion: global.direccionPedido });
   };
   cargarCombos = (fechas, horarios) => {
      this.setState({ fechas: fechas, horarios: horarios });
   };
   componentDidMount() {
      new ServicioParametros().obtenerParamsFechas(this.cargarCombos);
   }
   cerrarPantalla = () => {
      this.props.navigation.popToTop();
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
               <ScrollView>
                  <View style={styles.contenedorCards}>
                     <Card
                        title="Seleccione la fecha y hora para su entrega"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <View style={styles.contenedorFechas}>
                           <View>
                              <RNPickerSelect
                                 onValueChange={value => console.log(value)}
                                 items={this.state.fechas}
                                 value={this.state.fechaSeleccionada}
                                 style={pickerSelectStyles}
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
                           <View>
                              <RNPickerSelect
                                 onValueChange={value => console.log(value)}
                                 items={this.state.horarios}
                                 value={this.state.horarioSeleccionado}
                                 style={pickerSelectStyles}
                                 placeholder={{
                                    label: 'Elija el horario',
                                    value: null,
                                 }}
                                 onValueChange={value => {
                                    this.setState({
                                       horarioSeleccionado: value,
                                    });
                                    global.horarioSeleccionado = value;
                                 }}
                              />
                           </View>
                        </View>
                     </Card>
                     <Card
                        title="Verifique su dirección"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Text>{this.state.direccion}</Text>
                        <Button title="Cambiar"></Button>
                     </Card>
                     <Card
                        title="Seleccione su forma de pago"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <RadioForm
                           radio_props={this.radio_props}
                           initial={global.pagoSeleccionado == 'TR' ? 1 : 0}
                           formHorizontal={true}
                           buttonSize={15}
                           buttonOuterSize={25}
                           onPress={value => {
                              this.setState({ pagoSeleccionado: value });
                              global.pagoSeleccionado = value;
                              if (value == 'TR') {
                                 this.props.navigation.navigate(
                                    'TransferenciaScreen'
                                 );
                              }
                           }}
                        />
                     </Card>
                     <Card
                        title="Registrar Referidos:"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Input
                           placeholder="Ingrese código promo"
                           containerStyle={styles.estiloContenedor1}
                           inputContainerStyle={styles.estiloInputContenedor}
                           inputStyle={styles.estiloInput}               
                        
                           labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
                           
                           rightIcon={
                              <Icon
                                 type="material-community"
                                 name="coin"
                                 iconStyle={styles.iconRight}
                              ></Icon>
                           }
                        ></Input>
                        <Text> </Text>
                        <Button title="Registrar"></Button>
                     </Card>
                     <Text> </Text>
                     <View style={styles.contenedorBoton}>
                     <Button
                        title="Usar Monedero"
                        containerStyle={styles.EstiloBoton}
                        buttonStyle={styles.estiloBoton}
                        titleStyle={styles.estiloTitulo}
                        onPress={() => {}}
                     ></Button>
                     </View>


                     <Card
                        title="Detalle del pago"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Text>TOTAL: USD {global.total}</Text>
                     </Card>
                  </View>

                  <View style={styles.contenedorBoton}>
                     <Button
                        title="Finalizar compra"
                        containerStyle={styles.contenedorEstiloBoton}
                        buttonStyle={styles.estiloBoton}
                        titleStyle={styles.estiloTitulo}
                        disabled={this.state.deshabilitado}
                        onPress={() => {
                           crearPedido(
                              {
                                 fechaPedido: formatearFechaISO(new Date()),
                                 fechaEntrega: this.state.fechaSeleccionada,
                                 horarioEntrega: this.state.horarioSeleccionado,
                                 estado:
                                    global.pagoSeleccionado == 'TR'
                                       ? 'CT'
                                       : 'CE',
                                 mail: global.usuario,
                                 nombreCliente:
                                    global.appUsuario.nombreCompleto,
                                 direccion: global.direccionPedido.descripcion,
                                 latitud: global.direccionPedido.latitud,
                                 longitud: global.direccionPedido.longitud,
                                 telefono: global.appUsuario.telefono,
                                 total: global.total,
                                 transferencia:
                                    global.pagoSeleccionado == 'TR'
                                       ? global.transferencia
                                       : '',
                              },
                              items,
                              this.cerrarPantalla
                           );
                        }}
                     ></Button>
                  </View>
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
      padding: 10,
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
const pickerSelectStyles = StyleSheet.create({
   inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
   inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
});
