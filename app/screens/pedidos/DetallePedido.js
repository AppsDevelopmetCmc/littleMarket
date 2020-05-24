import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Button } from 'react-native';
import {Text } from 'react-native-elements';
import { ServicioPedidos } from '../../servicios/ServicioPedidos';
import { ItemDetallePedido } from './componentes/ItemDetallePedido';
import { SafeAreaView } from 'react-native-safe-area-context';

//Importacion de los colores
import * as colores from '../../constants/Colores';
// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import { agregarDisminuirItemCarro, ServicioCarroCompras } from '../../servicios/ServicioCarroCompras';

export class DetallePedido extends Component {
   constructor(props) {
      super(props);
      this.pedido = this.props.route.params.pedido;
      let detallePedido = [];
      this.state = {
         cantidad: '0',
         listDetallePedido: detallePedido,
      };
   }

   componentDidMount() {
      let srvDetallePedido = new ServicioPedidos();
      let detallePedido = [];
      srvDetallePedido.recuperarDetallePedido(
          detallePedido, 
          this.repintarLista, 
         this.pedido
      );
   }

   repintarLista = detallePedido => {
      this.setState({
        listDetallePedido: detallePedido,
      });
   };

   repetir = () => {
      new ServicioCarroCompras().eliminarCarro(global.usuario)
      for(let i =0; i< this.state.listDetallePedido.length; i++){
         agregarDisminuirItemCarro(this.state.listDetallePedido[i], global.usuario,0);
      }
   }

   render() {
      //let combo = this.props.route.params.pedido;
      const { navigation } = this.props;
      return (
         <SafeAreaView style={styles.container}>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}>
                  DETALLE DE PEDIDO
               </Text>
            </View>
            <View>
               <Text>Asociado: {this.pedido.nombreAsociado}</Text>
               <Text>Fecha de Entrega:{this.pedido.fechaEntrega}</Text>
               <Text>Hora de Entrega: {this.pedido.horarioEntrega}</Text>
               <Text>Estado: {this.pedido.estado}</Text>
            </View>
            <View style={styles.pie}>
               <FlatList
                  data={this.state.listDetallePedido}
                  renderItem={objeto => {
                     return (
                        <ItemDetallePedido
                           detallePedido={objeto.item}
                           nav={this.props.navigation}
                        />
                     );
                  }}
                  keyExtractor={objeto => {
                     return objeto.id;
                  }}
               />
         </View>
            {this.pedido.estado == "PE" ? (
               <Button title="Repetir" onPress={() => {
               this.repetir();
                  navigation.navigate("CarroComprasScreen");
               }}></Button>
            ):null}
           
         </SafeAreaView>
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
      backgroundColor: colores.colorPrimarioVerde,
   },
   pie: {
      flex: 3,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      paddingLeft: 25,
      marginTop: 15,
      paddingTop: 20,
   },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 25,
      //paddingVertical: 0,
      //alignItems: 'center',
      //flexDirection: 'row',
   },
});
