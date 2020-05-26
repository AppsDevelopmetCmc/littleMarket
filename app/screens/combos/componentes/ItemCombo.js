import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button, CheckBox } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../../constants/Colores';
import { transformDinero } from '../../../utils/Validaciones';
import Separador from '../../../components/Separador';

export class ItemCombo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         seleccionado: false,
      };
   }
   render() {
      return (
         <TouchableHighlight
            underlayColor="white"
            onPress={() => {
               this.props.nav.navigate('DetalleComboScreen', {
                  combo: this.props.combo,
               });
            }}
         >
            <View style={styles.fila}>
               <View style={styles.contenido}>
                  <View style={styles.subContenido}>
                     <View style={styles.imagenes}>
                        <Avatar
                           rounded
                           size={65}
                           source={{ uri: this.props.combo.imagen }}
                        />
                     </View>
                     <View style={styles.contenido}>
                        <View style={styles.container}>
                           <Text
                              style={[
                                 textEstilo(
                                    colores.colorOscuroTexto,
                                    18,
                                    'bold'
                                 ),
                                 styles.textoNegrita,
                              ]}
                           >
                              {this.props.combo.alias}
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
                           <Separador alto={10}></Separador>
                           <Text
                              style={textEstilo(
                                 colores.colorOscuroTexto,
                                 24,
                                 'bold'
                              )}
                           >
                              {'$ ' + transformDinero(this.props.combo.precio)}
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
               <View style={styles.checked}>
                  <Icon
                     name="arrow-right-bold-circle"
                     size={28}
                     color="white"
                  />
               </View>
            </View>
         </TouchableHighlight>
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
      justifyContent: 'center',
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
   filaFlexEnd: {
      flexDirection: 'row',
      paddingBottom: 20,
   },
   contenido: {
      flex: 4,
   },
   checked: {
      flex: 1,
      //backgroundColor: 'yellow',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 24.5,
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
