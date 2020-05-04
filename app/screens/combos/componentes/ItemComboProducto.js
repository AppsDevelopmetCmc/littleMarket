import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as colores from '../../../constants/Colores';
import Separador from '../../../components/Separador';

export class ItemComboProducto extends Component {
   render() {
      return (
         <View style={styles.container}>
            <Text style={textEstilo(colores.colorOscuroTexto, 16, 'bold')}>
               {this.props.comboProducto.id}
            </Text>
            <View style={styles.fila}>
               <View style={styles.filaTexto}>
                  <View style={styles.contenedorTexto}>
                     <Text
                        style={textEstilo(
                           colores.colorOscuroTexto,
                           15,
                           'normal'
                        )}
                     >
                        Cantidad:
                     </Text>
                     <Separador alto={5}></Separador>
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 15, 'bold')}
                     >
                        {this.props.comboProducto.cantidad +
                           ' ' +
                           this.props.comboProducto.unidad}
                     </Text>
                  </View>
                  <Separador alto={15}></Separador>
                  <View style={styles.contenedorTexto}>
                     <Text
                        style={textEstilo(
                           colores.colorOscuroTexto,
                           15,
                           'normal'
                        )}
                     >
                        Precio:
                     </Text>
                     <Separador alto={5}></Separador>
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 15, 'bold')}
                     >
                        {'$ ' + this.props.comboProducto.precio}
                     </Text>
                  </View>
               </View>
            </View>
         </View>
      );
   }
}

textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: 25,
      paddingVertical: 2,
   },
   contenedorTexto: {
      height: 40,
      borderRadius: 5,
      width: 130,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colores.colorOscuroPrimarioAmarillo,
      flexDirection: 'row',
   },
   fila: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   filaTexto: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
   button: {
      flex: 1,
      backgroundColor: 'orange',
      alignItems: 'stretch',
      justifyContent: 'center',
      marginEnd: 20,
   },
});
