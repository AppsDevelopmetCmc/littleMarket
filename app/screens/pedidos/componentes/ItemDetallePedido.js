import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as colores from '../../../constants/Colores';
import Separador from '../../../components/Separador';
import { transformDinero } from '../../../utils/Validaciones';

import { ServicioCombos } from '../../../servicios/ServicioCombos';

export class ItemDetallePedido extends Component {
   constructor(props) {
      super(props);
      this.descripcion = '';
      //new ServicioCombos().recuperarComboProductos(this.props.detallePedido.id);
      // this.recuperarDatosCombo();
   }

   recuperarDatosCombo = () => {
      for (
         let i = 0;
         i < global.combos[this.props.detallePedido.id].length;
         i++
      ) {
         this.descripcion +=
            global.combos[this.props.detallePedido.id][i].cantidad +
            ' ' +
            global.combos[this.props.detallePedido.id][i].unidad +
            ' x ' +
            global.combos[this.props.detallePedido.id][i].id +
            ', ';
         console.log('DESC' + this.descripcion);
      }
      //}
   };
   render() {
      return (
         <View style={styles.fila}>
            <View style={styles.contenido}>
               <Text style={textEstilo(colores.colorOscuroTexto, 15, 'bold')}>
                  {this.props.detallePedido.nombre}
               </Text>
            </View>
            <View style={styles.contenedorDatos}>
               <View style={styles.contenido}>
                  <Text style={styles.textoNegrita}>Cantidad: </Text>
                  <Text style={styles.texto}>
                     {' ' + this.props.detallePedido.cantidad}
                  </Text>
               </View>
               <View style={[styles.contenido, { flex: 1.2 }]}>
                  <Text style={styles.textoNegrita}>Precio: </Text>
                  <Text style={styles.texto}>
                     {' $ ' + transformDinero(this.props.detallePedido.precio)}
                  </Text>
               </View>
               <View style={styles.contenido}>
                  <Text style={styles.textoNegrita}>Subtotal:</Text>
                  <Text style={styles.texto}>
                     {' $ ' +
                        transformDinero(this.props.detallePedido.subtotal)}
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
   fila: {
      flex: 1,
      paddingHorizontal: 20,
      marginTop: 5,
   },

   contenido: {
      flex: 1,
      flexDirection: 'row',
   },

   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 13,
   },
   texto: {
      fontSize: 13,
   },
   contenidoDetalle: {
      paddingVertical: 10,
      justifyContent: 'center',
      paddingHorizontal: 10,
   },
   contenedorPares: { marginTop: 15 },
   estiloEstado: {
      backgroundColor: colores.colorOscuroPrimarioTomate,
      width: 100,
      height: 25,
      borderRadius: 5,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
   },
   contenedorDatos: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'space-between',
      paddingVertical: 5,
   },
});
