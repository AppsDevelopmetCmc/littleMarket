import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import {ServicioPedidos} from '../../servicios/ServicioPedidos';
import { StackActions } from '@react-navigation/native';

export class ListaPedidos extends Component {
   constructor(props){
   super(props);
   let pedidos=[];
   this.state={
      listPedidos:pedidos,
   }
   let srvServicioPedidos = new ServicioPedidos();
   srvServicioPedidos.re
}

repintarLista=(pedidos)=>{
   this.setState({listPedidos:pedidos});
}

   render() {
      return (
         <View styles={styles.container}>
            <Text>LISTA DE PRODUCTOS </Text>
            <Button
               title="Cerrar Sesión"
               onPress={() => {
                  firebase.auth().signOut();
                  console.log('Se cerro sesion');
               }}
            ></Button>
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
