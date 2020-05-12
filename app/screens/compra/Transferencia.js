import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';

//Importacion de los colores
import * as colores from '../../constants/Colores';
export class Transferencia extends Component {
   constructor() {
      super();
   }

   render() {
      return (
         <View style={styles.container}>
            <View style={styles.pie}>
               <ScrollView>
                  <Text>
                     Realice su transferencia y suba la imagen del comprobante
                  </Text>
                  <View style={styles.contenedorCards}>
                     <Card
                        title="Banco Pichincha"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Text>Clear Minds Consultores</Text>
                        <Text>Ahorros - 4045538800</Text>
                        <Text>RUC: 171233135423</Text>
                     </Card>
                     <Card
                        title="Banco de Guayaquil"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Text>Clear Minds Consultores</Text>
                        <Text>Ahorros - 4045538800</Text>
                        <Text>RUC: 171233135423</Text>
                     </Card>
                     <Card
                        title="Banco Bolivariano"
                        containerStyle={styles.contenedorTarjetas}
                     >
                        <Text>Clear Minds Consultores</Text>
                        <Text>Ahorros - 4045538800</Text>
                        <Text>RUC: 171233135423</Text>
                     </Card>
                  </View>

                  <View style={styles.contenedorBoton}>
                     <Button
                        title="Subir Imagen"
                        onPress={() => {
                           this.props.navigation.navigate('CargarImagenScreen');
                        }}
                     ></Button>
                  </View>
               </ScrollView>
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
   container: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
   },
   scrollContainer: {
      flex: 1,
      paddingHorizontal: 15,
   },
   scrollContentContainer: {
      paddingTop: 40,
      paddingBottom: 10,
   },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 20,
      paddingTop: 5,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      marginTop: 10,
   },
   contenedorTarjetas: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 15,
   },
   contenedorFechas: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
   },
   contenedorCards: { paddingVertical: 20, paddingHorizontal: 10 },
   estiloBoton: {
      paddingHorizontal: 50,
      paddingVertical: 10,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 25,
   },
   contenedorEstiloBoton: {
      width: '70%',
   },
   estiloTitulo: { color: colores.colorBlancoTexto },
   contenedorBoton: {
      alignContent: 'center',
      alignItems: 'center',
   },
});
