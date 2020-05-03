import React, { Component } from 'react';
import { Text, View, Button, FlatList } from 'react-native';
import { ServicioCarroCompras } from '../../servicios/ServicioCarroCompras';
import { ItemCarro } from '../../screens/carroCompras/componentes/ItemCarro';
import { StackActions } from '@react-navigation/native';

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

   render() {
      return (
         <View>
            <Text>TU COMPRA </Text>
            <Button
               title="Seguir comprando"
               onPress={() => {
                  this.props.navigation.dispatch(StackActions.popToTop());
               }}
            />
            {
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
            }
         </View>
      );
   }
}
