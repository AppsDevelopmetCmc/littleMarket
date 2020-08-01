import React, { Component } from 'react';
import {
   View,
   Text,
   StyleSheet,
   Image,
   Alert,
   TouchableOpacity,
   Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import * as colores from '../constants/Colores';
export class Selector extends Component {
   constructor(props) {
      super(props);
      console.log('SELECCIONADO', this.props.seleccionado);
      this.state = {
         seleccionado1: this.props.seleccionado == this.props.valor1.valor,
         seleccionado2: this.props.seleccionado == this.props.valor2.valor,
         seleccionado3:
            this.props.valor3 &&
            this.props.seleccionado == this.props.valor3.valor,
         valorSeleccionado: this.props.seleccionado,
      };
   }

   render() {
      //valor incluye texto, icono
      let { valor1, valor2, valor3, fnSeleccionar } = this.props;
      let { seleccionado1, seleccionado2, seleccionado3 } = this.state;
      let colorRadio = this.props.color
         ? this.props.color
         : colores.colorPrimarioTomate;
      let tamanioRadio = 25;
      return (
         <View style={styles.contenido}>
            <TouchableOpacity
               onPress={() => {
                  this.setState({
                     seleccionado1: true,
                     seleccionado2: false,
                     seleccionado3: false,
                     valorSeleccionado: valor1.valor,
                  });
                  fnSeleccionar(valor1.valor);
               }}
            >
               <View
                  style={seleccionado1 ? styles.itemSeleccionado : styles.item}
               >
                  <View
                     style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                     }}
                  >
                     <Icon2
                        name={
                           seleccionado1
                              ? 'md-radio-button-on'
                              : 'md-radio-button-off'
                        }
                        size={tamanioRadio}
                        color={colorRadio}
                     ></Icon2>
                  </View>
                  <View
                     style={{
                        flex: 8,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                     }}
                  >
                     <Text>{valor1.contenido}</Text>
                  </View>
               </View>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => {
                  this.setState({
                     seleccionado1: false,
                     seleccionado2: true,
                     seleccionado3: false,
                     valorSeleccionado: valor2.valor,
                  });
                  fnSeleccionar(valor2.valor);
               }}
            >
               <View
                  style={seleccionado2 ? styles.itemSeleccionado : styles.item}
               >
                  <View style={{ flex: 1, alignItems: 'center' }}>
                     <Icon2
                        name={
                           seleccionado2
                              ? 'md-radio-button-on'
                              : 'md-radio-button-off'
                        }
                        size={tamanioRadio}
                        color={colorRadio}
                     ></Icon2>
                  </View>
                  <View style={{ flex: 8, alignItems: 'flex-start' }}>
                     <Text>{valor2.contenido}</Text>
                  </View>
               </View>
            </TouchableOpacity>
            {valor3 ? (
               <TouchableOpacity
                  onPress={() => {
                     this.setState({
                        seleccionado1: false,
                        seleccionado2: false,
                        seleccionado3: true,
                        valorSeleccionado: valor3.valor,
                     });
                     fnSeleccionar(valor3.valor);
                  }}
               >
                  <View
                     style={
                        seleccionado3 ? styles.itemSeleccionado : styles.item
                     }
                  >
                     <View style={{ flex: 1, alignItems: 'center' }}>
                        <Icon2
                           name={
                              seleccionado3
                                 ? 'md-radio-button-on'
                                 : 'md-radio-button-off'
                           }
                           size={tamanioRadio}
                           color={colorRadio}
                        ></Icon2>
                     </View>
                     <View style={{ flex: 8, alignItems: 'flex-start' }}>
                        <Text>{valor3.contenido}</Text>
                     </View>
                  </View>
               </TouchableOpacity>
            ) : (
               <View></View>
            )}
         </View>
      );
   }
}

const styles = StyleSheet.create({
   contenedor: {
      flex: 1,
   },
   item: {
      flexDirection: 'row',
      // backgroundColor: 'white',
      paddingVertical: 5,
   },
   itemSeleccionado: {
      flexDirection: 'row',
      // backgroundColor: 'yellow',
      paddingVertical: 10,
   },
   icono: {
      color: 'red',
   },
});
