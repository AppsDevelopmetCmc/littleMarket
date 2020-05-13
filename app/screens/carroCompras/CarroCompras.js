import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ServicioCarroCompras } from '../../servicios/ServicioCarroCompras';
import { ItemCarro } from '../../screens/carroCompras/componentes/ItemCarro';
import { StackActions } from '@react-navigation/native';
import * as colores from '../../constants/Colores';
import { SafeAreaView } from 'react-native-safe-area-context';

export class CarroCompras extends Component {
   constructor(props) {
      super(props);
      this.pintarBoton = false;
      this.state = {
         listItems: [],
         subtotal: '0',
         delivery: '1.5',
         total: '0',
      };
   }

   componentDidMount() {
      let srvItemsCarro = new ServicioCarroCompras();
      let items = [];
      srvItemsCarro.registrarEscuchaTodas(
         items,
         this.repintarLista,
         global.usuario
      );
   }

   repintarLista = items => {
      let subtotal = 0;
      let delivery = 1.5;
      global.items = items;
      for (let i = 0; i < items.length; i++) {
         subtotal += items[i].subtotal;
      }
      global.total = subtotal + delivery;
      this.setState({
         listItems: items,
         subtotal: subtotal,
         total: subtotal + delivery,
      });
   };

   eliminarCarro = mail => {
      let srvItemsCarro = new ServicioCarroCompras();
      srvItemsCarro.eliminarCarro(mail);
   };

   eliminarItemCarro = (item, mail) => {
      let srvItemsCarro = new ServicioCarroCompras();
      srvItemsCarro.eliminarItemCarro(item, mail);
   };
   textEstilo = (color, tamaño, tipo) => {
      return {
         color: color,
         fontSize: tamaño,
         fontWeight: tipo,
      };
   };
   render() {
      let items = [];
      if (this.state.listItems) {
         items = this.state.listItems;
      }
      return (
         <SafeAreaView style={styles.contenedorPagina}>
            <View style={styles.cabecera}>
               <View style={styles.tituloCabecera}>
                  <Text
                     style={this.textEstilo(
                        colores.colorBlancoTexto,
                        20,
                        'bold'
                     )}
                  >
                     Tu Compra
                  </Text>
                  <View style={styles.contenedorBoton}>
                     {items.length > 0 ? (
                        <Button
                           title="Vaciar"
                           onPress={() => {
                              this.eliminarCarro(global.usuario);
                              this.props.navigation.goBack();
                           }}
                           titleStyle={this.textEstilo(
                              colores.colorBlancoTexto,
                              12,
                              'normal'
                           )}
                           buttonStyle={styles.estiloBotonS}
                           icon={
                              <Icon
                                 name="cart-remove"
                                 size={20}
                                 color="white"
                                 style={styles.iconoIzquierda}
                              />
                           }
                        />
                     ) : (
                        <Text></Text>
                     )}
                  </View>
               </View>

               <View style={styles.contenedorBoton}>
                  <Button
                     title="Seguir 
                     comprando"
                     onPress={() => {
                        this.props.navigation.dispatch(StackActions.popToTop());
                     }}
                     titleStyle={this.textEstilo(
                        colores.colorBlancoTexto,
                        12,
                        'normal'
                     )}
                     buttonStyle={styles.estiloBotonS}
                     icon={
                        <Icon
                           name="arrow-left-bold-circle"
                           size={20}
                           color="white"
                           style={styles.iconoIzquierda}
                        />
                     }
                  />

                  {items.length > 0 ? (
                     <Button
                        title="Comprar"
                        onPress={() => {
                           this.props.navigation.navigate(
                              'ConfirmarCompraScreen'
                           );
                        }}
                        titleStyle={this.textEstilo(
                           colores.colorBlanco,
                           15,
                           'bold'
                        )}
                        buttonStyle={styles.estiloBoton}
                        iconRight
                        icon={
                           <Icon
                              name="arrow-right-bold-circle"
                              size={30}
                              color="white"
                              style={styles.iconoDerecha}
                           />
                        }
                     />
                  ) : (
                     <Text></Text>
                  )}
               </View>
            </View>
            <View style={styles.pie}>
               {items.length > 0 ? (
                  <View>
                     <Text>SUBTOTAL:{this.state.subtotal}</Text>
                     <Text>DELIVERY:{this.state.delivery}</Text>
                     <Text>TOTAL:{this.state.total}</Text>
                  </View>
               ) : (
                  <Text>No tiene items</Text>
               )}
               <FlatList
                  data={this.state.listItems}
                  renderItem={objeto => {
                     return (
                        <ItemCarro
                           item={objeto.item}
                           fnEliminarItemCarro={this.eliminarItemCarro}
                        />
                     );
                  }}
                  keyExtractor={objetoCarro => {
                     return objetoCarro.id;
                  }}
               />
            </View>
         </SafeAreaView>
      );
   }
}

const styles = StyleSheet.create({
   contenedorBoton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 40,
      paddingTop: 30,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 15,
      marginTop: 30,
      paddingTop: 20,
   },
   tituloCabecera: { paddingBottom: 20 },
   estiloBoton: {
      backgroundColor: colores.colorOscuroPrimarioTomate,
      width: 130,
      height: 45,
      borderRadius: 100,
      paddingHorizontal: 15,
   },
   estiloBotonS: {
      backgroundColor: colores.colorOscuroPrimarioVerde,
      width: 130,
      height: 45,
      borderRadius: 100,
      paddingHorizontal: 15,
   },
   iconoDerecha: { paddingLeft: 5 },
   iconoIzquierda: { paddingRight: 5 },
});
