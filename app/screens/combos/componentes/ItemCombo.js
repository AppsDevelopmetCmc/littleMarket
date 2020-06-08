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
            <View style={styles.colorLinea}></View>
            <View style={styles.imagenes}>
               <Avatar
                  source={{ uri: this.props.combo.imagen }}
                  rounded
                  size={40}
               ></Avatar>
            </View>
            <View style={styles.informacion}>
               <View style={styles.descripcion}>
                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 16, 'bold'),
                        //styles.textoNegrita,
                     ]}
                  >
                     {this.props.combo.nombre}
                  </Text>
                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 14),
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
                     style={textEstilo(colores.colorOscuroTexto, 16, 'bold')}
                  >
                     {'$ ' + transformDinero(this.props.combo.precio)}
                  </Text>
               </View>
            </View>
            <View style={styles.checked}>
               <CheckBox
                  checked={this.state.checked}
                  containerStyle={styles.contenedorCheckItem}
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
                  checkedColor={colores.colorOscuroPrimarioTomate}
                  size={22}
                  uncheckedColor={colores.colorOscuroPrimario}
               ></CheckBox>
            </View>
         </View>
      );
   }
}

const borderLinea = 15;

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
   },

   fila: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorBlanco,
      marginTop: 2,
      marginLeft: 15,
      borderBottomLeftRadius: 6,
      borderTopLeftRadius: 6,
   },
   filaSeleccionada: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colores.colorPrimarioAmarilloRgba,
      marginTop: 2,
      marginLeft: 15,
      borderBottomLeftRadius: 6,
      borderTopLeftRadius: 6,
   },
   imagenes: {
      flex: 3,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
   },
   informacion: {
      flex: 10,
      flexDirection: 'row',
   },
   descripcion: {
      flex: 5,
      marginLeft: 15,
      flexDirection: 'column',
      justifyContent: 'center',
   },

   filaFlexEnd: {
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'center',
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
   colorLinea: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 5,
      borderTopStartRadius: borderLinea,
      borderBottomStartRadius: borderLinea,
   },
});
