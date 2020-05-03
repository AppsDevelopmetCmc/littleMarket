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

   componentDidMount() {
      let srvCombos = new ServicioCombos();
      srvCombos.getRecuperarComboProductos(this.combo.id, this.repintarLista);
   }

   repintarLista = productosCombo => {
      this.setState({
         listProductosCombo: productosCombo,
      });
   };
   render() {
      let combo = this.props.route.params.combo;
      return (
         <View style={styles.container}>
            <View style={styles.contenedorBoton}>
               <Button
                  title="Agregar"
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
                  icon={<Icon name="cart" size={15} color="white" />}
                  titleStyle={this.textEstilo(colores.colorBlanco, 15, 'bold')}
                  containerStyle={styles.btnStyles}
                  buttonStyle={styles.btnRegistrarse}
               ></Button>
            </View>
            <View style={styles.lista}>
               <Text style={styles.textoNegrita}>DETALLE COMBO</Text>

               <FlatList
                  data={this.state.listProductosCombo}
                  renderItem={objeto => {
                     return <ItemComboProducto comboProducto={objeto.item} />;
                  }}
                  keyExtractor={objetoComboProducto => {
                     return objetoComboProducto.id;
                  }}
               />
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
});
