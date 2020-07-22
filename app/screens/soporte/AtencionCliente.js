import React, { Component } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, Linking } from 'react-native';
import * as colores from '../../constants/Colores';
import { Icon } from 'react-native-elements';
import Separador from '../../components/Separador';
import { callNumber } from '../../utils/Contacto';

export class AtencionCliente extends Component {
   constructor(props) {
      super(props);
      this.state = {
         listaCargada: false,
      };
   }
   componentDidMount() {
      console.log('soporte');
   }
   render() {
      return (
         <View style={styles.contenedorPagina}>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 25, 'bold')}>
                  Atención al Cliente
               </Text>
            </View>

            <View style={styles.pie}>
               <View style={styles.contenedorTextoInfo}>
                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 16, 'bold'),
                        styles.textoAlineacion,
                     ]}
                  >
                     Para consultas, sugerencias y quejas contáctanos por estos
                     medios.
                  </Text>
                  <View style={{ marginTop: 20 }}>
                     <View>
                        <Icon
                           name="phone-outgoing"
                           type="material-community"
                           color={colores.colorOscuroPrimarioTomate}
                           size={50}
                           onPress={() => {
                              callNumber('0998668633');
                           }}
                        />
                        <Text
                           style={[
                              textEstilo(
                                 colores.colorPrimarioTexto,
                                 18,
                                 'bold'
                              ),
                              styles.textoAlineacion,
                           ]}
                        >
                           Llamada
                        </Text>
                     </View>
                     <Separador alto={20}></Separador>
                     <View>
                        <Icon
                           color={colores.colorPrimarioVerde}
                           type="material-community"
                           name="whatsapp"
                           size={50}
                           onPress={() => {
                              console.log('OK Pressed');
                              let text = 'Solicito la atención de un asesor.';
                              let numero = '593998668633';
                              Linking.openURL(
                                 'whatsapp://send?text=' +
                                    text +
                                    '&phone=' +
                                    numero
                              );
                           }}
                        />
                        <Text
                           style={[
                              textEstilo(
                                 colores.colorPrimarioTexto,
                                 18,
                                 'bold'
                              ),
                              styles.textoAlineacion,
                           ]}
                        >
                           WhatsApp
                        </Text>
                     </View>
                     <Separador alto={20}></Separador>
                     <View>
                        <Icon
                           name="email-outline"
                           type="material-community"
                           color={colores.colorOscuroPrimarioAmarillo}
                           size={50}
                           onPress={() => {
                              Linking.openURL(
                                 'mailto:apps.developmet.cmc@gmail.com?subject=Atencion'
                              );
                           }}
                        />
                        <Text
                           style={[
                              textEstilo(
                                 colores.colorPrimarioTexto,
                                 18,
                                 'bold'
                              ),
                              styles.textoAlineacion,
                           ]}
                        >
                           Correo
                        </Text>
                     </View>
                  </View>
                  <Separador alto={30}></Separador>
                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 16, 'bold'),
                        styles.textoAlineacion,
                     ]}
                  >
                     Horarios de Atención
                  </Text>

                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 13, 'normal'),
                        styles.textoAlineacion,
                     ]}
                  >
                     Domingo a Martes : 8:00am - 5:00pm
                  </Text>

                  <Text
                     style={[
                        textEstilo(colores.colorOscuroTexto, 13, 'normal'),
                        styles.textoAlineacion,
                     ]}
                  >
                     Miércoles a Sábado : 8:00am - 7:00pm
                  </Text>
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
      paddingTop: 50,
   },
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 40,
   },
   pie: {
      flex: 3,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 30,
      marginTop: 30,
      paddingTop: 30,
   },
   estiloContenedor1: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   estiloInputContenedor: {
      padding: 0,
      height: 40,
   },
   estiloInput: { fontSize: 15 },
   btnStyles: {
      marginTop: 50,
      width: '100%',
      height: 40,
   },
   btnGuardar: {
      paddingHorizontal: 40,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 25,
   },
   contenderLista: { marginTop: 15 },
   contenedorTextoVacio: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      marginBottom: 60,
   },
   contenedorTextoInfo: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
   },
   textoAlineacion: { textAlign: 'center' },
});
