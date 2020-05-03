import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { crearPedido } from '../../servicios/ServicioPedidos';
import firebase from 'firebase';
import '@firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

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
            <ScrollView
               style={styles.scrollContainer}
               contentContainerStyle={styles.scrollContentContainer}
            >
               <View>
                  <Text>TOTAL</Text>
                  <Text>VALOR TOTAL</Text>
               </View>
               <View>
                  <Text>FECHA DE ENTREGA</Text>
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
                  <Text>ELIJA HORARIO DE ENTREGA</Text>
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
               <View>
                  <Text>DIRECCION</Text>
                  <Text>DIRECCION ACTUAL</Text>
                  <Text>CAMBIAR DIRECCION</Text>
               </View>
               <View>
                  <Text>FORMA DE PAGO</Text>
                  <Text>ELIJA FORMA DE PAGO</Text>
               </View>
               <View>
                  <Button
                     title="Finalizar Compra"
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
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   scrollContainer: {
      flex: 1,
      paddingHorizontal: 15,
   },
   scrollContentContainer: {
      paddingTop: 40,
      paddingBottom: 10,
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
