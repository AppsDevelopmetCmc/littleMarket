import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button, CheckBox } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Importacion de los colores
import * as colores from '../../../constants/Colores';
import Separador from '../../../components/Separador';

export class ItemPrediccion extends Component {
   constructor(props) {
      super(props);
   }
   render() {
      return (
         <View style={styles.container}>
            <TouchableHighlight
               underlayColor="white"
               onPress={() => {
                  this.props.fnbuscarCoordenadas(
                     this.props.prediccionItem.placeId, this.props.prediccionItem.descripcion
                  );
               }}
            >
               <View style={styles.fila}>
                  <Icon
                     name="map-marker"
                     size={20}
                     color={colores.colorPrimarioTomate}
                     style={styles.iconos}
                  />
                  <Separador alto={10}></Separador>
                  <View style={styles.contenedorTexto}>
                     <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {this.props.prediccionItem.descripcion}
                     </Text>
                  </View>
                  <Icon
                     name="arrow-right-bold-circle"
                     size={25}
                     color={'rgba(0,0,0,0.3)'}
                     style={styles.iconos}
                  />
               </View>
            </TouchableHighlight>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,

      //backgroundColor: 'red',
   },
   contenedorTexto: { flex: 1 },
   fila: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 20,
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
