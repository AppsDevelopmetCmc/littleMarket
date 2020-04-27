import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
   crearPedidoCarro,
   agregarItemCarro,
} from '../../servicios/ServicioCarroCompras';

export class DetalleCombo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         cantidad: '0',
      };
   }
   render() {
      let combo = this.props.route.params.combo;
      return (
         <View style={styles.container}>
            <View>
               <Text>DETALLE COMBO</Text>
               {/*pitnar cada elemento del combo, con su precio. Aplicar estilo*/}
            </View>
            <View style={{ flexDirection: 'row' }}>
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
      alignItems: 'center',
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
});
