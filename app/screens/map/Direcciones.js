import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function Direcciones(props) {
   const { navigation } = props;

   return (
      <View style={styles.container}>
         <Text>Direcciones para mapa</Text>

         <Button
            title="Ir a mapa"
            onPress={() => {
               navigation.navigate('Mapa');
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
