import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Button } from 'react-native';
import { Text } from 'react-native-elements';
import { ServicioPedidos } from '../../servicios/ServicioPedidos';
import { ItemDetallePedido } from './componentes/ItemDetallePedido';
import { SafeAreaView } from 'react-native-safe-area-context';

//Importacion de los colores
import * as colores from '../../constants/Colores';
// Importacion de Cabecera Personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import {
   agregarDisminuirItemCarro,
   ServicioCarroCompras,
} from '../../servicios/ServicioCarroCompras';
import Separador from '../../components/Separador';

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
      new ServicioCarroCompras().eliminarCarro(global.usuario);
      for (let i = 0; i < this.state.listDetallePedido.length; i++) {
         agregarDisminuirItemCarro(
            this.state.listDetallePedido[i],
            global.usuario,
            0
         );
      }
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
      //let combo = this.props.route.params.pedido;
      const { navigation } = this.props;
      return (
         <SafeAreaView style={styles.container}>
            <View style={styles.cabecera}>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}>
                  Detalle de Pedido
               </Text>
            </View>
            <View style={styles.pie}>
               <View style={styles.contenedorLista}>
                  <View style={styles.cabeceraContenedorLista}>
                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Orden:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.pedido.orden}
                        </Text>
                     </View>

                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Asociado:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.pedido.nombreAsociado}
                        </Text>
                     </View>

                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Dirección:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={[textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           ), {flex:2}]}
                        ><Text>{this.pedido.direccion}</Text>
                           
                        </Text>
                     </View>

                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Fecha de entrega:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.pedido.fechaEntrega}
                        </Text>
                     </View>
                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Hora de entrega:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.pedido.horarioEntrega}
                        </Text>
                     </View>
                     <View style={styles.textoPares}>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'bold'
                           )}
                        >
                           Estado:
                        </Text>
                        <Separador alto={10}></Separador>
                        <Text
                           style={textEstilo(
                              colores.colorOscuroTexto,
                              14,
                              'normal'
                           )}
                        >
                           {this.pedido.estado}
                        </Text>
                     </View>
                  </View>
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
                     ItemSeparatorComponent={this.flatListItemSeparator}
                  />
               </View>
            </View>
            {this.pedido.estado == 'PC' ? (
               <Button
                  title="Repetir"
                  onPress={() => {
                     this.repetir();
                     navigation.navigate('CarroComprasScreen');
                  }}
               ></Button>
            ) : null}
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
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 20,
      marginTop: 15,
      paddingTop: 10,
   },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 30,
   },
   contenedorLista: {
      flex: 1,
      backgroundColor: 'rgba(247,217,30,0.4)',
      marginTop: 20,
      marginBottom: 15,
      borderRadius: 30,
   },
   cabeceraContenedorLista: {
      backgroundColor: colores.colorPrimarioAmarillo,
      borderTopStartRadius: 25,
      borderTopEndRadius: 25,
      paddingVertical: 15,
      alignContent: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      paddingLeft: 20,
   },
   textoPares: { flexDirection: 'row' },
});
