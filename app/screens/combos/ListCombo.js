import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { ItemCombo } from '../combos/componentes/ItemCombo';
//import ActionButton from 'react-native-action-button';
import { ServicioCombos } from '../../servicios/ServicioCombos';
import { CheckBox, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';

// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';

// Importacion de los colores
//Importando los colores
import * as colores from '../../constants/Colores';
import { AsociadoCalifica } from '../calificacion/AsociadoCalifica';

export class ListCombo extends Component {
   constructor() {
      super();
      let combos = [];
      this.state = {
         listCombos: combos,
         pedidoCalifica: null,
         estadocalifica: false,
      };
      let srvCombos = new ServicioCombos();
      srvCombos.registrarEscuchaTodas(combos, this.repintarLista);
   }

   cambioVisibleCalifica = visible => {
      this.setState({ estadocalifica: visible });
   };

   repintarLista = combos => {
      global.combos = combos;
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
   componentDidMount() {
      this.obtenerPedidoCalifica(global.usuario);
   }

   obtenerPedidoCalifica = mail => {
      global.db
         .collection('pedidos')
         .where('mail', '==', mail)
         .where('estado', '==', 'PE')
         .get()
         .then(querySnapshot => {
            let pedido = {};
            querySnapshot.forEach(doc => {
               pedido = doc.data();
               pedido.id = doc.id;
               this.setState({ estadocalifica: true });
            });
            this.setState({ pedidoCalifica: pedido, estadocalifica: true });
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

   render() {
      return (
         <SafeAreaView style={styles.container}>
            <CabeceraPersonalizada
               titulo={'Yappando'}
               iconoComponente={
                  <Icon
                     name="menu"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirDrawer}
                  />
               }
               iconoDeTienda={
                  <Icon
                     name="cart"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirCarrito}
                     underlayColor={colores.colorPrimarioVerde}
                  />
               }
            ></CabeceraPersonalizada>
            <View style={styles.contenedorDireccione}>
               <Text>{global.direccionActual}</Text>
            </View>

            <View style={styles.pie}>
               <View style={styles.lista}>
                  <FlatList
                     data={this.state.listCombos}
                     renderItem={objeto => {
                        return (
                           <ItemCombo
                              nav={this.props.navigation}
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
            <AsociadoCalifica
               text="Iniciando Sesión con Facebook"
               isVisible={this.state.estadocalifica}
               pedido={this.state.pedidoCalifica}
               cambioVisibleCalifica={this.cambioVisibleCalifica}
            ></AsociadoCalifica>
         </SafeAreaView>
      );
   }
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
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

   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
   },
   contenedorDireccione: {
      marginHorizontal: 30,
      backgroundColor: colores.colorBlanco,
      height: 30,
      borderRadius: 20,
      marginTop: 15,
   },
   pie: {
      flex: 3,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      paddingLeft: 10,
      marginTop: 15,
      paddingTop: 20,
   },
});
