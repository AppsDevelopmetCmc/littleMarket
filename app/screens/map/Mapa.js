import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

export function Mapa(props) {
   const { navigation } = props;

   return (
      <View style={styles.container}>
         <Text>Página para visualizar el mapa</Text>
         <Button
            title="Ir a Tabs"
            onPress={() => {
               navigation.navigate('HomeTab');
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
