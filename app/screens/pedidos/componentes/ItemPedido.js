import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';


export class ItemPedido extends Component{
    constructor(props) {
        super(props);
     }

     render() {
        return (
        <TouchableHighlight
            onPress={() => {
               this.props.nav.navigate('DetallePedidoScreen', {
                  pedido: this.props.pedido,
               });
            }}
         >         
           <View style={styles.fila}>
              <View style={styles.contenido}>
                 <View style={styles.subContenido}>
                  
                    <View style={styles.contenido}>
                       
                       <View style={styles.filaFlexEnd}>
                          <Text style={styles.textoNegrita}>Fecha del Pedido:</Text>
                          <Text style={styles.texto}>
                             {this.props.pedido.fechaPedido}
                          </Text>
                       </View>  
                       <View style={styles.filaFlexEnd}>
                          <Text style={styles.textoNegrita}>Fecha de Entrega:</Text>
                          <Text style={styles.texto}>
                             {this.props.pedido.fechaEntrega}
                          </Text>
                       </View>  
                       <View style={styles.filaFlexEnd}>
                          <Text style={styles.textoNegrita}>Estado:</Text>
                          <Text style={styles.texto}>
                             {this.props.pedido.estado}
                          </Text>
                       </View> 
                       <View style={styles.filaFlexEnd}>
                          <Text style={styles.textoNegrita}>Dirección:</Text>
                          <Text style={styles.texto}>
                             {this.props.pedido.direccion}
                          </Text>
                       </View>  
                       <View style={styles.filaFlexEnd}>
                          <Text style={styles.textoNegrita}>Total:</Text>
                          <Text style={styles.texto}>
                             {this.props.pedido.total}
                          </Text>
                       </View>              

                    </View>
                 </View>
              </View>
             
  
             
           </View>
           </TouchableHighlight>
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