import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { ServicioPedidos } from '../../servicios/ServicioPedidos';
import { ItemPedido } from './componentes/ItemPedido';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';

//Importacion de los colores
import * as colores from '../../constants/Colores';
// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';

export class ListaPedidos extends Component {
   constructor(props) {
      super(props);
      let pedidos = [];
      this.state = {
         listPedidos: pedidos,
      };
   }
   componentDidMount() {
      let srvServicioPedidos = new ServicioPedidos();
      let pedidos = [];
      srvServicioPedidos.registrarEscuchaTodas(
         pedidos,
         this.repintarLista,
         global.usuario
      );
   }

   repintarLista = pedidos => {
      this.setState({ listPedidos: pedidos });
   };

   abrirDrawer = () => {
      this.props.navigation.openDrawer();
   };

   abrirCarrito = () => {
      this.props.navigation.navigate('CarroComprasScreen');
   };

   abrirMonedero = () => {
      this.props.navigation.navigate('ReferidosScreen');
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
               iconoMonedero={
                  <Icon
                     name="coin"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirMonedero}
                     underlayColor={colores.colorPrimarioVerde}
                  />
               }
               iconoNotificacion={
                  <Icon
                     name="bell-circle-outline"
                     type="material-community"
                     color={colores.colorBlanco}
                     size={30}
                     onPress={this.abrirNotificacion}
                     underlayColor={colores.colorPrimarioVerde}
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
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}>
                  Lista de pedidos
               </Text>
            </View>
            <View style={styles.pie}>
               <FlatList
                  data={this.state.listPedidos}
                  renderItem={objeto => {
                     return (
                        <ItemPedido
                           pedido={objeto.item}
                           nav={this.props.navigation}
                        />
                     );
                  }}
                  keyExtractor={objeto => {
                     return objeto.id;
                  }}
               />
            </View>
         </SafeAreaView>
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
   pie: {
      flex: 3,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      paddingLeft: 25,
      marginTop: 15,
      paddingTop: 20,
   },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 25,
      paddingVertical: 10,
      alignItems: 'center',
      flexDirection: 'row',
   },
});
