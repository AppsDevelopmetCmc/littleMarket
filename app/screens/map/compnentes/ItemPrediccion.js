import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button, CheckBox } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export class ItemPrediccion extends Component {
   constructor(props) {
      super(props);
   }
   render() {
      return (
         <TouchableHighlight
            underlayColor="white"
            onPress={() => {
               this.props.fnbuscarCoordenadas(
                  this.props.prediccionItem.placeId
               );
            }}
         >
            <View style={styles.fila}>
               <Text style={{ fontSize: 16 }}>
                  {this.props.prediccionItem.descripcion}
               </Text>
            </View>
         </TouchableHighlight>
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
      //backgroundColor: 'orange',
      //borderBottomColor: 'gray',
      //borderBottomWidth: 1,
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 20,
      borderBottomLeftRadius: 20,
      borderTopLeftRadius: 20,
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
