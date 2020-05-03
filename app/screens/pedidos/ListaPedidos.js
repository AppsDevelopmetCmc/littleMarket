import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import {ServicioPedidos} from '../../servicios/ServicioPedidos';
import {ItemPedido} from './componentes/ItemPedido'

export class ListaPedidos extends Component {
   constructor(props){
   super(props);
   let pedidos=[];
   this.state={
      listPedidos:pedidos,
   }
   
}
componentDidMount() {
   let srvServicioPedidos = new ServicioPedidos();
   let pedidos=[];
   srvServicioPedidos.registrarEscuchaTodas(
      pedidos,
      this.repintarLista,
      global.usuario
   );
}

repintarLista=(pedidos)=>{
   this.setState({listPedidos:pedidos});
}
   render() {
      return (
         <View styles={styles.container}>
            <Text>LISTA DE PEDIDOS </Text>
            {
               <FlatList
                  data={this.state.listPedidos}
                  renderItem={objeto => {
                     return (
                        <ItemPedido pedido ={objeto.item}
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
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 60,
   },
});
