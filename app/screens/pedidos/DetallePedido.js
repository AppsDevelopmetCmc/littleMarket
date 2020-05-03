import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {Text } from 'react-native-elements';
import { ServicioPedidos } from '../../servicios/ServicioPedidos';
import {ItemDetallePedido} from './componentes/ItemDetallePedido'

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
        <View styles={styles.container}>
            <Text>DETALLE DE PEDIDOS </Text>
            {
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
            }
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
      marginTop: 80,
   },
   cantidad: {
      flex: 1,
      backgroundColor: 'blue',
      flexDirection: 'row',
      justifyContent: 'center',
   },
   elemento: {
      flex: 1,
      alignItems: 'center',
   },
   caja: {
      width: 40,
      textAlign: 'right',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      borderColor: 'black',
      borderWidth: 1,
      marginLeft: 10,
      marginRight: 10,
      //  textAlign: 'right',
      paddingRight: 5,
   },
   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      marginLeft: 10,
   },
   boton: {
      flexDirection: 'row',
      justifyContent: 'center',
   },
   lista: {
      flex: 1,
   },
});
