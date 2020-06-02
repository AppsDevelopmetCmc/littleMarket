import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, CheckBox } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';

import * as colores from '../.././../constants/Colores';
import Separador from '../../../components/Separador';

export class ItemFactura extends Component {
   constructor(props) {
      super(props);
      this.state = {
         seleccionado: false,
      };
   }
   render() {
      return (
         <View style={styles.contenedorPrincipal}>
            <View style={styles.tituloContenedor}>
               <View style={{ flexDirection: 'row' }}>
                  <Text
                     style={textEstilo(colores.colorPrimarioTexto, 16, 'bold')}
                  >
                     CI:
                  </Text>
                  <Text
                     style={textEstilo(colores.colorPrimarioTexto, 16, 'bold')}
                  >
                     {this.props.factura.numDocumento}
                  </Text>
               </View>
               <View style={styles.boton}>
                  <Button
                     buttonStyle={styles.plusButton}
                     onPress={() => {
                        this.props.nav.navigate(
                           'EditarDatosFacturacionScreen',
                           {
                              factura: this.props.factura,
                              refrescar: this.props.refrescar,
                           }
                        );
                     }}
                     icon={<Icon name="pencil" size={15} color="white" />}
                  ></Button>
                  <Separador alto={15}></Separador>
                  <Button
                     buttonStyle={styles.plusButton}
                     onPress={() => {
                        this.props.fnEliminarFactura(this.props.factura.id);
                     }}
                     icon={<Icon name="delete" size={15} color="white" />}
                  ></Button>
               </View>
            </View>
            <View style={styles.fila}>
               <View style={styles.contenido}>
                  <View style={styles.subContenido}>
                     <View style={styles.contenido}>
                        <View style={styles.contenedorPares}>
                           <Text style={styles.textoNegrita}>Alias:</Text>
                           <Text style={styles.texto}>
                              {' ' + this.props.factura.alias}
                           </Text>
                        </View>
                        <View style={styles.contenedorPares}>
                           <Text style={styles.textoNegrita}>
                              Nombre/Razón Social:
                           </Text>
                           <Text style={styles.texto}>
                              {' ' + this.props.factura.nombreCompleto}
                           </Text>
                        </View>
                        <View style={styles.contenedorPares}>
                           <Text style={styles.textoNegrita}>
                              Tipo de documento:
                           </Text>
                           <Text style={styles.texto}>
                              {' ' + this.props.factura.tipoDocumento}
                           </Text>
                        </View>
                        <View style={styles.contenedorPares}>
                           <Text style={styles.textoNegrita}>
                              Cédula / Ruc:
                           </Text>
                           <Text style={styles.texto}>
                              {' ' + this.props.factura.numDocumento}
                           </Text>
                        </View>
                        <View style={styles.contenedorPares}>
                           <Text style={styles.textoNegrita}>Correo:</Text>
                           <Text style={styles.texto}>
                              {' ' + this.props.factura.correo}
                           </Text>
                        </View>
                        <View style={styles.contenedorPares}>
                           <Text style={styles.textoNegrita}>Teléfono:</Text>
                           <Text style={styles.texto}>
                              {' ' + this.props.factura.telefono}
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
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
      justifyContent: 'center',
      fontWeight: 'bold',
      //backgroundColor: 'red',
   },
   fila: {
      flexDirection: 'row',
      marginTop: 5,
      borderRadius: 20,
   },
   contenedorPares: {
      flex: 1,
      flexDirection: 'row',
   },
   contenido: { paddingVertical: 5, paddingHorizontal: 10 },
   checked: {
      flex: 1,
      //backgroundColor: 'yellow',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 20,
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
      fontSize: 15,
   },
   texto: {
      fontSize: 15,
   },
   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },
   contenedorPrincipal: {
      flex: 1,
      backgroundColor: colores.colorPrimarioAmarilloRgba,
      marginTop: 5,
      borderRadius: 20,
   },
   tituloContenedor: {
      backgroundColor: colores.colorPrimarioAmarillo,
      borderTopStartRadius: 20,
      borderTopEndRadius: 20,
      paddingVertical: 10,
      alignItems: 'center',
      paddingHorizontal: 20,
      flexDirection: 'row',
   },
   boton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
   },
   plusButton: {
      backgroundColor: colores.colorOscuroPrimarioTomate,
      borderRadius: 15,
   },
});
