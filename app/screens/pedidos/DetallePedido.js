import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {Text } from 'react-native-elements';
import { ServicioPedidos } from '../../servicios/ServicioPedidos';
import {ItemDetallePedido} from './componentes/ItemDetallePedido'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';

//Importacion de los colores
import * as colores from '../../constants/Colores';
// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';


export class DetallePedido extends Component {
   constructor(props) {
      super(props);
      this.pedido = this.props.route.params.pedido;
      let detallePedido = [];
      this.state = {
         cantidad: '0',
         listDetallePedido: detallePedido,
      };
   }

   componentDidMount() {
      let srvDetallePedido = new ServicioPedidos();
      let detallePedido = [];
      srvDetallePedido.recuperarDetallePedido(
          detallePedido, 
          this.repintarLista, 
          this.pedido);
   }

   repintarLista = detallePedido => {
      this.setState({
        listDetallePedido: detallePedido,
      });
   };

   render() {
      //let combo = this.props.route.params.pedido;
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
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}>
                  DETALLE DE PEDIDOS
               </Text>
            </View>
            <View style={styles.pie}>
               <FlatList
                  data={this.state.listDetallePedido}
                  renderItem={objeto => {
                     return (
                        <ItemDetallePedido detallePedido ={objeto.item}
                        nav={this.props.navigation} />
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
 