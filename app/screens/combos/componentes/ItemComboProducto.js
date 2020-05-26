import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as colores from '../../../constants/Colores';
import Separador from '../../../components/Separador';
import { transformDinero } from '../../../utils/Validaciones';

export class ItemComboProducto extends Component {
   render() {
      return (
         <View style={styles.container}>
            <Text style={textEstilo(colores.colorOscuroTexto, 16, 'bold')}>
               {this.props.comboProducto.id}
            </Text>
            <View style={styles.fila}>
               <View style={styles.filaTexto}>
                  <View style={styles.contenedorTextoCantidad}>
                     <Text
                        style={textEstilo(
                           colores.colorOscuroTexto,
                           14,
                           'normal'
                        )}
                     >
                        Cantidad:
                     </Text>
                     <Separador alto={5}></Separador>
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 14, 'bold')}
                     >
                        {this.props.comboProducto.cantidad +
                           ' ' +
                           this.props.comboProducto.unidad}
                     </Text>
                  </View>

                  <View style={styles.contenedorTextoPrecio}>
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
                        {'$ ' +
                           transformDinero(this.props.comboProducto.precio)}
                     </Text>
                  </View>
               </View>
            </View>
         </View>
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
      paddingHorizontal: 25,
      paddingVertical: 2,
   },
   contenedorTextoCantidad: {
      flex: 1.5,
      marginVertical: 2,
      borderRadius: 5,
      alignItems: 'center',
      borderColor: colores.colorOscuroPrimarioAmarillo,
      flexDirection: 'row',
   },
   contenedorTextoPrecio: {
      flex: 1,
      marginVertical: 2,
      borderRadius: 5,
      alignItems: 'center',
      borderColor: colores.colorOscuroPrimarioAmarillo,
      flexDirection: 'row',
   },
   fila: {
      flex: 1,
   },
   filaTexto: { flex: 1, flexDirection: 'row' },
   button: {
      flex: 1,
      backgroundColor: 'orange',
      alignItems: 'stretch',
      justifyContent: 'center',
      marginEnd: 20,
   },
});
