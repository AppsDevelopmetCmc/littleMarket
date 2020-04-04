import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export default function PaginaIncio(props) {
   const { navigation } = props;
   return (
      <View style={styles.container}>
         <Button title="Iniciar Sesión"></Button>
         <Button
            title="Registrate"
            onPress={() => {
               navigation.navigate('Registro');
            }}
         ></Button>
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
