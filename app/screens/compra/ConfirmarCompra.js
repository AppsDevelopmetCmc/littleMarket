import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { crearPedido } from '../../servicios/ServicioPedidos';
import firebase from 'firebase';
import '@firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

//Importacion de los colores
import * as colores from '../../constants/Colores';

import Separador from '../../components/Separador';

export class ConfirmarCompra extends Component {
   constructor() {
      super();
      this.state = {
         fechaSeleccionada: '06/05/2020',
         horarioSeleccionado: '09-10',

         fechas: [
            { value: '06/05/2020', label: 'Martes 6 de Mayo 2020' },
            { value: '09/05/2020', label: 'Jueves 9 de Mayo 2020' },
            { value: '12/05/2020', label: 'Sábado 12 de Mayo 2020' },
         ],
         horarios: [
            { value: '09-10', label: '09h00-10h00' },
            { value: '10-11', label: '10h00-11h00' },
            { value: '16-17', label: '16h00-17h00' },
         ],
      };
   }
   formatearFecha = date => {
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      let yy = date.getFullYear();
      if (dd < 10) {
         dd = '0' + dd;
      }
      if (mm < 10) {
         mm = '0' + mm;
      }

      return dd + '/' + mm + '/' + yy;
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
                              <Text>Fecha de entrega</Text>
                              <RNPickerSelect
                                 onValueChange={value => console.log(value)}
                                 items={this.state.fechas}
                                 value={this.state.fechaSeleccionada}
                                 style={pickerSelectStyles}
                                 placeholder={{
                                    label: 'Elija la fecha de entrega',
                                    value: null,
                                 }}
                                 onValueChange={value => {
                                    this.setState({
                                       fechaSeleccionada: value,
                                    });
                                 }}
                              />
                           </View>
                           <View>
                              <Text>Horario de entrega</Text>
                              <RNPickerSelect
                                 onValueChange={value => console.log(value)}
                                 items={this.state.horarios}
                                 value={this.state.horarioSeleccionado}
                                 style={pickerSelectStyles}
                                 placeholder={{
                                    label: 'Elija la hora de entrega',
                                    value: null,
                                 }}
                                 onValueChange={value => {
                                    this.setState({
                                       horarioSeleccionado: value,
                                    });
                                 }}
                              />
                           </View>
                        </View>
                     </Card>
                     <Card
                        title="Verifique su dirección"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Text>DIRECCION</Text>
                        <Text>DIRECCION ACTUAL</Text>
                        <Text>CAMBIAR DIRECCION</Text>
                     </Card>
                     <Card
                        title="Seleccione su forma de pago"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Text>FORMA DE PAGO</Text>
                        <Text>ELIJA FORMA DE PAGO</Text>
                     </Card>
                     <Card
                        title="Detalle del pago"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Text>TOTAL</Text>
                        <Text>VALOR TOTAL</Text>
                     </Card>
                  </View>

                  <View style={styles.contenedorBoton}>
                     <Button
                        title="Finalizar compra"
                        containerStyle={styles.contenedorEstiloBoton}
                        buttonStyle={styles.estiloBoton}
                        titleStyle={styles.estiloTitulo}
                        onPress={() => {
                           crearPedido({
                              fechaPedido: this.formatearFecha(new Date()),
                              fechaEntrega: this.state.fechaSeleccionada,
                              horarioEntrega: this.state.horarioSeleccionado,
                              estado: 'I',
                              mail: global.usuario,
                              nombreCliente: global.appUsuario.nombreCompleto,
                              direccion: 'Tomar del front',
                              telefono: global.appUsuario.telefono,
                              total: 34.56,
                           });
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
      flexDirection: 'row',
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
