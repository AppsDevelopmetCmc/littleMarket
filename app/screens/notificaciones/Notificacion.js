import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input,Button, Icon } from 'react-native-elements';
import * as colores from '../../constants/Colores';
import { SafeAreaView } from 'react-native-safe-area-context';

export class Notificacion extends Component {

  constructor() {
    super();

    this.state = {
      numero: 1,
      codigoReferido:'',
    }

  }

  generarNumeroRandom = () => {
    var numeroRandom = Math.floor(Math.random() * 100) + 1;
    this.setState({numero: numeroRandom})
    this.setState({codigoReferido:global.usuario.substring(0,1)+global.usuario.substring(3,4)+numeroRandom})
  }
  textEstilo = (color, tamaño, tipo) => {
      return {
         color: color,
         fontSize: tamaño,
         fontWeight: tipo,
      };
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
        
        <SafeAreaView style={styles.contenedorPagina}>
            <View style={styles.cabecera}>
               <View style={styles.tituloCabecera}>
                  <Text
                     style={this.textEstilo(
                        colores.colorBlancoTexto,
                        20,
                        'bold'
                     )}
                  >
                     Notificaciones
                  </Text>
                  <Text style={textEstilo(colores.colorBlancoTexto, 20, 'bold')}>
                     {global.usuario}
                  </Text>
               </View>  
               <View style={styles.contenedorBoton}>

                   <Button
                     title="Regresar"
                     onPress={() => {
                        this.props.navigation.goBack()
                      }}
                     titleStyle={this.textEstilo(
                        colores.colorBlancoTexto,
                        12,
                        'normal'
                     )}
                     buttonStyle={styles.estiloBotonS}
                     icon={
                        <Icon
                           name="arrow-left-bold-circle"
                           size={20}
                           color="white"
                           style={styles.iconoIzquierda}
                        />
                     }
                   />
               </View>
               

            </View>   

            <View style={styles.pie}>
            <Input
               placeholder="Ingrese codigo promo"
               containerStyle={styles.estiloContenedor1}
               inputContainerStyle={styles.estiloInputContenedor}
               inputStyle={styles.estiloInput}               
              
               labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
               
               rightIcon={
                  <Icon
                     type="material-community"
                     name="coin"
                     iconStyle={styles.iconRight}
                  ></Icon>
               }
            ></Input>


             <View style={styles.contenedorBoton}>
                  <Text >{this.state.codigoReferido.toUpperCase()}</Text>
                  <Button title="Generar" onPress={this.generarNumeroRandom} />               
             </View>

             <Text
                     style={this.textEstilo(
                        colores.colorNegro,
                        20,
                        'bold'
                     )}
                  >
                     Tu monedero es de $: 5
             </Text>


            <View style={styles.contenedorBoton}>
            <Button
               title="Registrar Cupón"
               titleStyle={textEstilo(colores.colorBlanco, 15, 'bold')}
               containerStyle={styles.btnStyles}
               buttonStyle={styles.btnRegistrarse}
               onPress={() => {
                this.props.navigation.goBack()
              }}
            ></Button>
            </View>
            
         </View>
               
              

               
               
              
               
            
            
         </SafeAreaView>

        


    );
  }
}


const styles = StyleSheet.create({
    contenedorBoton: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
    },
    contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
    cabecera: {
       backgroundColor: colores.colorPrimarioVerde,
       paddingHorizontal: 40,
       paddingTop: 30,
    },
    pie: {
       flex: 4,
       backgroundColor: colores.colorBlanco,
       borderTopStartRadius: 30,
       borderTopEndRadius: 30,
       paddingHorizontal: 15,
       marginTop: 30,
       paddingTop: 20,
    },
    tituloCabecera: { paddingBottom: 20 },
    estiloBoton: {
       backgroundColor: colores.colorOscuroPrimarioTomate,
       width: 130,
       height: 45,
       borderRadius: 100,
       paddingHorizontal: 15,
    },
    estiloBotonS: {
       backgroundColor: colores.colorOscuroPrimarioVerde,
       width: 130,
       height: 45,
       borderRadius: 100,
       paddingHorizontal: 15,
    },
    iconoDerecha: { paddingLeft: 5 },
    iconoIzquierda: { paddingRight: 5 },
    
    estiloInput: { fontSize: 15 },
   iconRight: { color: colores.colorClaroTexto },
   btnStyles: {
      marginTop: 50,
      width: '100%',
      height: 40,
   },
   btnRegistrarse: {
      padding: 10,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 25,
   },
 });
 