import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Mapa() {
   return (
      <View style={styles.container}>
         <Text>Direcciones para mapa</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
