import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Alert, Button } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../../constants/Colores';
import { transformDinero } from '../../../utils/Validaciones';
import Separador from '../../../components/Separador';
import { convertir } from '../../../utils/ConvertidorUnidades';

import {
   agregarDisminuirItemCarro,
   eliminarItemCarro,
} from '../../../servicios/ServicioCarroCompras';

export class ItemCombo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         seleccionado: false,
         checked: this.props.combo.checked,
         checkedProps: this.props.combo.checked,
      };
      console.log('--------CHECKED', this.props.combo.checked);
   }

   /*  componentWillReceiveProps(nextProps) {
      // Cada vez que props.email cambia, actualiza el estado.
      if (nextProps.combo.checked !== this.props.checked) {
         this.setState({
            checked: nextProps.combo.checked,
         });
      }
   }*/
   static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.combo.checked != prevState.checkedProps) {
         return {
            checked: nextProps.combo.checked,
            checkedProps: nextProps.combo.checked,
         };
      }
      return { checked: prevState.checked, checkedProps: prevState.checked };
   }
   render() {
      let combo = this.props.combo;
      console.log('render item combo');
      return (
         <View
            style={this.state.checked ? styles.filaSeleccionada : styles.fila}
         >
            <View style={styles.imagenes}>
               <Avatar
                  source={{ uri: this.props.combo.imagen }}
                  rounded
                  size={50}
               ></Avatar>
            </View>
            <View style={styles.informacion}>
               <View style={styles.descripcion}>
                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 18, 'bold'),
                        //styles.textoNegrita,
                     ]}
                  >
                     {this.props.combo.nombre}
                  </Text>
                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 16),
                        //styles.textoNegrita,
                     ]}
                  >
                     {convertir(
                        this.props.combo.unidad,
                        this.props.combo.cantidad
                     )}
                  </Text>
               </View>
               <View style={styles.filaFlexEnd}>
                  {/* <Text
                              style={textEstilo(
                                 colores.colorOscuroTexto,
                                 18,
                                 'normal'
                              )}
                           >
                              USD:
                           </Text> */}

                  <Text
                     style={textEstilo(colores.colorOscuroTexto, 18, 'bold')}
                  >
                     {'$ ' + transformDinero(this.props.combo.precio)}
                  </Text>
               </View>
            </View>
            <View style={styles.checked}>
               <CheckBox
                  checked={this.state.checked}
                  onPress={() => {
                     if (!this.state.checked) {
                        agregarDisminuirItemCarro(
                           {
                              id: combo.id,
                              nombre: combo.nombre,
                              unidad: combo.unidad,
                              cantidadItem: combo.cantidad,
                              precio: combo.precio,
                           },
                           global.usuario,
                           1
                        );
                     } else {
                        eliminarItemCarro(
                           {
                              id: combo.id,
                           },
                           global.usuario
                        );
                     }

                     this.setState({ checked: !this.state.checked });
                  }}
                  checkedColor={colores.colorOscuroPrimario}
                  size={30}
                  uncheckedColor={colores.colorBlanco}
               ></CheckBox>
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
      alignItems: 'stretch',
      //justifyContent: 'center',
      fontWeight: 'bold',
      //backgroundColor: 'red',
   },

   fila: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorPrimarioTomate,
      //borderBottomColor: 'gray',
      //borderBottomWidth: 1,
      marginTop: 10,
      marginLeft: 20,
      borderBottomLeftRadius: 20,
      borderTopLeftRadius: 20,
   },
   filaSeleccionada: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorClaroPrimarioAmarillo,
      //borderBottomColor: 'gray',
      //borderBottomWidth: 1,
      marginTop: 10,
      marginLeft: 20,
      borderBottomLeftRadius: 20,
      borderTopLeftRadius: 20,
      borderWidth: 3,
      borderColor: 'yellow',
   },
   imagenes: {
      flex: 3,
      // backgroundColor: 'green',
      alignItems: 'center',
      //padding: 5,
      paddingVertical: 5,
   },
   informacion: {
      flex: 10,
      alignItems: 'center',

      //backgroundColor: 'pink',
      flexDirection: 'row',
   },
   descripcion: {
      flex: 5,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'yellow',
      flexDirection: 'column',
   },

   filaFlexEnd: {
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'center',
      //backgroundColor: 'blue',
      //paddingBottom: 20,
   },
   contenido: {
      flex: 5,
      flexDirection: 'row',
      backgroundColor: 'red',
   },
   checked: {
      flex: 2,
      //backgroundColor: 'yellow',
      alignItems: 'center',
      justifyContent: 'center',
      //paddingBottom: 24.5,
   },

   textoNegrita: {
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
