import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export class ItemComboProducto extends Component {
   render() {
      return (
         <View style={styles.fila}>
            <View style={styles.contenido}>
               <View style={styles.imagenes}>
                  <Avatar
                     rounded
                     size={25}
                     source={{ uri: this.props.comboProducto.imagen }}
                  />
               </View>
               <View style={styles.columna}>
                  <View style={styles.contenido}>
                     <Text style={styles.textoNegrita}>
                        {this.props.comboProducto.id}
                     </Text>
                  </View>

                  <View style={styles.filaCenter}>
                     <Text style={styles.texto}>
                        {this.props.comboProducto.cantidad +
                           ' ' +
                           this.props.comboProducto.unidad}
                     </Text>
                     <Text style={styles.textoNegrita}>$:</Text>
                     <Text style={styles.texto}>
                        {this.props.comboProducto.precio}
                     </Text>
                  </View>
               </View>
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
      fontWeight: 'bold',
   },
   fila: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 10,
      marginLeft: 20,
      borderBottomLeftRadius: 20,
      borderTopLeftRadius: 20,
   },
   filaCenter: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      marginRight: 10,
   },
   columna: {
      flex: 2,
      flexDirection: 'column',
   },
   contenido: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: 'orange',
      borderBottomLeftRadius: 10,
      borderTopLeftRadius: 10,
      borderBottomEndRadius: 10,
      borderTopRightRadius: 10,
      marginEnd: 20,
      flexDirection: 'row',
   },
   texto: {
      fontSize: 15,
      marginTop: 0,
      marginLeft: 10,
   },
   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      marginLeft: 10,
   },
   button: {
      flex: 1,
      backgroundColor: 'orange',
      alignItems: 'stretch',
      justifyContent: 'center',
      marginEnd: 20,
   },
   subContenido: {
      flex: 1,
      flexDirection: 'row',
      //backgroundColor: 'red',
   },
});
