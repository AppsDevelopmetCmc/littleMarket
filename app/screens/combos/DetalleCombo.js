import React, { Component } from 'react';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
   crearPedidoCarro,
   agregarItemCarro,
} from '../../servicios/ServicioCarroCompras';
import { ServicioCombos } from '../../servicios/ServicioCombos';
import { ItemComboProducto } from '../combos/componentes/ItemComboProducto';

export class DetalleCombo extends Component {
   constructor(props) {
      super(props);
      this.combo = this.props.route.params.combo;
      let productosCombo = [];
      this.state = {
         cantidad: '0',
         listProductosCombo: productosCombo,
      };
   }

   componentDidMount() {
      let srvCombos = new ServicioCombos();
      srvCombos.getRecuperarComboProductos(this.combo.id, this.repintarLista);
   }

   repintarLista = productosCombo => {
      this.setState({
         listProductosCombo: productosCombo,
      });
   };
   render() {
      return (
         <View style={styles.container}>
            <View style={styles.lista}>
               <Text style={styles.textoNegrita}>DETALLE COMBO</Text>
               <FlatList
                  data={this.state.listProductosCombo}
                  renderItem={objeto => {
                     return <ItemComboProducto comboProducto={objeto.item} />;
                  }}
                  keyExtractor={objetoComboProducto => {
                     return objetoComboProducto.id;
                  }}
               />
            </View>
            <View style={styles.boton}>
               <Button
                  onPress={() => {
                     let nuevaCantidad = parseInt(this.state.cantidad) - 1;
                     if (nuevaCantidad >= 0) {
                        this.setState({ cantidad: nuevaCantidad + '' });
                     }
                  }}
                  icon={<Icon name="minus-circle" size={20} color="white" />}
               />
               <TextInput
                  style={styles.caja}
                  value={this.state.cantidad}
                  disabled
               />
               <Button
                  onPress={() => {
                     let nuevaCantidad = parseInt(this.state.cantidad) + 1;
                     if (nuevaCantidad < 100) {
                        this.setState({ cantidad: nuevaCantidad + '' });
                     }
                  }}
                  icon={<Icon name="plus-circle" size={20} color="white" />}
               />
            </View>

            <Button
               title="Agregar"
               onPress={() => {
                  crearPedidoCarro(
                     {
                        id: combo.id,
                        alias: combo.alias,
                        precio: combo.precio,
                        cantidad: parseInt(this.state.cantidad),
                        subtotal: parseInt(this.state.cantidad) * combo.precio,
                     },
                     global.usuario
                  );
               }}
            ></Button>
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
   lista:{
      flex: 1 
   }
});
