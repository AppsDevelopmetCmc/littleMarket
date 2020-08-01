import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import * as colores from '../../../constants/Colores';
export class ItemMapDireccion extends Component {
   constructor(props) {
      super(props);
   }
   componentDidMount() {}
   render() {
      return (
         <View
            style={
               this.props.direccion.itemSeleccionado
                  ? styles.filaSeleccionada
                  : styles.fila
            }
         >
            <View style={styles.touch}>
               <View style={styles.contenido}>
                  <TouchableOpacity
                     onPress={() => {
                        this.props.fnActualizar(this.props.direccion);
                     }}
                  >
                     <View style={styles.subContenido}>
                        <View style={styles.descripcion}>
                           <Text style={styles.texto}>
                              {this.props.direccion.descripcion}
                           </Text>
                        </View>
                     </View>
                  </TouchableOpacity>
               </View>
            </View>
            <View style={styles.contenedorEliminar}>
               <Button
                  buttonStyle={styles.estiloBotonEliminar}
                  onPress={() => {
                     this.props.fnEliminar(this.props.direccion);
                  }}
                  icon={
                     <Icon
                        name="delete"
                        size={15}
                        color={colores.colorBlanco}
                        style={styles.iconoStilos}
                     />
                  }
               />
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   fila: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorBlanco,
      marginTop: 5,
      borderRadius: 15,
   },

   contenido: {
      //  width: '100%',
      // flexDirection: 'row',
      flex: 6,
      // backgroundColor: 'purple',
   },
   contenedorEliminar: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 10,
      // backgroundColor: 'blue',
   },

   subContenido: {
      flexDirection: 'row',
      paddingLeft: 10,
      paddingVertical: 15,
      alignItems: 'center',
   },

   texto: {
      fontSize: 13,
      fontWeight: 'bold',
   },
   descripcion: {
      flex: 4,
   },
   touch: {
      flex: 6,
      flexDirection: 'row',
   },
   estiloIconoCobertura: { marginRight: 15 },
   estiloBotonEliminar: {
      width: 30,
      height: 30,
      borderRadius: 10,
      backgroundColor: colores.colorPrimarioTomate,
   },
   filaSeleccionada: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorPrimarioAmarilloRgba,
      marginTop: 5,
      borderRadius: 15,
   },
});
