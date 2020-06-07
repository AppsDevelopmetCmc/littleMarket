import React, { Component } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import * as colores from '../../constants/Colores';
import {ItemNotificacionGeneral} from './componentes/ItemNotificacionGeneral'
import { ServicioNotificaciones } from '../../servicios/ServicioNotificaciones'


export class ListaNotificaciones extends Component {
   constructor(props) {
      super(props);
      let notificaciones = [];
      this.state = {
         listaNotificaciones: notificaciones,
      };
   }
   componentDidMount() {
      let srvNotificaciones = new ServicioNotificaciones();
      let notificaciones = [];
      console.log('registrando Notificaciones')
      srvNotificaciones.registrarEscuchaTodas(global.usuario, this.repintarNotificaciones)
   }

   repintarNotificaciones = notificaciones => {
      console.log('------Notificaciones', notificaciones);
      this.setState({
         listaNotificaciones: notificaciones,
      });
   };
   render() {
      return (
         <View style={styles.contenedorPagina}>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 25, 'normal')}>
                  Notificaciones
               </Text>
            </View>
            <View style={styles.pie}>
               <FlatList
                  data={this.state.listaNotificaciones}
                  renderItem={objeto => {
                     return (
                        <ItemNotificacionGeneral
                           notificacion={objeto.item}
                        />
                     );
                  }}
                  keyExtractor={objeto => {
                     return objeto.id;
                  }}
                  ItemSeparatorComponent={flatListItemSeparator}
               />
             
            </View>
         </View>
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
               backgroundColor: colores.colorClaroPrimario,

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
   container: {
      flex: 1,
      paddingTop: 50,
   },
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 40,
      paddingVertical: 20,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      marginTop: 30,
   },
   estiloContenedor1: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   estiloInputContenedor: {
      padding: 0,
      height: 40,
   },
   estiloInput: { fontSize: 15 },
   btnStyles: {
      marginTop: 50,
      width: '100%',
      height: 40,
   },
   btnGuardar: {
      paddingHorizontal: 40,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 25,
   },
   contenderLista: { marginTop: 15 },
   contenedorTextoVacio: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      marginBottom: 60,
   },
});
