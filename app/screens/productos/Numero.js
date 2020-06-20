import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';

const dividirNumero = numero => {
   let partes = (numero + '').split('.');
   if (partes && partes[1] && partes[1].length == 1) {
      partes[1] = partes[1] + '0';
   }
   console.log('partes', partes);
   return partes;
};
export function Numero(props) {
   console.log('VALOR', props.valor);
   return (
      <View
         style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}
      >
         <View
            style={{
               flex: 1,
               alignItems: 'flex-end',
               justifyContent: 'center',
            }}
         >
            <Text style={props.estiloNumero}>{props.titulo}</Text>
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: 'row',
               justifyContent: 'flex-end',
               alignItems: 'center',
               //backgroundColor: 'yellow',
            }}
         >
            <View
               style={{
                  flex: 2,
                  alignItems: 'flex-end',
                  marginLeft: 1,
                  //  backgroundColor: 'blue',
               }}
            >
               {props.descuento ? (
                  <Text style={props.estiloNumero}>
                     {-dividirNumero(props.valor)[0]}.
                  </Text>
               ) : (
                  <Text style={props.estiloNumero}>
                     {dividirNumero(props.valor)[0]}.
                  </Text>
               )}
            </View>
            <Text
               style={[
                  {
                     flex: 1,
                     alignItems: 'flex-end',
                     //backgroundColor: 'red',
                  },
                  props.estiloNumero,
               ]}
            >
               {dividirNumero(props.valor)[1]}
            </Text>
         </View>
      </View>
   );
}
