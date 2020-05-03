import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ServicioCarroCompras } from '../../servicios/ServicioCarroCompras';
import { ItemCarro } from '../../screens/carroCompras/componentes/ItemCarro';
import { StackActions } from '@react-navigation/native';
import * as colores from '../../constants/Colores';
export class CarroCompras extends Component {
   constructor(props) {
      super(props);
      this.pintarBoton = false;
      let items = [];
      this.state = {
         listItems: items,
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
      this.setState({
         listItems: items,
      });
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
      return (
         <View>
            <Text>TU COMPRA </Text>
            <View style={styles.contenedorBoton}>
               <Button
                  title="Seguir comprando"
                  onPress={() => {
                     this.props.navigation.dispatch(StackActions.popToTop());
                  }}
                  titleStyle={this.textEstilo(colores.colorBlanco, 15, 'bold')}
                  containerStyle={styles.btnStyles}
                  buttonStyle={styles.btnRegistrarse}
                  icon={
                     <Icon
                        name="arrow-left-bold-circle"
                        size={20}
                        color="white"
                     />
                  }
               />
            </View>
            <View>
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
            <View style={styles.botones}>
               <Button
                  title="Comprar"
                  onPress={() => {
                     this.props.navigation.navigate('ConfirmarCompraScreen');
                  }}
                  titleStyle={this.textEstilo(colores.colorBlanco, 15, 'bold')}
                  containerStyle={styles.btnStyles}
                  buttonStyle={styles.btnRegistrarse}
                  icon={
                     <Icon
                        name="arrow-right-bold-circle"
                        size={20}
                        color="white"
                     />
                  }
               />
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      marginTop: 80,
   },
   cantidad: {
      flex: 1,
      backgroundColor: 'blue',
      flexDirection: 'row',
      justifyContent: 'center',
   },
   elemento: {
      flex: 1,
      alignItems: 'center',
   },
   caja: {
      width: 40,
      textAlign: 'right',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      borderColor: 'black',
      borderWidth: 1,
      marginLeft: 10,
      marginRight: 10,
      //  textAlign: 'right',
      paddingRight: 5,
   },
   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      marginLeft: 10,
   },
   boton: {
      flexDirection: 'row',
      justifyContent: 'center',
   },
   lista: {
      flex: 1,
   },
   contenedorBoton: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
   },
   btnRegistrarse: {
      padding: 10,
      backgroundColor: colores.colorOscuroPrimarioTomate,
      borderRadius: 10,
   },
   botones: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
   },
});
