import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';

const dividirNumero = numero => {
   let partes = (numero + '').split('.');
   if (partes && partes[1] && partes[1].length == 1) {
      partes[1] = partes[1] + '0';
   }
   return partes;
};
export function Numero(props) {
   return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
         <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text>{props.titulo}</Text>
         </View>
         <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
               style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  marginLeft: 1,
                  //  backgroundColor: 'blue',
               }}
            >
               <Text>{dividirNumero(props.valor)[0]}.</Text>
            </View>
            <Text
               style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  //backgroundColor: 'red',
               }}
            >
               {dividirNumero(props.valor)[1]}
            </Text>
         </View>
      </View>
   );
}
