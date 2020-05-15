import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as colores from '../../../constants/Colores';
import Separador from '../../../components/Separador';

export class ItemDetallePedido extends Component{
    constructor(props) {
        super(props);
        this.alias='';
        this.precio='';
        this.subtotal='';
        this.recuperarDatosCombo();
        
     }

     recuperarDatosCombo=()=>{
      for (let index = 0; index < global.combos.length; index++) {
         const element = global.combos[index];
         console.log("antes "+element.id);
         if(global.combos[index].id === this.props.detallePedido.id){
            console.log("despues "+ global.combos[index].alias);
            this.alias= global.combos[index].alias;
            this.precio= global.combos[index].precio;
            
            
            break;
         }         
      }

     }
     render() {
        return (    
         <View style={styles.fila}>
         <View style={styles.contenido}>
            <View style={styles.contenidoDetalle}>
               <Text style={styles.textoNegrita}>
                  {this.alias}
               </Text>
               <Text style={styles.texto}>Cantidad</Text>
               <Text style={styles.textoNegrita}>
                  {this.props.detallePedido.cantidad}
               </Text>
               <View style={styles.contenedorPares}>
                  <Text style={styles.texto}>Precio</Text>
                  <Text style={styles.textoNegrita}>
                     {this.precio}
                  </Text>
               </View>
               
            </View>
            <Separador alto={30}></Separador>
            <View style={styles.contenidoDetalle}>
               <Text style={styles.texto}>Dirección</Text>
               <Text
                  style={textEstilo(colores.colorOscuroTexto, 12, 'bold')}
               >
                 {/*  {this.props.pedido.direccion} */}
               </Text> 

               
               <View style={styles.contenedorPares}>
                  <Text style={styles.texto}>Sub Total:</Text>
                  <Text
                     style={textEstilo(
                        colores.colorOscuroTexto,
                        20,
                        'bold'
                     )}
                  >
                    {this.subtotal}
                  </Text>
               </View>

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
      flexDirection: 'row',
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
