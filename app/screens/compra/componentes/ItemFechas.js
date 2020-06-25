import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Alert, Button,TouchableOpacity } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../../constants/Colores';
import { transformDinero } from '../../../utils/Validaciones';
import Separador from '../../../components/Separador';
import { convertir } from '../../../utils/ConvertidorUnidades';
/*import { TouchableOpacity } from 'react-native-gesture-handler';*/


export class ItemFechas extends Component {
   constructor(props) {
      super(props);
   }
   render() {
      return (
         <View style={styles.fila}>
            <View style={styles.touch}>
               <TouchableOpacity
                  onPress={() => {
                     this.props.fnSeleccionar(this.props.fecha.value)
                  }}
               >
                  <View style={styles.contenido}>
                     <View style={styles.subContenido}>
                        <View style={styles.descripcion}>
                           <Text style={styles.texto}>
                              {this.props.fecha.label}
                           </Text>
                        </View>
                     </View>
                  </View>
               </TouchableOpacity>
            </View>
            <View style={styles.contenedorEliminar}>
               <Button
               title='ok'
                  buttonStyle={styles.estiloBotonEliminar}
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
      width: '100%',
   },
   contenedorEliminar: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 10,
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
      flex: 3,
      backgroundColor:'red'
   },
   estiloIconoCobertura: { marginRight: 15 },
   estiloBotonEliminar: {
      width: 30,
      height: 30,
      borderRadius: 10,
      backgroundColor: colores.colorPrimarioTomate,
   },
});