import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {Text } from 'react-native-elements';

export class Referidos extends Component{
    constructor(props){
        super(props);
        this.pedido= this.props.route.params.pedido;
    
    }
    componentDidMount() {
       let srvDetallePedido = new ServicioPedidos();
    let detallePedido = [];
    srvDetallePedido.recuperarDetallePedido(
        detallePedido, 
        this.repintarLista, 
        this.pedido);
 }
}