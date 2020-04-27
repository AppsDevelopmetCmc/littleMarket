import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { ItemCombo } from '../combos/componentes/ItemCombo';
//import ActionButton from 'react-native-action-button';
import { ServicioCombos } from '../../servicios/ServicioCombos';
import { CheckBox } from 'react-native-elements';

export class ListCombo extends Component {
   constructor() {
      super();
      let combos = [];
      this.state = {
         listCombos: combos,
      };
      let srvCombos = new ServicioCombos();
      srvCombos.registrarEscuchaTodas(combos, this.repintarLista);
   }

   repintarLista = combos => {
      this.setState({
         listCombos: combos,
      });
   };

   /*eliminar = combo => {
      let srvCombos = new ServicioCombos();
      srvCombos.eliminar(combo.id);
   };
   actualizar = combo => {
      this.props.navigation.navigate('ComboScreen', {
         origen: 'actualizar',
         combo: {
            id: combo.id,
            imagen: combo.imagen,
            precio: combo.precio,
            alias: combo.alias,
         },
      });
   };*/

   render() {
      return (
         <View style={styles.container}>
            <View style={styles.cabecera}>
               <Text style={styles.textoNegrita}>LISTA DE COMBOS</Text>
            </View>
            <View style={styles.lista}>
               <FlatList
                  data={this.state.listCombos}
                  renderItem={objeto => {
                     return (
                        <ItemCombo
                           combo={objeto.item}
                        />
                     );
                  }}
                  keyExtractor={objetoCombo => {
                     return objetoCombo.id;
                  }}
               />
            </View>
         </View>
      );
   }
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
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
   },
   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },

   textoNegrita :{
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,

   },
});
