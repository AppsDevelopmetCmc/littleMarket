import React, { Component } from 'react';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { agregarDisminuirItemCarro } from '../../servicios/ServicioCarroCompras';
import { ServicioCombos } from '../../servicios/ServicioCombos';
import { ItemComboProducto } from '../combos/componentes/ItemComboProducto';
import * as colores from '../../constants/Colores';

export class DetalleCombo extends Component {
   constructor(props) {
      super(props);
      this.combo = this.props.route.params.combo;
      let productosCombo = [];
      this.state = {
         cantidad: '0',
         listProductosCombo: productosCombo,
      };
   }

   repintarLista = productosCombo => {
      this.setState({
         listProductosCombo: productosCombo,
      });
   };
   flatListItemSeparator = () => {
      return (
         <View
            style={{
               width: '100%',
               marginVertical: 5,
               alignItems: 'center',
               justifyContent: 'center',
               alignContent: 'center',
            }}
         >
            <View
               style={{
                  height: 1,
                  width: '85%',
                  backgroundColor: colores.colorOscuroPrimarioAmarillo,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
               }}
            ></View>
         </View>
      );
   };
   render() {
      let combo = this.props.route.params.combo;
      return (
         <View style={styles.container}>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'normal')}>
                  Detalle
               </Text>
               <Text style={textEstilo(colores.colorBlancoTexto, 20, 'bold')}>
                  {combo.alias}
               </Text>
            </View>
            <View style={styles.pie}>
               <View style={styles.contenedorLista}>
                  <View style={styles.cabeceraContenedorLista}>
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 16, 'bold')}
                     >
                        Lista de productos
                     </Text>
                  </View>

                  <FlatList
                     data={global.combos[this.combo.id]}
                     renderItem={objeto => {
                        return (
                           <ItemComboProducto comboProducto={objeto.item} />
                        );
                     }}
                     keyExtractor={objetoComboProducto => {
                        return objetoComboProducto.id;
                     }}
                     ItemSeparatorComponent={this.flatListItemSeparator}
                  />
               </View>
               <View style={styles.contenedorBoton}>
                  <Button
                     title="Añadir al carrito"
                     buttonStyle={styles.btnRegistrarse}
                     titleStyle={this.textEstilo(
                        colores.colorBlanco,
                        15,
                        'bold'
                     )}
                     onPress={() => {
                        agregarDisminuirItemCarro(
                           {
                              id: combo.id,
                              alias: combo.alias,
                              precio: combo.precio,
                           },
                           global.usuario,
                           1,
                           this.regresar
                        );
                     }}
                  ></Button>
               </View>
            </View>
         </View>
      );
   }
   regresar = () => {
      this.props.navigation.navigate('CarroComprasScreen');
   };
   textEstilo = (color, tamaño, tipo) => {
      return {
         color: color,
         fontSize: tamaño,
         fontWeight: tipo,
      };
   };
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
      backgroundColor: colores.colorPrimarioVerde,
   },
   cantidad: {
      flex: 1,
      backgroundColor: 'blue',
      flexDirection: 'row',
      justifyContent: 'center',
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 10,
      marginTop: 30,
   },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 30,
      justifyContent: 'space-between',
   },
   contenedorLista: {
      flex: 1,
      backgroundColor: 'rgba(247,217,30,0.4)',
      marginHorizontal: 10,
      marginTop: 20,
      marginBottom: 15,
      borderRadius: 30,
   },
   btnRegistrarse: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 180,
      borderRadius: 25,
      marginBottom: 40,
      marginTop: 10,
   },
   contenedorBoton: {
      alignItems: 'center',
   },
   iconoStilos: { paddingRight: 15 },
   contenedorContador: {
      height: 50,
      width: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colores.colorBlanco,
      flexDirection: 'row',
   },
   contenedorAgregar: { alignItems: 'center' },
   btnSumar: { width: 40, backgroundColor: colores.colorPrimarioTomate },
   cabeceraContenedorLista: {
      backgroundColor: colores.colorPrimarioAmarillo,
      borderTopStartRadius: 25,
      borderTopEndRadius: 25,
      paddingVertical: 15,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
   },
});
