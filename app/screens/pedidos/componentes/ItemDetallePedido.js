import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as colores from '../../../constants/Colores';
import Separador from '../../../components/Separador';

import { ServicioCombos } from '../../../servicios/ServicioCombos';

export class ItemDetallePedido extends Component{
    constructor(props) {
        super(props);
      this.descripcion = '';
      new ServicioCombos().recuperarComboProductos(this.props.detallePedido.id);
        this.recuperarDatosCombo();
     }

     recuperarDatosCombo=()=>{
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
               <Text style={styles.textoNegrita}>
                  {this.props.detallePedido.alias}
               </Text>
            </View>
            <View style={styles.contenido}>
               <Text style={styles.texto}>Cantidad: </Text>
               <Text style={styles.textoNegrita}>
                  {this.props.detallePedido.cantidad}
               </Text>

               <Text style={styles.texto}>Precio: </Text>
                  <Text style={styles.textoNegrita}>
                  {this.props.detallePedido.precio}
               </Text>
               <Text style={styles.texto}>Subtotal:</Text>
               <Text style={textEstilo(colores.colorOscuroTexto, 15, 'bold')}>
                  {this.props.detallePedido.subtotal}
                  </Text>
               </View>
            <View style={styles.contenido}>
               <Text style={styles.texto}>Detalle</Text>
               <Text style={textEstilo(colores.colorOscuroTexto, 12, 'bold')}>
                  {this.descripcion}
                  </Text>
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
      flexDirection: 'column',
      backgroundColor: colores.colorPrimarioAmarillo,
      marginTop: 5,
      borderTopStartRadius: 30,
      borderBottomStartRadius: 30,
   },

   contenido: {
      paddingVertical: 10,
      flex: 1,
      paddingHorizontal: 10,
      flexDirection: 'row',
   },
   
   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 14,
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
});
