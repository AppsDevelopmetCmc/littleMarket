import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function PerfilUsuario(props) {
   const { navigation } = props;

   return (
      <View style={styles.container}>
         <Text>Página para llenar la información del usuario</Text>
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
