import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';


export class ItemDetallePedido extends Component{
    constructor(props) {
        super(props);
        this.alias='';
        this.precio='';
        this.recuperarDatosCombo();
        
     }

     recuperarDatosCombo=()=>{
      for (let index = 0; index < global.combos.length; index++) {
         const element = global.combos[index];
         console.log("antes "+element.id);
         if(global.combos[index].id === this.props.detallePedido.id){
            console.log("despues "+ global.combos[index].alias);
            this.alias= global.combos[index].alias;
            break;
         }
         
      }

     }
     render() {
        return (    
           <View style={styles.fila}>
              <View style={styles.contenido}>
                 <View style={styles.subContenido}>
                  
                    <View style={styles.contenido}>
                       <View style={styles.container}>
                          <Text style={styles.textoNegrita}>
                              {this.alias}
                          </Text>
                       </View>
                       <View style={styles.filaFlexEnd}>
                          <Text style={styles.textoNegrita}>Cantidad:</Text>
                          <Text style={styles.texto}>
                          {this.props.detallePedido.cantidad}
                          </Text>
                       </View> 
                       <View style={styles.filaFlexEnd}>
                          <Text style={styles.textoNegrita}>Precio:</Text>
                          <Text style={styles.texto}>
                              {this.precio}
                          </Text>
                       </View>                      
                       
                    </View>
                 </View>
              </View>
             
           </View>
        );
     }
  }
  
  const styles = StyleSheet.create({
     container: {
        flex: 1,
  
        alignItems: 'stretch',
        justifyContent: 'center',
        fontWeight: 'bold',
        //backgroundColor: 'red',
     },
     fila: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'orange',
        //borderBottomColor: 'gray',
        //borderBottomWidth: 1,
        marginTop: 10,
        marginLeft: 20,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
     },
     filaFlexEnd: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
     },
     contenido: {
        flex: 4,
        alignItems: 'stretch',
        //backgroundColor: 'pink',
     },
     checked: {
        flex: 1,
        //backgroundColor: 'yellow',
        alignItems: 'center',
        justifyContent: 'center',
     },
     subContenido: {
        flex: 1,
        flexDirection: 'row',
        //backgroundColor: 'red',
     },
     imagenes: {
        flex: 1,
        //  backgroundColor: 'green',
        alignItems: 'center',
        padding: 20,
     },
     textoNegrita: {
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 0,
        marginLeft: 10,
     },
     texto: {
        fontSize: 15,
        marginTop: 0,
        marginLeft: 10,
     },
     textoNegritaSubrayado: {
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 0,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
     },
     boton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
     },
     caja: {
        width: 40,
        height: 35,
        textAlign: 'center',
        textAlignVertical: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        // marginLeft: 10,
        //marginRight: 10,
        //  textAlign: 'right',
        paddingRight: 5,
     },
  });