import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert} from 'react-native';
import { Avatar } from 'react-native-elements';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export class ItemCarro extends Component {
   constructor(props) {
      super(props);
      
   }
   render() {
      return (
            <View style={styles.fila}>
               <View style={styles.contenido}>
                  <View style={styles.subContenido}>
                     {/* <View style={styles.imagenes}>
                        <Avatar
                           rounded
                           size={70}
                           source={{ uri: this.props.combo.imagen }}
                        />
                     </View> */}
                     <View style={styles.contenido}>
                        <View style={styles.container}>
                           <Text style={styles.textoNegrita}>
                              {this.props.item.alias}
                           </Text>
                        </View>
                        <View style={styles.filaFlexEnd}>
                           <Text style={styles.textoNegrita}>Cantidad:</Text>
                           <Text style={styles.texto}>
                              {this.props.item.cantidad}
                           </Text>
                        </View>
                        <View style={styles.filaFlexEnd}>
                           <Text style={styles.textoNegrita}>Precio Unitario:</Text>
                           <Text style={styles.texto}>
                              {this.props.item.precio}
                           </Text>
                        </View>
                        <View style={styles.filaFlexEnd}>
                           <Text style={styles.textoNegrita}>Precio Total:</Text>
                           <Text style={styles.texto}>
                              {this.props.item.subtotal}
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
               <View style={styles.checked}>
                  <Icon
                     name="delete-circle"
                     size={30}
                     color="white"
                     onPress={() => {this.props.fnEliminarItemCarro(this.props.item,global.usuario)}}
                  />
               </View>
            </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,

      alignItems: 'stretch',
      justifyContent: 'center',
      fontWeight: 'bold',
      //backgroundColor: 'red',
   },
   fila: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'orange',
      //borderBottomColor: 'gray',
      //borderBottomWidth: 1,
      marginTop: 10,
      marginLeft: 20,
      borderBottomLeftRadius: 10,
      borderTopLeftRadius: 10,
   },
   filaFlexEnd: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginRight: 10,
   },
   contenido: {
      flex: 4,
      alignItems: 'stretch',
      //backgroundColor: 'pink',
   },
   checked: {
      flex: 1,
      //backgroundColor: 'yellow',
      alignItems: 'center',
      justifyContent: 'center',
   },
   subContenido: {
      flex: 1,
      flexDirection: 'row',
      //backgroundColor: 'red',
   },
   imagenes: {
      flex: 1,
      //  backgroundColor: 'green',
      alignItems: 'center',
      padding: 20,
   },
   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      marginLeft: 10,
   },
   texto: {
      fontSize: 15,
      marginTop: 0,
      marginLeft: 10,
   },
   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },
});
