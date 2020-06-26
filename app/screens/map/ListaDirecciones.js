import React, { Component, useState } from 'react';
import {
   View,
   StyleSheet,
   Dimensions,
   Alert,
   Modal,
   useColorScheme,
   FlatList,
   TextInput,
   Text,
} from 'react-native';
import { ItemMapDireccion } from '../map/compnentes/ItemMapDireccion';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
export class ListaDirecciones extends Component {
   constructor(props) {
      super(props);
      this.state = {
         listaDirecciones: [],
      };
      //console.log('LISTA DIRECCIONES', this.state.listaDirecciones);
      let srvDirecciones = new ServicioDirecciones();
      this._unsuscribe = srvDirecciones.registrarEscuchaMapaDireccion(
         global.usuario,
         this.repintarLista
      );
   }

   repintarLista = () => {
      //  this.validarCoberturaGlobalDireccion();
      const direcciones = global.direcciones;

      console.log('----------repintarLista------- COMPONENTE ', direcciones);
      console.log('---- seleccionado---> ', global.direccionPedido.id);

      this.setState({
         listaDirecciones: direcciones,
         /*direcciones.map(function (item) {
            return {
               ...item,
               itemSeleccionado:
                  global.direccionPedido.id == item.id ? true : false,
            };
         }),*/
      });
   };
   render() {
      console.log('RENDER-------', this.state.listaDirecciones.length);
      return (
         <FlatList
            data={this.state.listaDirecciones}
            renderItem={objeto => {
               return <Text>hola</Text>;
            }}
            keyExtractor={objetoCombo => {
               return objetoCombo.id;
            }}
         />
      );
   }
}
